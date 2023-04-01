import React from 'react'

export default function UserFormWarning(props) {
  return (
    <div id='warning'>
        <p>
        Наделение ненадёжного пользователя правами администратора 
        влечёт угрозу безопасности системы 
        и может стать причиной несанкционированного доступа и утечки данных! 
        Вы действительно хотите дать этому пользователю права администратора?
        </p>
        <button onClick={props.handler}>Подтвердить</button>
        <button onClick={props.handler}>Отмена</button>
    </div>
  )
}
