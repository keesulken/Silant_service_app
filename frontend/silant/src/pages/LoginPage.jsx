import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage(props) {
  const navigate = useNavigate();

  useEffect(()=>{
    if (props.user) {
      navigate('/');
    }
  });

  function handleSubmit(e) {
    e.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let url = 'http://127.0.0.1:8000/auth/token/login/';
    let params = {
      username: username,
      password: password,
      };
    let options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(params)
    };
    fetch(url, options).then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        console.log('error');
      };
    }).then(result => {
      localStorage.setItem('token', result['auth_token']);
      window.location.reload();
    }).catch(error => console.log(error.message));
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <p>Username: <input type='text' id='username' /></p>
      <p>Password: <input type='password' id='password' /></p>
      <p><input type='submit' value='Submit' />
      <input type='reset' value='Reset' /></p>
    </form>
  )
}
