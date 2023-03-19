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


  if (instance === 404) {
    return <NotFoundPage />
  } else if (instance && instance !== 404) {
    return (
      <form>
        { props.type === 'client' && <p>Карточка клиента</p> }
        { props.type === 'company' && <p>Карточка сервисной компании</p> }
        <p>Название: 
          <input type='text' id='name' value={instance.name}></input>
        </p>
        <p>Описание: 
          <input type='text' id='description' value={instance.description}></input>
        </p>
        <p>
          <input type='submit' value='Отправить'></input>
          <input type='reset' value='Сброс'></input>
        </p>
      </form>
    )
  }
}
