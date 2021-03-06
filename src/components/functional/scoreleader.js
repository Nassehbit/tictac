import React from "react";

export default function Scoreleader({name}) {
    console.log(name);
  const listItems = name.map((broke) => 
  <li key={broke.name}>{broke.name} -- {broke.score} </li>
  );
  return <ul>{listItems}</ul>;
  
}
