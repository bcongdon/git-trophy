from datetime import datetime, date
from flask import Flask, request, Response, jsonify, abort
from processify import processify
from github_contributions import GithubUser
from scraper import get_github_user_years
from flask_cors import CORS
app = Flask(__name__)
CORS(app)


@processify
def do_render(username, year):
    from model_generator import get_model_data
    return get_model_data(username, year)


# @app.route('/v1/model')
def generate_model():
    username = request.args.get('user')
    year = int(request.args.get('year', datetime.now().year - 1))
    x3d_data = do_render(username, year)
    return Response(x3d_data, mimetype='model/x3d+xml')


def get_user_contributions(github_entity, year):
    try:
        contributions = GithubUser(github_entity).contributions(
            end_date='{}-12-31'.format(year)
        )
    except:
        abort(400, 'unable to get data for entity: {}'.format(github_entity))

    return [
        dict(
            day=d.date.isoformat(),
            count=d.count,
            level=d.level
        )
        for d in contributions.days
    ]


@app.route('/v1/contributions')
def contributions():
    github_entity = request.args.get('entity')

    if not github_entity:
        return jsonify(error='must provide entity'), 400

    try:
        year = int(request.args.get('year'))
    except:
        return jsonify(error='invalid year'), 400

    if '/' in github_entity:
        # TODO: process repo
        pass
    else:
        contributions_data = get_user_contributions(github_entity, year)

    return jsonify({
        'status': 'success',
        'entity': github_entity,
        'year': year,
        'contributions': contributions_data
    })


@app.route('/v1/years')
def years():
    github_entity = request.args.get('entity')

    if not github_entity:
        return jsonify(error='must provide entity'), 400

    if '/' in github_entity:
        # TODO: Process repo
        years = []
    else:
        try:
            years = get_github_user_years(github_entity)
        except:
            return jsonify(error='unable to get years'), 400
    return jsonify(years=years)


@app.errorhandler(400)
def error_handler(error):
    return jsonify({'error': error.description}), 400


if __name__ == '__main__':
    app.run(debug=True)
