from flask import *
import time


app = Flask(__name__)


MyWords = ['apple', 'banana', 'coconut', 'domino']


def GetCurrentTime():
    return time.time()


@app.route('/', methods=['POST', 'GET'])
def index():
    myword = 'tree'
    message = 'play'
    if request.method == 'POST':
        myinput = request.form['input']
        if myinput == myword:
            message = 'well done'
        else:
            message = 'try again'
        return render_template('index.html', myword=myword, message=message)

    return render_template('index.html', myword=myword, message=message)


@app.route('/game', methods=['POST', 'GET'])
def game():
    # myword = 'tree'
    # message = 'play'
    # if request.method == 'POST':
    #     myinput = request.form['input']
    #     if myinput == myword:
    #         message = 'well done'
    #     else:
    #         message = 'try again'
    #     return render_template('game.html', input=myinput, word=myword, message=message)

    return render_template('game.html')


if __name__ == '__main__':
    app.run()
