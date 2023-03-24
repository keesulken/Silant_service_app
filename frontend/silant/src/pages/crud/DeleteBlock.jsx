import React from 'react';

export default function DeleteBlock(props) {


  function deleteConfirm () {
    let block = document.getElementById('delete-block');
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
        return res.json();
      } else {
        console.log('error');
      };
    }).then(result => {
      block.innerHTML = <p>{result.error}</p>;
    }).catch(error => console.log(error.message));
  }


  function cancelHandler () {
    props.void();
  }


  return (
    <div id='delete-block'>
        <p>Вы действительно хотите удалить { props.name }?</p>
        <button onClick={deleteConfirm}>Удалить</button>
        <button onClick={cancelHandler}>Отмена</button>
    </div>
  )
}
