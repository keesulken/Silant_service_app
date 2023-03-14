import React from 'react'
import { redirect, useNavigate } from 'react-router-dom'

export default function LoginPage(props) {
  const navigate = useNavigate();

  if (props.user) {
    navigate('/');
  } else {
    return (
      <div>
        <p>Username: <input type='text' id='username'/></p>
        <p>Password: <input type='password' id='password'/></p>
      </div>
    )
  }
}
