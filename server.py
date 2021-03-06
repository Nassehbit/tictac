
from flask_socketio import SocketIO, emit
from flask import Flask, send_from_directory,request,jsonify
from flask_cors import CORS
from random import random
from threading import Thread, Event
from time import sleep
import json
import os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc
import config

app = Flask(__name__)
app.config.from_object(config.DevelopmentConfig)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
import  models

socketio = SocketIO(app)
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
    try:
        user=models.User.query.filter_by(username=name).first()
        if user:
            print(user)
            players.append({'name':user.username,'score':user.rank_score})

            user.rank_score += 1
            db.session.commit()
            return socketio.emit('newGameCreated')
            # return players.append( jsonify(user.serialize()))
        else:
            print('HEERER')
            new_user = models.User(username = name,rank_score = 100)
            # print('creted')
            db.session.add(new_user)
            print(db.session.commit())
            print('done')
            # user=models.User.query.filter_by(username=name).first()
            players.append({'name':new_user.username,'score':new_user.rank_score})
            # players.append(name)
            return socketio.emit('newGameCreated')
    except Exception as e:
	    return(str(e))
   




# @socketio.on('checkexistingplayer')
@socketio.on('joining')
def joining(name):
    global players
    global joinStatus
    joinStatus = True
    try:
        user=models.User.query.filter_by(username=name).first()
        if user:
            print(user)
            players.append({'name':user.username,'score':user.rank_score})

            user.rank_score += 1
            db.session.commit()
            return socketio.emit('joinConfirmed',data=(players))
            # return players.append( jsonify(user.serialize()))
        else:
            print('HEERER')
            new_user = models.User(username = name,rank_score = 100)
            # print('creted')
            db.session.add(new_user)
            print(db.session.commit())
            print('done')
      
            players.append({'name':new_user.username,'score':new_user.rank_score})
            # players.append(name)
            return socketio.emit('joinConfirmed',data=(players))
    except Exception as e:
	    return(str(e))


@socketio.on('visiting')
def visiting(name):
    global visitors
    visitors.append(name)
    print(visitors)
    socketio.emit('visitConfirmed')
    socketio.emit('visitors', visitors)

@socketio.on('leaderboard')
def leaderboard():
    all_players=[]
    try:
        user=models.User.query.order_by(desc('rank_score')).all()
        # .order_by(models.User.rank_score.desc())
        if user:
            print(user)
            for i in user:
                
                all_players.append({'name':i.username,'score':i.rank_score})
            # print(players)
            print(all_players)
            socketio.emit('allplayersleaderboard',data=(all_players), broadcast=True)
            # return players.append( jsonify(user.serialize()))
        else:
            print('HEERER')
            players.append({})
            socketio.emit('allplayersleaderboard')
    except Exception as e:
	    return(str(e))
  
# edn]

@socketio.on('newRoomJoin')
def newRoomJoin():
    if len(players) == 1:
        socketio.emit('waiting',data=(players))
    else:
        socketio.emit('starting', data=(players, visitors), broadcast=True)

@socketio.on('move')
def move(piece, index):
    global board
  
  
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
    update(winner)
    socketio.emit('win', winner['name'])
    
def update(winner):
    try:
        db.session.remove()
        db.session.close()
        print(winner)
        userw=models.User.query.filter_by(username=winner['name']).first()
        if userw: 
            print (userw)
            print(userw)
            userw.rank_score =int(userw.rank_score)+ int(1)
            print(userw.rank_score)
            db.session.merge(userw)
            db.session.commit()
            print('ITJANDHADB UPDATED')
         
            # return players.append( jsonify(user.serialize()))
    except Exception as e:
	    return(str(e))

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
    print(players)
    print('HEREPLASYERS')
    visitors = []
    board = [None,None,None,None,None,None,None,None,None]
    socketio.emit('again',data = (players,board))
if __name__ == '__main__':
    socketio.run(app, debug=False,host=os.getenv('IP', '0.0.0.0'),port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)))
