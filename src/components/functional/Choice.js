import React from 'react';
import ChoiceButton from './ChoiceButton'

const Choice = ({logo, onChoice}) => {
    return (
        <>
        <div className='choice-container'>
            <a href="/"><img src={logo} alt='React TicTacToe'/></a>
            <ChoiceButton onChoice={onChoice} type='primary' choice='new' label='Start New'/> 
            <ChoiceButton onChoice={onChoice} type='secondary' choice='join' label='Join Game'/>
            <ChoiceButton onChoice={onChoice} type='secondary' choice='visit' label='Visit Game'/>
            <ChoiceButton onChoice={onChoice} type='secondary' choice='leaderboard' label='leaderboard'/>
        </div>
        </>
    );
}

export default Choice;
