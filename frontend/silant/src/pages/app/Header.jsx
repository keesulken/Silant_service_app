import React from 'react';
import Enterquit from './Enterquit';
import { Link } from 'react-router-dom';
import logo from '../../pics/logo-red.jpg';


export default function Header(props) {
  return (
    <div className='app-header'>
      <div className='header-logo'><Link to={'/'}><img src={logo} /></Link></div>
      <div className='header-center'>
        <p className='contacts'>+7-8352-20-12-09, 
        <a href='https://desktop.telegram.org'> Telegram</a></p>
        <h2>Электронная сервисная книжка "Мой Силант"</h2>
      </div>
      <div className='header-right'>
        { props.user && 
        (props.user.is_superuser && <p><Link to={'/admin'}>Админка</Link></p>) }
        <Enterquit user={props.user} />
      </div>
    </div>
  )
}
