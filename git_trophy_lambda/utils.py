from datetime import timedelta

GITHUB_MAGIC = 3.77972616981

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


def _github_outliers(counts):
    mean = sum(counts) / len(counts)
    firstPass = sum((c - mean) ** 2 for c in counts)
    stdVar = (firstPass / (len(counts) - 1)) ** 0.5

    if len(set(counts)) < 5:
        return []

    outlier_set = set(
        c for c in counts if abs(mean - c) / stdVar > GITHUB_MAGIC
    )

    max_c = max(counts)
    if max_c - mean < 6 or max_c < 15:
        num_outliers = 1
    else:
        num_outliers = 3

    return list(outlier_set)[:num_outliers]


def calculate_github_quartiles(contribution_data):
    '''
    Finds quartile information for commits
    '''
    commits = sorted(
        [d for d in contribution_data if d['count'] > 0],
        key=lambda x: x['count']
    )

    outliers = _github_outliers([x['count'] for x in commits])
    top_val = max(x['count'] for x in commits if x not in outliers)

    quartiles = [
        top_val // 4,
        top_val // 2,
        (top_val * 3) // 4
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
        if count <= q:
            return idx + 1
    return 4
