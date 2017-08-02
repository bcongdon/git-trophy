from datetime import timedelta


def pad_year_data(contribution_data):
    '''
    Pads first week of the year of contribution data

    Note: Assumes sorted by day in ascending order
    '''
    start_date = contribution_data[0]['day']
    weekday = start_date.isoweekday() % 7
    if weekday:
        for i in range(1, weekday + 1):
            contribution_data.insert(0, {
                'day': (start_date - timedelta(days=i)),
                'count': 0
            })
    return contribution_data


def calculate_quartiles(contribution_data):
    '''
    Finds quartile information for commits
    '''
    commits = sorted(
        [d for d in contribution_data if d['count'] > 0],
        key=lambda x: x['count']
    )

    size = len(commits)

    quartiles = [
        commits[size // 4]['count'],
        commits[size // 2]['count'],
        commits[3 * size // 4]['count'],
    ]

    return quartiles


def get_level(count, quartiles):
    '''
    Returns "level" quartile

    i.e:
        (0] percentile = 0th level
        (0, 25) percentile = 1st level
        [25, 50) percentile = 2nd level
        etc.
    '''
    if not count:
        return 0

    for idx, q in enumerate(quartiles):
        if count < q:
            return idx + 1
    return 4
