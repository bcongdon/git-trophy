import delegator
import tempfile
import os
from datetime import date, timedelta
from dateutil.parser import parse
import shutil
import requests
from bs4 import BeautifulSoup
import math
import repo_cache

COMMITS_PER_PAGE = 35


def _is_git_available():
    return delegator.run('git --version').return_code == 0

# Import git if necessary
if not _is_git_available():
    import git_lambda
    git_lambda.setup()
    if not _is_git_available():
        raise RuntimeError("Couldn't get a version of git to run!")


def get_repo_commit_stats(repo_url, since=None, until=None):
    prev_dir = os.getcwd()
    with tempfile.TemporaryDirectory() as tmpdirname:
        os.chdir(tmpdirname)
        print("Cloning")

        clone_command = [
            'git',
            'clone',
            '--bare',
            '--single-branch',
            repo_url,
            'repo'
        ]

        if since:
            clone_command.append('--shallow-since=%s' % since.isoformat())

        delegator.run(
            ' '.join(clone_command)
        )

        os.chdir(os.path.join(tmpdirname, 'repo'))

        print("Logging")
        log = (delegator
               .run(' '.join(
                   ['git', 'log', '--pretty=format:"%ad"', '--date=short'])
               )
               .pipe('sort')
               .pipe(' '.join(['uniq', '-c']))).out
        shutil.rmtree(os.path.join(tmpdirname, 'repo'))
    os.chdir(prev_dir)

    days = []
    dates = {}
    for line in log.split('\n'):
        arr = line.strip().split(' ')
        if len(arr) != 2 or not arr[1].strip():
            continue
        try:
            day, count = parse(arr[1]).date(), int(arr[0])
            days.append(dict(day=day, count=count))
            dates[day] = True
        except:
            print("Failed: " + str(arr))

    # Fill in empty dates as necessary
    if since and until:
        curr = since
        while curr <= until:
            if curr not in dates:
                days.append(dict(day=curr, count=0))
            curr += timedelta(days=1)

    days = sorted(days, key=lambda x: x['day'])
    repo_cache.cache_data(repo_url, days)
    days = filter(lambda x: since <= x['day'] <= until, days)
    return [dict(day=x['day'].isoformat(), count=x['count'])
            for x in days]


def _get_num_commits(repo_url):
    req = requests.get(repo_url)
    soup = BeautifulSoup(req.content, 'html.parser')
    num_commits = int(soup
                      .find('li', {'class': 'commits'})
                      .find('span', {'class': 'num'}).text.replace(',', ''))
    return num_commits


def get_repo_years(repo_url):
    num_commits = _get_num_commits(repo_url)
    last_page = requests.get(
        repo_url + '/commits',
        params=dict(page=math.ceil(num_commits / COMMITS_PER_PAGE))
    )
    soup = BeautifulSoup(last_page.content, 'html.parser')
    commit = soup.find_all('li', {'class': 'commits-list-item'})[-1]
    timestamp = commit.find('relative-time')['datetime']
    initial_year = parse(timestamp).date().year
    return list(range(initial_year, date.today().year + 1))[::-1]


if __name__ == '__main__':
    # print(get_commit_stats('https://github.com/apache/spark', date(2017, 1, 1)))
    print(get_repo_years('https://github.com/torvalds/linux'))
