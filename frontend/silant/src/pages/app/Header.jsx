import React from 'react';
import EnterLink from './EnterLink';

export default function Header(props) {
  return (
    <div className='app-header'>
        <div className='header-top-line'>
            <p className='logo'>Logo</p>
            <p className='contacts'>Telegram</p>
            <p className='enter-quit'>
              <EnterLink user={props.user} />
            </p>
        </div>
        <div className='header-bottom-line'>
          <h3>Электронная сервисная книжка "Мой Силант"</h3>
        </div>
    </div>
  )
}
