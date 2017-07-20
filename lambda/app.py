from datetime import datetime
from flask import Flask, request, Response
from model_generator import create_contribution_model
app = Flask(__name__)


@app.route('/v1/model')
def generate_model():
    username = request.args.get('user')
    year = int(request.args.get('year', datetime.now().year - 1))
    x3d_data = create_contribution_model(username, year)
    return Response(x3d_data, mimetype='model/x3d+xml')


if __name__ == '__main__':
    app.run(debug=True)
