import React, { Component } from 'react';
import {Redirect} from 'react-router-dom'

import Square from '../functional/Square';
import Wait from '../functional/Wait'
import Status from '../functional/Status'
import ScoreBoard from '../functional/ScoreBoard'
import PlayAgain from '../functional/PlayAgain'

import qs from 'qs'
import socketIOClient from 'socket.io-client';
import Visitors from '../functional/Visitor';
const ENDPOINT = 'http://127.0.0.1:5000'

class Board extends Component {
  constructor(props){
    super(props)
    this.state = {
      game: new Array(9).fill(null),
      piece: 'X',
      turn: true,
      end: false,
      statusMessage: '',
      //State to check when a new user join
      waiting: false,
      joinError: false,
      permission: '',
      players: ['', ''],
      scores: [0, 0],
      board: null,
      loading: false,
      redirect: false,
      visitors: [],
    }
    this.socketID = null
  }

  componentDidMount() {
    const {permission, name} = qs.parse(window.location.search, {
      ignoreQueryPrefix: true
    })
    this.setState({permission})

    this.socket = socketIOClient(ENDPOINT, {reconnection: true})
    this.socket.emit('newRoomJoin')
    this.socket.on('waiting', () => {
      this.setState({waiting: true})
    })

    this.socket.on('starting', (players, visitors) => {
      console.log('starting')
      this.setState({players: players})
      this.setState({visitors: visitors})
      this.setState({turn: this.state.permission === 'new' ? true : false})
      this.setState({piece: this.state.permission === 'new' ? 'O' : 'X'})
      this.setState({waiting: false})
    })

    //Game play logic events
    this.socket.on('update', (board, piece) => {
      this.handleUpdate(board, piece)
    })
    this.socket.on('win', (winner) => {
      this.setState({statusMessage: `${winner} wins`})
      this.setState({end: true})
    })
    this.socket.on('over', () => {
      this.setState({statusMessage: 'Game over'})
      this.setState({end: true})
    })
    this.socket.on('again', () => {
      this.setState({ redirect: true })
    })
    this.socket.on('visitors', (visitors) => {
      console.log(visitors)
      this.setState({visitors: visitors})
    })
  }


  //Setting the states to start a game when new user join
  gameStart(gameState, players, turn){
    const opponent = players.filter(([id, name]) => id!==this.socketID)[0][1]
    this.setState({opponentPlayer: [opponent, 0], end:false})
    this.setBoard(gameState)
    this.setTurn(turn)
    this.setMessage()
  }

  //When some one make a move, emit the event to the back end for handling
  handleClick = (index) => {
    const {game, piece, end, turn} = this.state
    if (!game[index] && !end && turn && this.state.permission !== 'visit'){
      this.socket.emit('move', piece, index)
    }
  }

  //Setting the states each move when the game haven't ended (no wins or draw)
  handleUpdate(board, piece){
    this.setBoard(board)
    this.setTurn(piece)
    if(this.handleWin(board)) {

      var winner = piece === 'O' ? this.state.players[1] : this.state.players[0]
      this.socket.emit('win', winner)
    } else if(this.handleOver(board)) {
      this.socket.emit('over')
    } else {
      this.setMessage()
    }
  }

  handleOver(board) {
    for(var i = 0; i < board.length; i++) {
      if(board[i] !== 'X' && board[i] !== 'O') {
        return false
      }
    }
    return true
  }
  //Setting the states when some one wins
  handleWin(board) {
    this.winStates = [
      [0, 1, 2], [3, 4, 5],[6, 7, 8],
      [0, 3, 6], [1, 4, 7],[2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ]
    for(var i = 0; i < this.winStates.length; i++) {
      var winstate = this.winStates[i];
      if (board[winstate[0]] === this.state.piece
        && board[winstate[1]] === this.state.piece
        && board[winstate[2]] === this.state.piece) {
        this.setState({end:true})
        return true
      }
    }
    return false
  }

  //Setting the states when there is a draw at the end
  handleDraw(gameState){
    this.setBoard(gameState)
    this.setState({end:true, statusMessage:'Draw'})
  }

  playAgainRequest = () => {
    this.socket.emit('playAgainRequest')
  }

  //Handle the restart event from the back end
  handleRestart(gameState, turn){
    this.setBoard(gameState)
    this.setTurn(turn)
    this.setMessage()
    this.setState({end: false})
  }

  //Some utilities methods to set the states of the board

  setMessage(){
    const message = this.state.turn?'Your Turn': 'Opponent`s Turn'
    this.setState({statusMessage:message})
  }

  setTurn(piece){
    if (this.state.permission !== 'visit') {
      if (this.state.piece === piece){
        this.setState({turn:true})
      } else {
        this.setState({turn:false})
      }
    }
  } 

  setBoard(gameState){
    this.setState({game:gameState})
  }
  
  renderSquare(i){
    return(
      <Square key={i} value={this.state.game[i]} 
                              player={this.state.piece} 
                              end={this.state.end} 
                              id={i} 
                              onClick={this.handleClick}
                              turn={this.state.turn}/> 
    )
  }

  render(){
    if (this.state.redirect){
      return(
        <Redirect to={`/`} />
      )
    }else{
      const squareArray = []
      for (let i=0; i<9; i++){
        const newSquare = this.renderSquare(i)
        squareArray.push(newSquare)
      }
      return(
        <>
          <Wait display={this.state.waiting}/>
          <Status message={this.state.statusMessage}/>
          <div className="board">
            {squareArray}
          </div>
          <ScoreBoard data={{player1:[this.state.players[0], this.state.scores[0]], player2:[this.state.players[1], this.state.scores[1]]}}/>
          <Visitors visitors={this.state.visitors}/>
          <PlayAgain end={this.state.end} onClick={this.playAgainRequest}/>
        </>
      )
    }
  }
}


export default Board



