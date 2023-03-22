import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ProfileList() {
  let [clients, setClients] = useState();
  let [companies, setCompanies] = useState();
  let navigate = useNavigate();


  useEffect(()=>{
    let clientURL = 'http://127.0.0.1:8000/api/v1/clients';
    let companyURL = 'http://127.0.0.1:8000/api/v1/companies';
    Promise.all([
      fetch(clientURL).then(res => res.json()),
      fetch(companyURL).then(res => res.json()),
    ]).then(result => {
      setClients(result[0]);
      setCompanies(result[1]);
    }).catch(error => console.log(error.message));
  }, [])


  function updateHolder (instance, id) {
    navigate(`/update/${instance}/${id}`);
  }


  if (!clients || !companies) {
    return <div>No data</div>
  } else {
    return (
      <div>
        <p>Изменение карточек клиентов</p>
        <table>
          <thead>
            <tr>
              <th>Учётная запись</th>
              <th>Название</th>
              <th>Описание</th>
              <th>---</th>
            </tr>
          </thead>
          <tbody>
            { clients.map(item => (
              <tr key={item.pk}>
                <td>{ item.user.username }</td>
                <td><Link to={'/client/' + item.pk}
                >{ item.name }</Link></td>
                <td>
                  { item.description.length > 20 && item.description.slice(0, 20) + '...' }
                  { item.description.length <= 20 && item.description }
                </td>
                <td><button onClick={(e) => updateHolder('client', item.pk, e)}
                >Изменить</button></td>
              </tr>
            )) }
          </tbody>
        </table>
        <hr />
        <p>Изменение карточек сервисных организаций</p>
        <table>
          <thead>
            <tr>
              <th>Учётная запись</th>
              <th>Название</th>
              <th>Описание</th>
              <th>---</th>
            </tr>
          </thead>
          <tbody>
            { companies.map(item => (
              <tr key={item.pk}>
                <td>{ item.user.username }</td>
                <td><Link to={'/company/' + item.pk}
                >{ item.name }</Link></td>
                <td>
                  { item.description.length > 20 && item.description.slice(0, 20) + '...' }
                  { item.description.length <= 20 && item.description }
                </td>
                <td><button onClick={(e) => updateHolder('company', item.pk, e)}
                >Изменить</button></td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
    )
  }
}
