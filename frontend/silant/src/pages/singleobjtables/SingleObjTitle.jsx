import React from 'react'

export default function SingleObjTitle(props) {
  if (props.machine) {
    return <p>{props.machine.id} {props.machine.factory_number}</p>
  } else {
    return <p></p>
  }
}
