from git_trophy_lambda import utils
from datetime import date, timedelta
from . import repo_cache
from . import repo_client

GITHUB_BASE_URL = 'https://github.com'


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


def _format_repo_url(owner, repo):
    return '{}/{}/{}'.format(GITHUB_BASE_URL, owner, repo)


def get_repo_commit_stats(owner, repo, year):
    try:
        cached = repo_cache.get_cached_data('/'.join([owner, repo]), year)
        return cached
    except:
        print("Cache missed for {}/{} {}".format(owner, repo, year))

    repo_url = _format_repo_url(owner, repo)
    since = date(year, 1, 1)
    repo_commits = repo_client.get_repo_commit_stats(repo_url, since=since)

    years_dict = {}

    # Group commits by year
    for commit in repo_commits:
        year = commit['day'].year
        if year in years_dict:
            years_dict[year].append(commit)
        else:
            years_dict[year] = [commit]

    prepared_data = {year: _prepare_commit_series(commits, year)
                     for year, commits in years_dict.items()}

    for year, data in prepared_data.items():
        if year != date.today().year:
            repo_cache.cache_data('/'.join([owner, repo]), year, data)

    return prepared_data[year]


def get_repo_years(owner, repo):
    repo_url = _format_repo_url(owner, repo)
    years = repo_client.get_repo_years(repo_url)
    return [str(y) for y in years]
