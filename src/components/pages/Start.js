import React, { useEffect, useState } from 'react';

import Choice from '../functional/Choice.js'
import InputForm from '../functional/InputForm.js'
import Loading from '../functional/Loading'
import Error from '../functional/Error'
import logo from './logo.png'

import { Redirect } from 'react-router-dom'

import socketIOClient from 'socket.io-client'

// const ENDPOINT = 'http://127.0.0.1:8081'
const ENDPOINT ='https://tictacflask.herokuapp.com/'
const socket = socketIOClient(ENDPOINT)

export default function Start(props) {
  
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [newGame, setNewGame] = useState(null)
  const [loading, setLoading] = useState(false)
  const [serverConfirmed, setServerConfirmed] = useState(false)
  const [error, setError] = useState(false)
  var choice = ''
  

  useEffect(() => {
    console.log('useEffect')
    socket.on('newGameCreated', () => {
      console.log('newGameCreated')

      // alert('NEW GAME CREATED')

      setServerConfirmed(true)
    })
    socket.on('joinConfirmed', (players) => {
      console.log(players);
      setServerConfirmed(true)
    })
    socket.on('errorMessage', (message) => displayError(message))
    socket.on('gameStatus', (gameStatus, joinStatus) => {
      console.log(gameStatus);  
      handlerChoice(gameStatus, joinStatus);
    })
    socket.on('visitConfirmed', () => {
      setServerConfirmed(true)
    })
    socket.on('leaderboardconfirm', () => {
      setServerConfirmed(true)
    })
  })

  const onChoice = (choiceParam) => {
    choice = choiceParam
    console.log(choice);
    socket.emit('getGameStatus')
  }

  const handlerChoice = (gameStatus, joinStatus) => {
    if (gameStatus && choice === 'new') { // game started, new
      displayError('The game has already created.')

    } else if(choice !== 'new' && choice !== 'leaderboard' && !gameStatus) { // game not started, join
      console.log(choice);
      displayError('The game was not started yet')
    } else if(choice === 'join' && joinStatus) {
      displayError('The game has already started.')
    }
    else if(choice === 'visit' && !joinStatus) {
      displayError('There is only one player.')
    } else {
      console.log('LEADERBOARD');
      // newGame = choice
      setNewGame(choice)
      stepForward()
    }
  }

  const validate = () => {
    return !(name === '')
  }

  const onSubmit = () => {
    console.log('onSubmit')
    console.log(name)
    setLoading(true)
    if (validate()) {
      if (newGame === 'new') {
        console.log('newGame')
        socket.emit('newGame', name)
      } else if(newGame === 'join') {
        console.log('IAMA VJRINCRU');
        socket.emit('joining', name)
      } else if (newGame === 'visit') {
        console.log('IAMA VJRINCRU');
        socket.emit('visiting', name)
      } else if (newGame === 'leaderboard') {
        console.log("LEEADEDAERF");
        socket.emit('leaderboard', name)
      }
    } else {
      setTimeout(() => setLoading(false), 500)
      displayError('Please fill out your name')
    }
  }

  const stepBack = () => {
    setStep(step - 1)
  }

  const stepForward = () => {
    setStep(step + 1)
  }

  const onTyping = (e) => {
    setName(e.target.value)
  }

  const displayError = (message) => {
    setError(true)
    setErrorMessage(message)
    setLoading(false)

    setTimeout(() => {
      setError(false)
      setErrorMessage('')
    }, 3000)
  }

    if (serverConfirmed) {
      return (
        <Redirect to={`/game?permission=${newGame}&name=${name}`}/>
      )
    } else {
      switch (step) {
        case(1):
          return (
            <>
              <Choice logo={logo} onChoice={onChoice}/>
              <Error display={error} message={errorMessage}/>
            </>
          );
        case(2):
          return (
            <>
              <Loading loading={loading}/>
              <Error display={error} message={errorMessage}/>
              <InputForm
                stepBack={stepBack}
                onSubmit={onSubmit}
                onTyping={onTyping.bind(this)}
                newGame={newGame}
                name={name}
              />
            </>
          );
        default:
          return null
      }
    }
}

