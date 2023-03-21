import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Forbidden403 from '../Forbidden403';
import NotFoundPage from '../NotFoundPage';

export default function UserForm(props) {
  let {id} = useParams();
  let [user, setUser] = useState();
  

  useEffect(()=>{
    if (id) {
      let url = 'http://127.0.0.1:8000/api/v1/user/' + id;
      fetch(url).then(res => {
        if (res.status === 200) {
          return res.json();
        } else if (res.status === 404) {
          setUser(404);
        } else {
          console.log('error');
        };
      }).then(result => setUser(result))
      .catch(error => console.log(error.message));
    }
  }, [])


  if (props.user) {
    if (props.user.is_superuser) {
      if (user === 404) {
        return <NotFoundPage />
      } else if (id) {
        return (
        <div>
          <p>Изменение учётной записи</p>
          <form></form>
        </div>
        )
      } else {
        return (
        <div>
          <p>Создание новой учётной записи</p>
          <form>
            <p>Имя пользователя: 
              <input type='text' id='username' />
            </p>
            <p>Пароль:
              <input type='text' id='password' />
            </p>
            <p>Тип учётной записи:
              <select>
                <option>Представитель производителя</option>
                <option>Сервисная организация</option>
                <option>Конечный клиент</option>
              </select>
            </p>
            <p>Название в профиле:
              <input type='text' id='prof-name' />
            </p>
            <p>Описание в профиле:
              <input type='text' id='description' />
            </p>
            <p>
              <label>
                Права администратора
                <input type='checkbox' id='admin-cb' />
              </label>
            </p>
          </form>
        </div>
        )
      };
    } else {
      return <Forbidden403 />
    };
  } else {
    return <Forbidden403 />
  }
}
