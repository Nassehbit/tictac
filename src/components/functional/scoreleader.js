import React from "react";
import './scorecss.css'
export default function Scoreleader({name}) {
    console.log(name);
  const listItems = name.map((broke) => 
  <tr>
  <td key={broke.name}>{broke.name}</td>
  <td key={broke.name}>{broke.score}</td>
  </tr>
  // <td >{broke.score}</td>
  // <li key={broke.name}>{broke.name} -- {broke.score} </li>

  );
  return (
<table>
    <thead>
        <tr>
            <th colspan="2">LEADERBOARD</th>
        </tr>
    </thead>
    <tbody>
      <tr>
        <td>NAME</td>
        <td>SCORE</td>
        </tr>

            {listItems}

    </tbody>
</table>
  );
  
}

