import delegator
import tempfile
import os
import re
from dateutil.parser import parse

# Import git if necessary
if delegator.run('git --version').return_code != 0:
    import git_lambda
    git_lambda.setup()


def get_commit_stats(repo_url):
    prev_dir = os.getcwd()
    with tempfile.TemporaryDirectory() as tmpdirname:
        os.chdir(tmpdirname)
        print("Cloning")
        delegator.run(
            ' '.join(['git', 'clone', '--bare', repo_url, 'repo'])
        )

        os.chdir('./repo')

        print("Logging")
        log = (delegator
               .run(' '.join(['git', 'log']))
               .pipe(' '.join(['grep', 'Date']))
               .pipe(' '.join(['awk', '\'{print " : "$4" "$3" "$6}\'']))
               .pipe(' '.join(['uniq', '-c']))).out
    os.chdir(prev_dir)

    days = []
    for line in log.split('\n'):
        arr = line.split(':')
        if len(arr) != 2 or not arr[1].strip():
            continue
        try:
            date, count = parse(arr[1]).date(), int(arr[0])
            days.append(dict(day=date, count=count))
        except:
            print("Failed: " + str(arr))
    return sorted(days, key=lambda x: x['day'])

if __name__ == '__main__':
    get_commit_stats('https://github.com/apache/spark')

