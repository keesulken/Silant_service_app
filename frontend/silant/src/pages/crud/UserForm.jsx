import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Forbidden403 from '../Forbidden403';
import NotFoundPage from '../NotFoundPage';
import { useNavigate } from 'react-router-dom';
import ErrorBlock from '../app/ErrorBlock';
import UserFormProfileBlock from './UserFormProfileBlock';
import UserFormWarning from './UserFormWarning';
import UserFormPasswordBlock from './UserFormPasswordBlock';

export default function UserForm(props) {
  let {id} = useParams();
  let [user, setUser] = useState();
  let [profName, setProfName] = useState();
  let [profDesc, setProfDesc] = useState();
  let [errorBlock, setErrorBlock] = useState();
  let [warningBlock, setWarningBlock] = useState();
  let [profileBlock, setProfileBlock] = useState();
  let [passwordBlock, setPasswordBlock] = useState(
    <UserFormPasswordBlock button={true} handler={showInput} />
  );
  let resetBtnPress = false;
  let cb = document.getElementById('admin-cb');
  let input = document.getElementById('password-input');
  let navigate = useNavigate();
  let tags = [
    'Представитель производителя', 
    'Сервисная организация', 
    'Конечный клиент'
  ];
  

  useEffect(()=>{
    if (id) {
      let url = 'http://127.0.0.1:8000/api/v1/user/' + id;
      let options = {
        method: 'GET',
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
      };
      fetch(url, options).then(res => {
        if (res.status === 200) {
          return res.json();
        } else if (res.status === 404) {
          setUser(404);
        } else if (res.status === 403 ||
          res.status === 401) {
          throw new Error('403');
        } else {
          throw new Error('500');
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
      .catch(error => {
        if (error.message === '403') {
          errorBlockVoid();
          let block = <ErrorBlock error={'Недостаточно прав'} />;
          setErrorBlock(block);
        } else if (error.message === '500' ||
        error.name === 'TypeError') {
          errorBlockVoid();
          let block = <ErrorBlock error={'Неизвестная ошибка, попробуйте позже'} />;
          setErrorBlock(block);
        };
      });
    }
  }, [])


  useEffect(()=>{
      if (user) {
        if (document.querySelector('form')) {
          document.getElementById('username').value = user.username;
        };
        if (user.type !== tags[0]) {
          let block = <UserFormProfileBlock name={profName} desc={profDesc} />;
          setProfileBlock(block);
        };
        if (user.is_superuser && cb) {
          cb.checked = true;
        };
      };
  }, [user])


  function checkboxWarning () {
    if (cb.checked) {
      let block = <UserFormWarning handler={warningHandler} />;
      setWarningBlock(block);
    } else {
      warningVoid();
    }
  }


  function warningVoid () {
    setWarningBlock();
  }


  function warningHandler (e) {
    e.preventDefault();
    if (e.target.textContent === 'Подтвердить') {
      warningVoid();
    } else {
      cb.checked = false;
      warningVoid();
    };
  }


  function typeChangeHandler () {
    let select = document.querySelector('select').value;
    if (select !== tags[0]) {
      let block = <UserFormProfileBlock />;
      setProfileBlock(block);
      if (user) {
        if (profName) {
          dataLoader();
        };
      };
    } else {
      setProfileBlock();
    };
  }


  function resetHandler () {
    resetBtnPress = true;
    cb.checked = false;
    setWarningBlock();
    if (user) {
      dataLoader();
      let btn = document.getElementById('reset-with-user');
      btn.addEventListener('mouseleave', resetLoader);
      if (user.type === tags[0]) {
        let block = <UserFormProfileBlock hidden={true} />;
        setProfileBlock(block);
      };
    } else {
      setProfileBlock();
    };
  }


  function showInput (e) {
    e.preventDefault();
    let block = <UserFormPasswordBlock handler={passwordChanger} />;
    setPasswordBlock(block);
  }


  function dataLoader () {
    if (document.querySelector('form') 
    && user
    && user !== 404) {
      document.getElementById('username').value = user.username;
      if (profName) {
        let block = <UserFormProfileBlock name={profName} desc={profDesc} />;
        setProfileBlock(block);
      };
    };
  }


  function resetLoader () {
    dataLoader();
    let btn = document.getElementById('reset-with-user');
    btn.removeEventListener('mouseleave', resetLoader);
  }


  function sendForm (e) {
    e.preventDefault();
    let errors = [];
    let data = new FormData(document.querySelector('form'));
    for (let [key, value] of data) {
      if (value === '') {
        errors.push('Все поля обязательны к заполнению');
        break;
      };
    };
    if (data.get('username').length < 4) {
      errors.push('Имя пользователя должно состоять как миинимум из 4-х символов');
    };
    errorBlockVoid();
    if (errors.length !== 0) {
      let block = <ErrorBlock error={errors[0]} />;
      setErrorBlock(block);
    } else {
      if (user) {
        let url = 'http://127.0.0.1:8000/api/v1/user/' + user.id;
        let options = {
          method: 'PATCH',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
          body: data,
        };
        fetch(url, options).then(res => {
          if (res.status === 204) {
            navigate('/user/update');
          } else if (res.status === 403 ||
            res.status === 401) {
            throw new Error('403');
          } else if (res.status === 400) {
            throw new Error('400');
          } else {
            throw new Error('500');
          };
        }).catch(error => {
          if (error.message === '403') {
            errorBlockVoid();
            let block = <ErrorBlock error={'Недостаточно прав'} />;
            setErrorBlock(block);
          } else if (error.message === '400') {
            errorBlockVoid();
            let block = <ErrorBlock error={'Некорректные данные'} />;
            setErrorBlock(block);
          } else if (error.message === '500' ||
          error.name === 'TypeError') {
            errorBlockVoid();
            let block = <ErrorBlock error={'Неизвестная ошибка, попробуйте позже'} />;
            setErrorBlock(block);
          };
        });
      } else {
        let url = 'http://127.0.0.1:8000/api/v1/user';
        let options = {
          method: 'POST',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
          body: data,
        };
        fetch(url, options).then(res => {
          if (res.status === 201) {
            navigate('/user/update');
          } else if (res.status === 403 ||
            res.status === 401) {
            throw new Error('403');
          } else if (res.status === 400) {
            throw new Error('400');
          } else {
            throw new Error('500');
          };
        }).catch(error => {
          if (error.message === '403') {
            errorBlockVoid();
            let block = <ErrorBlock error={'Недостаточно прав'} />;
            setErrorBlock(block);
          } else if (error.message === '400') {
            errorBlockVoid();
            let block = <ErrorBlock error={'Некорректные данные'} />;
            setErrorBlock(block);
          } else if (error.message === '500' ||
          error.name === 'TypeError') {
            errorBlockVoid();
            let block = <ErrorBlock error={'Неизвестная ошибка, попробуйте позже'} />;
            setErrorBlock(block);
          };
        });
      };
    };
  }


  function passwordChanger () {
    let password = document.getElementById('password').value;
    let url = 'http://127.0.0.1:8000/api/v1/password/' + id;
    let options = {
      method: 'POST',
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        password: password,
      }),
    };
    fetch(url, options).then(res => {
      if (res.status === 204) {
        navigate('/user/update');
      } else if (res.status === 403 ||
        res.status === 401) {
        throw new Error('403');
      } else if (res.status === 400) {
        throw new Error('400');
      } else {
        throw new Error('500');
      };
    }).catch(error => {
      if (error.message === '403') {
        errorBlockVoid();
        let block = <ErrorBlock error={'Недостаточно прав'} />;
        setErrorBlock(block);
      } else if (error.message === '400') {
        errorBlockVoid();
        let block = <ErrorBlock error={'Некорректные данные'} />;
        setErrorBlock(block);
      } else if (error.message === '500' ||
      error.name === 'TypeError') {
        errorBlockVoid();
        let block = <ErrorBlock error={'Неизвестная ошибка, попробуйте позже'} />;
        setErrorBlock(block);
      };
    });
  }


  function errorBlockVoid () {
    if (document.getElementById('error-block')) {
        setErrorBlock();
    };
  }


  if (props.user) {
    if (props.user.is_superuser) {
      if (user === 404) {
        return <NotFoundPage />
      } else if (id && user) {
        return (
          <div>
          <p>Изменение учётной записи</p>
          { errorBlock }
          <form onReset={resetHandler} onSubmit={sendForm} encType="multipart/form-data">
            <p>Имя пользователя: 
              <input type='text' name='username' id='username' />
            </p>
            <p style={{ display: 'block'}}>Тип учётной записи:
              <select onChange={typeChangeHandler} name='user-type'>
                <option>{user.type}</option>
                { tags.filter(item => item !== user.type)
                .map((item, index) => <option key={index}>{item}</option>) }
              </select>
            </p>
            { profileBlock }
            <p>
              { user.is_superuser && (
              <label>
                Права администратора
                <input type='checkbox' name='admin-cb' id='admin-cb' />
              </label>) }
              { !user.is_superuser && (
              <label>
                Права администратора
                <input type='checkbox' name='admin-cb' id='admin-cb' 
                onChange={checkboxWarning} />
              </label>) }
            </p>
            { warningBlock }
            <p className='form-controls'>
              <input type='submit' value='Отправить' className='form-button' />
              <input type='reset' value='Сброс' 
              id='reset-with-user' className='form-button' />
            </p>
          </form>
          { passwordBlock }
        </div>
        )
      } else {
        return (
        <div>
          <p>Создание новой учётной записи</p>
          { errorBlock }
          <form onReset={resetHandler} onSubmit={sendForm} encType="multipart/form-data">
            <p>Имя пользователя: 
              <input type='text' name='username' id='username' />
            </p>
            <p>Пароль:
              <input type='text' name='password' id='password' />
            </p>
            <p>Тип учётной записи:
              <select onChange={typeChangeHandler} name='user-type'>
                <option>Представитель производителя</option>
                <option>Сервисная организация</option>
                <option>Конечный клиент</option>
              </select>
            </p>
            { profileBlock }
            <p>
              <label>
                Права администратора
                <input type='checkbox' name='admin-cb' id='admin-cb' 
                onChange={checkboxWarning} />
              </label>
            </p>
            { warningBlock }
            <p className='form-controls'>
              <input type='submit' value='Отправить' className='form-button' />
              <input type='reset' value='Сброс' className='form-button' />
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
