import React, { useEffect } from 'react'

export default function AuthMaintenance(props) {
  let id = 'maintenance-table-elem';

  useEffect(()=>{
    document.getElementById(id).style.display = props.style;
  })

  return (
    <div id={id}>AuthMaintenance</div>
  )
}
