import React from 'react';
import Enterquit from './Enterquit';
import { Link } from 'react-router-dom';


export default function Header(props) {
  return (
    <div className='app-header'>
        <div className='header-top-line'>
            <p className='logo'>Logo</p>
            <p className='contacts'>Telegram</p>
            { props.user && 
            (props.user.is_superuser && <p><Link to={'/admin'}>Админка</Link></p>) }
            <Enterquit user={props.user} />
        </div>
        <div className='header-bottom-line'>
          <h3>Электронная сервисная книжка "Мой Силант"</h3>
        </div>
    </div>
  )
}
