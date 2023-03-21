import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Forbidden403 from '../Forbidden403';
import NotFoundPage from '../NotFoundPage';

export default function UserForm(props) {
  let {id} = useParams();
  let [user, setUser] = useState();
  let [profName, setProfName] = useState();
  let [profDesc, setProfDesc] = useState();
  let name = document.getElementById('p-name');
  let desc = document.getElementById('p-desc');
  let warning = document.getElementById('warning');
  let cb = document.getElementById('admin-cb');
  let input = document.getElementById('password-input');
  let tags = [
    'Представитель производителя', 
    'Сервисная организация', 
    'Конечный клиент'
  ];
  

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
      }).then(result => {
        setUser(result);
        if (result.cl_profile[0]) {
          setProfName(result.cl_profile[0].name);
          setProfDesc(result.cl_profile[0].description);
        } else if (result.sc_profile[0]) {
          setProfName(result.sc_profile[0].name);
          setProfDesc(result.sc_profile[0].description);
        }
      })
      .catch(error => console.log(error.message));
    }
  }, [])


  useEffect(()=>{
    if (user && name && desc) {
      input.style.display = 'none';
      warning.style.display = 'none';
      if (user.type === tags[0]) {
        name.style.display = 'none';
        desc.style.display = 'none';
      }
      if (user.is_superuser) {
        cb.checked = true;
      }
    } else if (name && desc) {
      name.style.display = 'none';
      desc.style.display = 'none';
      warning.style.display = 'none';
    }
  })


  function selectHandler (e) {
    if (e.target.value === 'Представитель производителя') {
      name.style.display = 'none';
      desc.style.display = 'none';
    } else {
      name.style.display = 'block';
      desc.style.display = 'block';
    }
  }


  function checkboxWarning () {
    if (cb.checked) {
      warning.style.display = 'block';
    } else {
      warning.style.display = 'none';
    }
  }


  function clickHandler (e) {
    e.preventDefault();
    if (e.target.textContent === 'Подтвердить') {
      warning.style.display = 'none';
    } else {
      cb.checked = false;
      warning.style.display = 'none';
    }
  }


  function resetHandler () {
    if (user) {
      if (user.type === tags[1] || user.type === tags[2]) {
        warning.style.display = 'none';
        if (name.style.display = 'none') {
          name.style.display = 'block';
          desc.style.display = 'block';
        }
      };
    } else {
      warning.style.display = 'none';
      name.style.display = 'none';
      desc.style.display = 'none';
    };
  }


  function showInput (e) {
    e.preventDefault();
    let btn = document.getElementById('password-btn');
    btn.style.display = 'none';
    input.style.display = 'block';
  }


  if (props.user) {
    if (props.user.is_superuser) {
      if (user === 404) {
        return <NotFoundPage />
      } else if (id && user) {
        return (
          <div>
          <p>Изменение учётной записи</p>
          <form onReset={resetHandler}>
            <p>Имя пользователя: 
              <input type='text' id='username' 
              value={user.username} />
            </p>
            <p id='password-btn'>Пароль:
              <button onClick={showInput}>Сменить пароль</button>
            </p>
            <p id='password-input'>Пароль:
              <input type='text' id='password' />
            </p>
            <p>Тип учётной записи:
              <select onChange={selectHandler}>
                <option>{user.type}</option>
                { tags.filter(item => item !== user.type)
                .map((item, index) => <option key={index}>{item}</option>) }
              </select>
            </p>
            <p id='p-name'>Название в профиле:
              <input type='text' id='prof-name' 
              value={profName} />
            </p>
            <p id='p-desc'>Описание в профиле:
              <input type='text' id='description' 
              value={profDesc} />
            </p>
            <p>
              { user.is_superuser && (
              <label>
                Права администратора
                <input type='checkbox' id='admin-cb' />
              </label>) }
              { !user.is_superuser && (
              <label>
                Права администратора
                <input type='checkbox' id='admin-cb' 
                onChange={checkboxWarning} />
              </label>) }
            </p>
            <div id='warning'>
              <p>
                Наделение ненадёжного пользователя правами администратора 
                влечёт угрозу безопасности системы 
                и может стать причиной несанкционированного доступа и утечки данных! 
                Вы действительно хотите дать этому пользователю права администратора?
              </p>
              <button onClick={clickHandler}>Подтвердить</button>
              <button onClick={clickHandler}>Отмена</button>
            </div>
            <p>
              <input type='submit' value='Отправить' />
              <input type='reset' value='Сброс' />
            </p>
          </form>
        </div>
        )
      } else {
        return (
        <div>
          <p>Создание новой учётной записи</p>
          <form onReset={resetHandler}>
            <p>Имя пользователя: 
              <input type='text' id='username' />
            </p>
            <p>Пароль:
              <input type='text' id='password' />
            </p>
            <p>Тип учётной записи:
              <select onChange={selectHandler}>
                <option>Представитель производителя</option>
                <option>Сервисная организация</option>
                <option>Конечный клиент</option>
              </select>
            </p>
            <p id='p-name'>Название в профиле:
              <input type='text' id='prof-name' />
            </p>
            <p id='p-desc'>Описание в профиле:
              <input type='text' id='description' />
            </p>
            <p>
              <label>
                Права администратора
                <input type='checkbox' id='admin-cb' 
                onChange={checkboxWarning} />
              </label>
            </p>
            <div id='warning'>
              <p>
                Наделение ненадёжного пользователя правами администратора 
                влечёт угрозу безопасности системы 
                и может стать причиной несанкционированного доступа и утечки данных! 
                Вы действительно хотите дать этому пользователю права администратора?
              </p>
              <button onClick={clickHandler}>Подтвердить</button>
              <button onClick={clickHandler}>Отмена</button>
            </div>
            <p>
              <input type='submit' value='Отправить' />
              <input type='reset' value='Сброс' />
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
