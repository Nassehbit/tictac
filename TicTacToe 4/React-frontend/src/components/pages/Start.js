import React from 'react';

import Choice from '../functional/Choice.js'
import InputForm from '../functional/InputForm.js'
import Loading from '../functional/Loading'
import Error from '../functional/Error'
import logo from './logo.png'

import { Redirect } from 'react-router-dom'

import socketIOClient from 'socket.io-client'

const ENDPOINT = 'http://127.0.0.1:5000'

class Start extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 1,
      name: '',
      newGame: null,
      loading: false,
      serverConfirmed: false,
      error: false,
      errorMessage: '',
      choice: '',
    }
  }

  componentDidMount() {
    this.socket = socketIOClient(ENDPOINT)
    this.socket.on('newGameCreated', () => {
      this.setState({serverConfirmed: true})
    })
    this.socket.on('joinConfirmed', () => {
      this.setState({serverConfirmed: true})
    })
    this.socket.on('errorMessage', (message) => this.displayError(message))
    this.socket.on('gameStatus', (gameStatus, joinStatus) => {
      this.handlerChoice(gameStatus, joinStatus);
    })
    this.socket.on('visitConfirmed', () => {
      this.setState({serverConfirmed: true})
    })
  }

  componentWillUnmount() {
    this.socket.disconnect()
  }

  onChoice = (choice) => {
    this.setState({choice: choice})
    this.socket.emit('getGameStatus')
  }

  handlerChoice = (gameStatus, joinStatus) => {
    if (gameStatus && this.state.choice === 'new') { // game started, new
      this.displayError('The game has already created.')
    } else if(this.state.choice !== 'new' && !gameStatus) { // game not started, join
      this.displayError('The game was not started yet')
    } else if(this.state.choice === 'join' && joinStatus) {
      this.displayError('The game has already started.')
    }
    else if(this.state.choice === 'visit' && !joinStatus) {
      this.displayError('There is only one player.')
    } else {
      const newState = {newGame: this.state.choice}
      this.setState(newState, () => {
        this.stepForward()
      })
    }
  }

  validate = () => {
    return !(this.state.name === '')
  }

  onSubmit = () => {
    this.setState({loading: true})
    if (this.validate()) {
      if (this.state.newGame === 'new') {
        this.socket.emit('newGame', this.state.name)
      } else if(this.state.newGame === 'join') {
        this.socket.emit('joining', this.state.name)
      } else {
        console.log(this.state.name)
        this.socket.emit('visiting', this.state.name)
      }
    } else {
      setTimeout(() => this.setState({loading: false}), 500)
      this.displayError('Please fill out your name')
    }
  }

  stepBack = () => {
    this.setState({step: this.state.step - 1})
  }

  stepForward = () => {
    this.setState({step: this.state.step + 1})
  }

  onTyping = (e) => {
    const target = e.target.name
    const newState = {[target]: e.target.value}
    this.setState(newState)
  }

  displayError = (message) => {
    this.setState({error: true, errorMessage: message, loading: false})
    setTimeout(() => {
      this.setState({error: false, errorMessage: ''})
    }, 3000)
  }

  render() {
    if (this.state.serverConfirmed) {
      return (
        <Redirect to={`/game?permission=${this.state.newGame}&name=${this.state.name}`}/>
      )
    } else {
      switch (this.state.step) {
        case(1):
          return (
            <>
              <Choice logo={logo} onChoice={this.onChoice}/>
              <Error display={this.state.error} message={this.state.errorMessage}/>
            </>
          );
        case(2):
          return (
            <>
              <Loading loading={this.state.loading}/>
              <Error display={this.state.error} message={this.state.errorMessage}/>
              <InputForm
                stepBack={this.stepBack}
                onSubmit={this.onSubmit}
                onTyping={this.onTyping.bind(this)}
                newGame={this.state.newGame}
                name={this.state.name}
              />
            </>
          );
        default:
          return null
      }
    }
  }
}

export default Start;

