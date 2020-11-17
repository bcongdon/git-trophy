import delegator
import tempfile
import os
from datetime import date
from dateutil.parser import parse
import shutil
import requests
from bs4 import BeautifulSoup
import math
from collections import Counter
import logging
logger = logging.getLogger(__name__)

COMMITS_PER_PAGE = 35


def _is_git_available():
    return delegator.run('git --version').return_code == 0

# Import git if necessary
if not _is_git_available():
    import git_lambda
    git_lambda.setup()
    if not _is_git_available():
        raise RuntimeError("Couldn't get a version of git to run!")


def get_repo_commit_stats(repo_url, since=None):
    prev_dir = os.getcwd()
    with tempfile.TemporaryDirectory() as tmpdirname:
        os.mkdir(os.path.join(tmpdirname, 'repo'))
        logger.info("Cloning: {}".format(repo_url))

        clone_command = [
            'git',
            'clone',
            '--bare',
            '--single-branch',
            repo_url,
            os.path.join(tmpdirname, 'repo')
        ]

        if since:
            clone_command += ['--shallow-since', since.isoformat()]

        clone = delegator.run(' '.join(clone_command))

        if clone.return_code != 0:
            raise RuntimeError(
                'Return code from git clone was {}. '.format(
                    clone.return_code
                ) +
                'Stderr: {}'.format(clone.err)
            )

        os.chdir(os.path.join(tmpdirname, 'repo'))
        logger.info('pwd: ' + delegator.run('pwd').out)

        logger.info("Logging commits for {}".format(repo_url))
        log = delegator.run(
            ' '.join(['git', 'log', '--pretty=format:"%ad"', '--date=short'])
        )
        shutil.rmtree(os.path.join(tmpdirname, 'repo'))
    os.chdir(prev_dir)

    if log.return_code != 0:
        raise RuntimeError(
            'Return code from git log was {}. '.format(log.return_code) +
            'Stderr: {}'.format(log.err)
        )

    days = []
    counts = Counter(log.out.split('\n'))
    for day, count in counts.items():
        if not day or not day.strip():
            continue
        day = parse(day).date()
        try:
            days.append(dict(day=day, count=count))
        except:
            logger.error('Unable to parse day: {}'.format(day))

    days = [d for d in days if d['day'] >= since]
    return [dict(day=x['day'], count=x['count']) for x in days]


def _get_num_commits(repo_url):
    req = requests.get(repo_url)
    soup = BeautifulSoup(req.content, 'html.parser')
    num_commits = int(soup
                      .find('svg', {'class': 'octicon-history'})
                      .parent
                      .find('strong').text.replace(',', ''))
    return num_commits


def get_repo_years(repo_url):
    num_commits = _get_num_commits(repo_url)
    last_page = requests.get(
        repo_url + '/commits',
        params=dict(page=math.ceil(num_commits / COMMITS_PER_PAGE))
    )
    soup = BeautifulSoup(last_page.content, 'html.parser')
    commit = soup.find_all('li', {'class': 'js-commits-list-item'})[-1]
    timestamp = commit.find('relative-time')['datetime']
    initial_year = parse(timestamp).date().year
    return list(range(initial_year, date.today().year + 1))[::-1]


if __name__ == '__main__':
    # print(get_commit_stats('https://github.com/apache/spark', date(2017, 1, 1)))
    print(get_repo_years('https://github.com/torvalds/linux'))
