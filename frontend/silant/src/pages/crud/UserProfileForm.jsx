import React, { useState, useEffect } from 'react';
import NotFoundPage from '../NotFoundPage';

export default function UserProfileForm(props) {
  let [instance, setInstance] = useState(null);


  useEffect(()=>{
    let url = `http://127.0.0.1:8000/api/v1/${props.type}/${props.id}`;
    fetch(url).then(res => {
    if (res.status === 200) {
        return res.json();
    } else if (res.status === 404) {
        setInstance(404);
    } else {
        console.log('error');
    };
    }).then(result => setInstance(result))
    .catch(error => console.log(error.message));
  }, [])


  function dataLoader () {
    if (document.querySelector('form') 
    && instance
    && instance !== 404) {
      document.getElementById('name').value = instance.name;
      document.getElementById('description').value = instance.description;
    };
  }


  useEffect(dataLoader)


  function sendForm (e) {
    e.preventDefault();
    let data = new FormData(document.querySelector('form'))
    for (let [key, value] of data) {
      console.log(`${key} - ${value}`);
    }
  }


  if (instance === 404) {
    return <NotFoundPage />
  } else if (instance && instance !== 404) {
    return (
      <form onSubmit={sendForm}>
        { props.type === 'client' && <p>Карточка клиента</p> }
        { props.type === 'company' && <p>Карточка сервисной компании</p> }
        <p>Название: 
          <input type='text' name='name' id='name' ></input>
        </p>
        <p>Описание: 
          <input type='text' name='description' id='description' ></input>
        </p>
        <p>
          <input type='submit' value='Отправить' />
          <input type='reset' value='Сброс' onMouseLeave={dataLoader} />
        </p>
      </form>
    )
  }
}
