from bs4 import BeautifulSoup
import requests


def get_github_user_years(username):
    req = requests.get('https://github.com/{}'.format(username))

    if req.status_code != 200:
        raise RuntimeError('Unable to get github user info')

    soup = BeautifulSoup(req.content, 'html.parser')
    timeline = soup.find('div', {'class': 'profile-timeline-year-list'})

    years = []
    if timeline:
        for entry in timeline.find_all('li'):
            years.append(entry.text.strip())
    else:
        raise RuntimeError('Unable to get user contributions info')

    return years

if __name__ == '__main__':
    print(get_github_user_years('bcongdon'))
