import React from 'react'
import { Link } from 'react-router-dom'

export default function Enterquit(props) {
  if (props.user) {
    return (
        <Link to='/logout'>quit</Link>
    )
  } else {
    return (
        <Link to="/login">enter</Link>
    )
  }
}
