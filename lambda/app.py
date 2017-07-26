from datetime import datetime
from flask import Flask, request, Response, jsonify
from processify import processify
from github_contributions import GithubUser
from flask_cors import CORS
app = Flask(__name__)
CORS(app)


@processify
def do_render(username, year):
    from model_generator import get_model_data
    return get_model_data(username, year)


@app.route('/v1/model')
def generate_model():
    username = request.args.get('user')
    year = int(request.args.get('year', datetime.now().year - 1))
    x3d_data = do_render(username, year)
    return Response(x3d_data, mimetype='model/x3d+xml')


@app.route('/v1/contributions/<username>/<year>')
def contributions(username, year):
    contributions = GithubUser(username).contributions(
        end_date='{}-12-31'.format(year)
    )

    return jsonify({
        'status': 'success',
        'username': 'username',
        'year': 'year',
        'contributions': [dict(day=d.date, count=d.count, level=d.level)
                          for d in contributions.days]
    })


@app.route('/v1/years/<username>')
def years(username):
    pass


if __name__ == '__main__':
    app.run(debug=True)
