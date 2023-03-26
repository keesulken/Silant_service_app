import React from 'react'
import { Link } from 'react-router-dom'

export default function Enterquit(props) {
  if (props.user) {
    return (
        <Link to='/logout'>Выйти</Link>
    )
  } else {
    return (
        <Link to="/login">Авторизация</Link>
    )
  }
}
