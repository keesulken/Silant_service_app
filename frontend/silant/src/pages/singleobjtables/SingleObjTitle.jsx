import React from 'react'

export default function SingleObjTitle(props) {
  if (props.machine) {
    return <p>Машина зав. № {props.machine.factory_number}</p>
  } else {
    return <p></p>
  }
}
