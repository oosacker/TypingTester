from flask import *
import json
import csv
import os

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
        return -1  # return -1 if no results found -- defaults to N/A in the HTML

    else:
        currentMax = 0
        for result in myResults:
            if currentMax < result.wordCount:
                currentMax = result.wordCount
                print(currentMax)
                print(result.wordCount)
        return currentMax


def loadWords():
    global myWords
    try:
        myFile = open("random_words.csv", "r", encoding="utf-8")
        # myFile = open("random_words_jp.csv", "r", encoding="utf-8") # Japanese word list for testing
        reader = csv.reader(myFile)
        myWords = list(reader)[0]  # The reader returns a 2d list so need [0]

    except FileNotFoundError:
        print("File not found\n")

    finally:
        print('Number of words loaded from CSV: %d' % (myWords.__len__()))


# Saves ALL results to the CSV
def saveAllResults():
    global myResults
    count = 0
    try:
        myFile = open("results.csv", 'w', newline='')
        writer = csv.writer(myFile)
        for res in myResults:
            count += 1
            writer.writerow([res.userName, res.wordCount, res.maxTime])

    except FileNotFoundError:
        print("File not found\n")

    finally:
        print('Number of results saved to CSV: %d' % count)


# Save a single results to CSV, note the use of 'a' which means 'append' (only add a single row)
def saveResult(result):
    try:
        # if isFileEmpty("results.csv"):
        #     myFile = open("results.csv", 'a', newline='')
        # else:
        myFile = open("results.csv", 'a', newline='')

        writer = csv.writer(myFile)
        writer.writerow([result.userName, result.wordCount, result.maxTime])

    except FileNotFoundError:
        print("File not found\n")

    finally:
        print('Result saved to CSV')


def isFileEmpty(file):
    if os.stat(file).st_size <= 0:
        print('File is empty: %s' % file)
        return True
    else:
        print('File is not empty: %s' % file)
        return False


def loadResults():
    global myResults
    myResults.clear()
    count = 0

    try:
        if isFileEmpty("results.csv"):
            return

        myFile = open("results.csv")
        reader = csv.reader(myFile)

        for row in reader:
            print(row)
            userName = row[0]
            wordCount = int(row[1])
            maxTime = int(row[2])
            loaded_res = gameResult(userName, wordCount, maxTime)
            myResults.append(loaded_res)
            count += 1

    except FileNotFoundError:
        print("File not found: results.csv\n")

    finally:
        print('Number of previous results loaded from CSV: %d' % count)


loadWords()
loadResults()


@app.route('/', methods=['POST', 'GET'])
def index():
    return render_template('index.html')


@app.route('/about')
def about():
    return render_template('about.html')
# @app.route('/login', methods=['POST', 'GET'])
# def login():
#     return render_template('login.html')


@app.route('/results', methods=['POST', 'GET'])
def results():
    return render_template('results.html', myResults=myResults)


# This is for the javascript app to fetch the high score.
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


# This is for the javascript app to fetch the high score.
# @app.route("/get_words", methods=['GET'])
# def get_words():
#     if request.method == 'GET':
#         print('get words')
#         return json.dumps(myWords)  # serialize and use JSON headers
#     else:
#         print('Invalid request @ /get_highscore')


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

            saveResult(myResult)

            return render_template('game.html')
        else:
            print('Did not receive JSON')
    else:
        return render_template('game.html', myWords=json.dumps(myWords))


if __name__ == '__main__':
    app.run()
