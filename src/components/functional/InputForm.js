import React , { Component, useEffect, useState }from 'react';

import Input from './Input.js'
import ChoiceButton from './ChoiceButton'

import ScoreBoard from '../functional/ScoreBoard'

import ScoreBoardleader from '../functional/scoreboardleader'
// import socket from '../pages/Board'
import socketIOClient from 'socket.io-client';
const ENDPOINT = 'http://127.0.0.1:8081'
const socket = socketIOClient(ENDPOINT, {reconnection: false})


const InputForm = (props) => {
  // const [players, setPlayers] = useState([{'name': 'edu', 'score': 100}, {'name': 'nasseh', 'score': 100}])
    const [players, setPlayers] = useState([])
    const [scores,setScores] = useState([1, 0])

    const {stepBack, onSubmit, onTyping, newGame, name,} = props
    console.log(`${newGame} dwejkhbdweydkwveykdgv`);
    useEffect(() => {
      
      socket.on('allplayersleaderboard', (all_players) => {
        // console.log(player);
        console.log(all_players)
        setPlayers(all_players)
        // setPlayers(all_players)
        console.log(players)
        // console.log(setPlayers);
        console.log();
      })
    },[])
    if (newGame === 'new'){
      console.log('NEEWWEWEWE') 
        return (
            <div className="input-container">
                <Input 
                name='name'
                placeholder='Your Name...'
                onChange = {onTyping}
                value = {name}
                />
                <div className='nav-container'>
                    <ChoiceButton type='nav-back' choice='back' onChoice={stepBack} label='Back'/>
                    <ChoiceButton type='nav-forward' choice='submit' onChoice={onSubmit} label="Let's Go"/>
                </div>
            </div>
        );
    }else if(newGame === 'join'){
        return (
            <div className="input-container">
                <Input 
                name='name'
                placeholder='Your Name...'
                onChange = {onTyping}
                value = {name}
                />
                <div className='nav-container'>
                    <ChoiceButton type='nav-back' choice='back' onChoice={stepBack} label='Back'/>
                    <ChoiceButton type='nav-forward' choice='submit' onChoice={onSubmit} label="Let's join"/>
                </div>
            </div>
        );
    } else if(newGame === 'leaderboard'){
      console.log('ORUEBDWEIUIUBHYU');
      socket.emit('leaderboard')
      console.log(players);
      return (
        <ScoreBoardleader data={players}/>
      );
  } else {
      return (
        <div className="input-container">
          <Input
            name='name'
            placeholder='Your Name...'
            onChange = {onTyping}
            value = {name}
          />
          <div className='nav-container'>
            <ChoiceButton type='nav-back' choice='back' onChoice={stepBack} label='Back'/>
            <ChoiceButton type='nav-forward' choice='submit' onChoice={onSubmit} label="Let's visit"/>
          </div>
        </div>
      );
    }
    
}

export default InputForm;
