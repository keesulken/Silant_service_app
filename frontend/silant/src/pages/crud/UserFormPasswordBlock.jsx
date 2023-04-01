import React from 'react'

export default function UserFormPasswordBlock(props) {
  if (props.button) {
    return (
        <p id='password-btn'>Пароль:
            <button onClick={props.handler}>Сменить пароль</button>
        </p>
    )
  } else {
    return (
        <p id='password-input'>Пароль:
            <input type='text' name='password' id='password' />
            <button onClick={props.handler}>Отправить</button>
        </p>
    )
  };
}
