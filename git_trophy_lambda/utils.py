from datetime import timedelta


def pad_year_data(contribution_data):
    start_date = contribution_data[0]['day']
    weekday = start_date.isoweekday() % 7
    if weekday:
        for i in range(1, weekday + 1):
            contribution_data.insert(0, {
                'day': (start_date - timedelta(days=i)),
                'count': 0
            })
    return contribution_data
