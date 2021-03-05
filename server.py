from flask_socketio import SocketIO, emit
from flask import Flask, send_from_directory
from flask_cors import CORS
from random import random
from threading import Thread, Event
from time import sleep
import json
import os

app = Flask(__name__, static_folder='./build/static')
app.config['SECRET_KEY'] = 'secret!'

socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)

#variables

gameStatus = False
joinStatus = False
players = []
visitors = []
board = [None,None,None,None,None,None,None,None,None]
end = False

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

# Handle the webapp connecting to the websocket
@socketio.on('connect')
def test_connect():
    print('someone connected to websocket')
    emit('responseMessage', {'data': 'Connected! ayy'})

@socketio.on_error_default  # handles all namespaces without an explicit error handler
def default_error_handler(e):
    print('An error occured:')
    print(e)

@socketio.on('getGameStatus')
def getGameStatus():
    socketio.emit('gameStatus', data=(gameStatus, joinStatus))

@socketio.on('newGame')
def newGame(name):
    global gameStatus
    global players
    gameStatus = True
    players.append(name)
    
    socketio.emit('newGameCreated')

@socketio.on('joining')
def joining(name):
    global players
    global joinStatus
    joinStatus = True
    players.append(name)
    socketio.emit('joinConfirmed')

@socketio.on('visiting')
def visiting(name):
    global visitors
    visitors.append(name)
    print(visitors)
    socketio.emit('visitConfirmed')
    socketio.emit('visitors', visitors)

@socketio.on('newRoomJoin')
def newRoomJoin():
    if len(players) == 1:
        socketio.emit('waiting')
    else:
        socketio.emit('starting', data=(players, visitors), broadcast=True)

@socketio.on('move')
def move(piece, index):
    global board
    print(piece)
    print(index)
    if board[index] == None and end == False:
        print('true')
        board[index] = piece
        print(board)
        if piece == 'X':
            turn = 'O'
        else:
            turn = 'X'
        print(turn)
        socketio.emit('update', data=(board, turn))

@socketio.on('win')
def win(winner):
    socketio.emit('win', winner)
@socketio.on('over')
def over():
    socketio.emit('over')
@socketio.on('playAgainRequest')
def playAgainRequest():
    global gameStatus
    global joinStatus
    global players
    global board
    gameStatus = False
    joinStatus = False
    players = []
    visitors = []
    board = [None,None,None,None,None,None,None,None,None]
    socketio.emit('again')
if __name__ == '__main__':
    socketio.run(app, debug=False,host=os.getenv('IP', '0.0.0.0'),port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)))
