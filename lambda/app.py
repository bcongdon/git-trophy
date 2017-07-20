from datetime import datetime
from flask import Flask, request, Response
from processify import processify
app = Flask(__name__)


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


if __name__ == '__main__':
    app.run(debug=True)
