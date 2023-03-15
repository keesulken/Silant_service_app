import React, { useEffect } from 'react'

export default function AuthMachine(props) {
  let id = 'machine-table-elem';
  
  useEffect(()=>{
    document.getElementById(id).style.display = props.style;
  })


  return (
    <div id={id}>AuthMachine</div>
  )
}
