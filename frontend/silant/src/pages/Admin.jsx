import React from 'react';
import { useNavigate } from 'react-router-dom';
import Forbidden403 from './Forbidden403';
import HomeControls from './home/HomeControls';

export default function Admin(props) {
  let navigate = useNavigate()
  
  function clickHandler (action) {
    navigate('/user/' + action);
  }


  if (props.user) {
    if (props.user.is_superuser) {
        return (
          <div>
            <p>Пользователи:
              <button onClick={(e) => clickHandler('create', e)}>Новый пользователь</button>
              <button onClick={(e) => clickHandler('update', e)}>Обновить данные</button>
            </p>
            <HomeControls user={props.user}/>
          </div>
        )
    } else {
      return <Forbidden403 />
    };
  } else {
    return <Forbidden403 />
  }
}
