from flask import *
import json

app = Flask(__name__)

previous_scores = []


@app.route('/', methods=['POST', 'GET'])
def index():
    return render_template('index.html')


@app.route('/game', methods=['POST', 'GET'])
def game():
    if request.method == 'POST':
        if request.is_json:
            print('got json')
            data = json.loads(request.get_data())
            print(data)
            return render_template('game.html')
        else:
            print('not json')
    else:
        return render_template('game.html')


if __name__ == '__main__':
    app.run()
