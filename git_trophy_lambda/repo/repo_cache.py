import boto3
import os
import json
s3 = boto3.resource('s3')

BUCKET = os.environ.get('S3_CACHE_BUCKET')


def _format_filename(repo, year):
    repo = repo.replace('/', '|')
    return '|'.join([repo, str(year)])


def get_cached_data(repo, year):
    fname = _format_filename(repo, year)

    try:
        obj = s3.Object(BUCKET, fname).get()
        return json.loads(obj['Body'].read().decode('utf-8'))
    except Exception as e:
        print(e)
        raise ValueError('Could not get data from cache')


def cache_data(repo, year, contribution_data):
    fname = _format_filename(repo, year)
    data = json.dumps(contribution_data)
    s3.Bucket(BUCKET).put_object(Key=fname, Body=data)
