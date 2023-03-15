import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'

export default function Logout(props) {
  const navigate = useNavigate();

  useEffect(()=>{
    if (!props.user) {
      navigate('/login');
    }
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
      }
    }).catch(error => console.log(error.message));
  }

  return (
    <div>
      <h2>You sure you want to quit?</h2>
      <button onClick={handleClick}>Quit</button>
    </div>
  )
}
