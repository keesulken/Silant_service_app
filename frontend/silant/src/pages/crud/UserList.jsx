import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Forbidden403 from '../Forbidden403';

export default function UserList(props) {
  let [users, setUsers] = useState();
  let navigate = useNavigate();


  useEffect(()=>{
    let url = 'http://127.0.0.1:8000/api/v1/user';
    fetch(url).then(res => {
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


  if (props.user) {
    if (props.user.is_superuser && !users) {
      return <div>No data</div>
    } else if (props.user.is_superuser) {
      return (
      <div>
        <p>Редактирование учётных данных</p>
        <table>
          <thead>
            <tr>
              <th>Имя учётной записи</th>
              <th>Тип учётной записи</th>
              <th>Профиль</th>
              <th>Администратор?</th>
              <th>---</th>
              <th>---</th>
            </tr>
          </thead>
          <tbody>
            { users.map(user => (
              <tr key={user.id}>
                <td>{ user.username }</td>
                <td>{ user.type }</td>
                { (!user.cl_profile[0] && !user.sc_profile[0]) && <td> - </td> }
                { user.cl_profile[0] && 
                <td><Link to={'/client/' + user.cl_profile[0].pk}
                >{ user.cl_profile[0].name }</Link></td> }
                { user.sc_profile[0] && 
                <td><Link to={'/company/' + user.sc_profile[0].pk}
                >{ user.sc_profile[0].name }</Link></td> }
                { user.is_superuser && <td> Да </td> }
                { !user.is_superuser && <td> Нет </td> }
                <td><button onClick={(e) => updateHolder(user.id, e)}>Изменить</button></td>
                <td><button>Удалить</button></td>
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
