import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Forbidden403 from '../Forbidden403';
import DeleteBlock from './DeleteBlock';

export default function UserList(props) {
  let [users, setUsers] = useState();
  let [deleteBlock, setDeleteBlock] = useState();
  let navigate = useNavigate();


  useEffect(()=>{
    let url = 'http://127.0.0.1:8000/api/v1/user';
    let options = {
      method: 'GET',
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
    };
    fetch(url, options).then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        console.log('error');
      };
    }).then(result => setUsers(result))
    .catch(error => console.log(error.message));
  }, [])


  function updateHolder (id) {
    navigate(`/user/update/${id}`);
  }


  function blockVoid () {
    setDeleteBlock();
  }


  function deleteHolder (id, instance, name) {
    let oldDeleteBlock = document.getElementById('delete-block');
    if (oldDeleteBlock) {
      blockVoid();
    };
    setDeleteBlock(<DeleteBlock id={id} instance={instance} name={name} void={blockVoid}/>);
  }


  if (props.user) {
    if (props.user.is_superuser && (!users || users.length === 0)) {
      return <div>Нет данных</div>
    } else if (props.user.is_superuser) {
      return (
      <div>
        <p>Редактирование учётных данных</p>
        { deleteBlock }
        <table className='user-update-table'>
          <thead>
            <tr>
              <th>Имя учётной записи</th>
              <th>Тип учётной записи</th>
              <th>Профиль</th>
              <th>Администратор?</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            { users.map(user => (
              <tr key={user.id}>
                <td data-label='Имя учётной записи'>{ user.username }</td>
                <td data-label='Тип учётной записи'>{ user.type }</td>
                { (!user.cl_profile[0] && !user.sc_profile[0]) && <td data-label='Профиль'> - </td> }
                { user.cl_profile[0] && 
                <td data-label='Профиль'><Link to={'/client/' + user.cl_profile[0].pk}
                >{ user.cl_profile[0].name }</Link></td> }
                { user.sc_profile[0] && 
                <td data-label='Профиль'><Link to={'/company/' + user.sc_profile[0].pk}
                >{ user.sc_profile[0].name }</Link></td> }
                { user.is_superuser && <td data-label='Администратор?'> Да </td> }
                { !user.is_superuser && <td data-label='Администратор?'> Нет </td> }
                <td data-label=' '><button onClick={(e) => updateHolder(user.id, e)}>Изменить</button></td>
                <td data-label=' '><button onClick={(e) => 
                deleteHolder(user.id, 'user', 
                `Пользователя ${user.username}`, e)}>Удалить</button></td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
      )
    } else {
      return <Forbidden403 />
    };
  } else {
    return <Forbidden403 />
  }
}
