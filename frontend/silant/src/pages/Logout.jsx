import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import ErrorBlock from './app/ErrorBlock';

export default function Logout(props) {
  const navigate = useNavigate();
  let [errorBlock, setErrorBlock] = useState();

  useEffect(()=>{
    if (!props.user) {
      navigate('/login');
    };
  });

  function handleClick() {
    let token = localStorage.getItem('token');
    let url = 'http://127.0.0.1:8000/auth/token/logout';
    let options = {
      method: 'POST',
      headers: {
          'Authorization': `Token ${token}`,
      },
    };
    fetch(url, options).then(res => {
      if (res.status === 204) {
        localStorage.removeItem('token');
        window.location.reload();
      } else {
        throw new Error('500');
      };
    }).catch(error => {
      if (error) {
        setErrorBlock('500');
      };
    });
  }

  if (errorBlock) {
    return <ErrorBlock error={'Неизвестная ошибка, попробуйте позже'} />
  } else {
    return (
      <div className='logout-page'>
        <h2>Вы действительно хотите выйти?</h2>
        <button onClick={handleClick}>Выйти</button>
      </div>
    )
  };
}
