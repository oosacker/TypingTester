from flask import *
import json
import csv

app = Flask(__name__)
myWords = []
myResults = []


class gameResult:
    def __init__(self, userName, wordCount, maxTime):
        self.userName = userName
        self.wordCount = wordCount
        self.maxTime = maxTime


def findHighestScore():
    # If result list is empty...
    if not myResults:
        return -1

    else:
        currentMax = 0
        for result in myResults:
            if currentMax < result.wordCount:
                currentMax = result.wordCount
                print(currentMax)
                print(result.wordCount)
        return currentMax


def loadCSV():
    global myWords
    try:
        myFile = open("random_words.csv")
        reader = csv.reader(myFile)
        myWords = list(reader)[0]  # The reader returns a 2d list so need [0]

    except FileNotFoundError:
        print("File not found\n")

    finally:
        print('Number of words loaded from CSV: %d' % (myWords.__len__()))


loadCSV()


@app.route('/', methods=['POST', 'GET'])
def index():
    return render_template('index.html')


@app.route('/login', methods=['POST', 'GET'])
def login():
    return render_template('login.html')


@app.route('/results', methods=['POST', 'GET'])
def results():
    return render_template('results.html', myResults=myResults)


@app.route("/get_highscore", methods=['GET'])
def get_highscore():

    if request.method == 'GET':
        # Calculate the high score
        highScore = findHighestScore()
        print('High score: %d' % highScore)
        message = {'high_score': highScore}
        return jsonify(message)  # serialize and use JSON headers
    else:
        print('Invalid request @ /get_highscore')


@app.route('/game', methods=['POST', 'GET'])
def game():
    global myResults, myWords

    if request.method == 'POST':
        if request.is_json:
            data_receive = json.loads(request.get_data())
            print('Received JSON data_receive from web app')
            print(data_receive)

            myResult = gameResult(data_receive['userName'], data_receive['wordCount'], data_receive['maxTime'])
            myResults.append(myResult)
            for result in myResults:
                print('count %d' % result.wordCount)

            return render_template('game.html')
        else:
            print('Did not receive JSON')
    else:
        return render_template('game.html', myWords=json.dumps(myWords))


if __name__ == '__main__':
    app.run()
