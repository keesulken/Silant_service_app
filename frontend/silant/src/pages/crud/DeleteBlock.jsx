import React, { useState } from 'react';
import ErrorBlock from '../app/ErrorBlock';

export default function DeleteBlock(props) {
  let [errorBlock, setErrorBlock] = useState();


  function deleteConfirm () {
    let url = `http://127.0.0.1:8000/api/v1/${props.instance}/${props.id}`;
    let options = {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
    };
    fetch(url, options).then(res => {
      if (res.status === 204) {
        window.location.reload();
      } else if (res.status === 200) {
        throw new Error('protected');
      } else {
        throw new Error('500');
      };
    }).catch(error => {
      if (error.message === 'protected') {
        errorBlockVoid();
        let block = <ErrorBlock error={'Существуют записи, связанные с этой, удаление невозможно'} />;
        setErrorBlock(block);
      } else if (error.message === '500' ||
      error.name === 'TypeError') {
        errorBlockVoid();
        let block = <ErrorBlock error={'Неизвестная ошибка, попробуйте позже'} />;
        setErrorBlock(block);
      };
    });
  }


  function cancelHandler () {
    props.void();
  }


  function errorBlockVoid () {
    if (document.getElementById('error-block')) {
        setErrorBlock();
    };
  }


  return (
    <div id='delete-block'>
      { errorBlock }
      <p>Вы действительно хотите удалить { props.name }?</p>
      <button onClick={deleteConfirm}>Удалить</button>
      <button onClick={cancelHandler}>Отмена</button>
    </div>
  )
}
