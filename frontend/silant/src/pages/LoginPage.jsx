import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ErrorBlock from './app/ErrorBlock';

export default function LoginPage(props) {
  const navigate = useNavigate();
  let [errorBlock, setErrorBlock] = useState();

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
        errorBlockVoid();
        return res.json();
      } else if (res.status === 400) {
        throw new Error('400');
      } else {
        throw new Error('500');
      };
    }).then(result => {
      localStorage.setItem('token', result['auth_token']);
      window.location.reload();
    }).catch(error => {
      if (error.message === '400') {
        errorBlockVoid();
        let block = <ErrorBlock error={'Неверные логин и/или пароль'} />;
        setErrorBlock(block);
      } else if (error.message === '500' ||
      error.name === 'TypeError') {
        errorBlockVoid();
        let block = <ErrorBlock error={'Неизвестная ошибка, попробуйте позже'} />;
        setErrorBlock(block);
      };
    });
  }


  function errorBlockVoid () {
    if (document.getElementById('error-block')) {
        setErrorBlock();
    };
  }

  
  return (
    <form onSubmit={handleSubmit} className='login-page'>
      <h3>Вход в систему</h3>
      { errorBlock }
      <p>Имя пользователя: <input type='text' id='username' /></p>
      <p>Пароль: <input type='password' id='password' /></p>
      <p><input type='submit' value='Войти' className='form-button' />
      <input type='reset' value='Сброс' className='form-button' /></p>
    </form>
  )
}
