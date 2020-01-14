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


def loadCSV():
    global myWords
    try:
        myFile = open("random_words.csv")
        reader = csv.reader(myFile)
        myWords = list(reader)
        return myWords

    except FileNotFoundError:
        print("File not found\n")

    finally:
        print('Number of words loaded from CSV: %d' % (myWords[0].__len__()))


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

            print(myResults)
            return render_template('game.html')
        else:
            print('Did not receive JSON data_receive')
    else:
        # Send the word list to the web page in JSON format
        return render_template('game.html', myWords=json.dumps(myWords))


if __name__ == '__main__':
    app.run()
