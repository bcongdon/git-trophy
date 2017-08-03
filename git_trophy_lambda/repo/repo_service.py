from datetime import date, timedelta
from . import utils
from . import repo_cache
from . import repo_client
import logging
logger = logging.getLogger(__name__)

GITHUB_BASE_URL = 'https://github.com'
GITHUB_GIT_URL = 'git://github.com'


def _prepare_commit_series(commits, year):
    '''
    Def prepares a commit log for being published:
        - Pads days at beginning of year.
        - Fills in gaps within year
        - Sorts commits by date
        - Applies "Github level" quartiles
    '''
    days = set(c['day'] for c in commits)

    # Add missing days
    curr = date(year, 1, 1)
    while curr < date(year + 1, 1, 1):
        if curr not in days:
            commits.append(dict(day=curr, count=0))
        curr += timedelta(days=1)

    commits = sorted(commits, key=lambda x: x['day'])
    commits = utils.pad_year_data(commits)
    quartiles = utils.calculate_github_quartiles(commits)
    commits = [
        dict(
            day=c['day'].isoformat(),
            count=c['count'],
            level=utils.get_level(c['count'], quartiles)
        )
        for c in commits]
    return commits


def _format_git_url(owner, repo):
    return '{}/{}/{}'.format(GITHUB_GIT_URL, owner, repo)


def _format_repo_url(owner, repo):
    return '{}/{}/{}'.format(GITHUB_BASE_URL, owner, repo)


def get_repo_commit_stats(owner, repo, year):
    try:
        cached = repo_cache.get_cached_data('/'.join([owner, repo]), year)
        return cached
    except:
        logger.info("Cache missed for {}/{} {}".format(owner, repo, year))

    # Validate year before cloning repo
    try:
        repo_years = get_repo_years(owner, repo)
    except:
        logger.error('Failed to get repo years for {}/{}'.format(owner, repo))
    if str(year) not in repo_years:
        raise ValueError(
            'Year {} is invalid for repo {}/{}'.format(year, owner, repo)
        )

    repo_url = _format_git_url(owner, repo)
    since = date(year, 1, 1)
    repo_commits = repo_client.get_repo_commit_stats(repo_url, since=since)

    years_dict = {}

    # Group commits by year
    for commit in repo_commits:
        curr_year = commit['day'].year
        if curr_year in years_dict:
            years_dict[curr_year].append(commit)
        else:
            years_dict[curr_year] = [commit]

    prepared_data = {curr_year: _prepare_commit_series(commits, curr_year)
                     for curr_year, commits in years_dict.items()}

    for curr_year, data in prepared_data.items():
        repo_cache.cache_data('/'.join([owner, repo]), curr_year, data)

    if year not in prepared_data:
        raise ValueError(
            'Year {} not found in repo. Valid years: {}'.format(
                year, list(prepared_data.keys())
            )
        )

    return prepared_data[year]


def get_repo_years(owner, repo):
    repo_url = _format_repo_url(owner, repo)
    years = repo_client.get_repo_years(repo_url)
    return [str(y) for y in years]
