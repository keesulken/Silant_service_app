import React, { useEffect } from 'react'

export default function AuthReclamation(props) {
  let id = 'reclamation-table-elem';

  useEffect(()=>{
    document.getElementById(id).style.display = props.style;
  })

  return (
    <div id={id}>AuthReclamation</div>
  )
}
