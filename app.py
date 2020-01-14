from flask import *
import json
import csv

app = Flask(__name__)
myWords = []


def loadCSV():
    global myWords
    try:
        myFile = open("random_text.csv")
        reader = csv.reader(myFile)
        myWords = list(reader)
        return myWords

    except FileNotFoundError:
        print("File not found\n")

    finally:
        for word in myWords:
            print(word)


loadCSV()

print('encoded')
jsonList = json.dumps(myWords)
for word in jsonList:
    print(word)
print('decoded')
decodeList = json.loads(jsonList)
for word in decodeList:
    print(word)


@app.route('/', methods=['POST', 'GET'])
def index():
    return render_template('index.html')


@app.route('/login', methods=['POST', 'GET'])
def login():
    return render_template('login.html')


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
        return render_template('game.html', myWords=json.dumps(myWords))


if __name__ == '__main__':
    app.run()
