import React from 'react'

export default function Visitors(props) {
  return (
    <div className='status'>
      {props.visitors.map((visitor, i) => {
        return (<h3 className='status-message' key={i}>{visitor},&nbsp;</h3>)
      })}
    </div>
  )
}