import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function DirectoryList() {
  let [units, setUnits] = useState();
  let [repairs, setRepairs] = useState();
  let navigate = useNavigate();


  useEffect(()=> {
    let unitURL = 'http://127.0.0.1:8000/api/v1/directory/units';
    let repairURL = 'http://127.0.0.1:8000/api/v1/directory/repairs';
    Promise.all([
      fetch(unitURL).then(res => res.json()),
      fetch(repairURL).then(res => res.json()),
    ]).then(result => {
      setUnits(result[0]);
      setRepairs(result[1]);
    }).catch(error => console.log(error.message));
  }, [])


  function updateHolder (instance, id) {
    navigate(`/update/${instance}/${id}`);
  }

  if (!units || !repairs) {
    return <div>No data</div>
  } else {
    return (
      <div>
        <p>Изменение данных справочников техники</p>
        <table>
          <thead>
            <tr>
              <th>Тип справочника</th>
              <th>Название</th>
              <th>Описание</th>
              <th>---</th>
              <th>---</th>
            </tr>
          </thead>
          <tbody>
            { units.map(item => (
              <tr key={item.id}>
                <td>{ item.type }</td>
                <td><Link to={'/unit/' + item.id}
                >{ item.name }</Link></td>
                <td>
                  { item.description.length > 20 && item.description.slice(0, 20) + '...' }
                  { item.description.length <= 20 && item.description }
                </td>
                <td><button onClick={(e) => updateHolder('unit', item.id, e)}
                >Изменить</button></td>
                <td><button>Удалить</button></td>
              </tr>
            )) }
          </tbody>
        </table>
        <hr />
        <p>Изменение данных справочников по обслуживанию</p>
        <table>
          <thead>
            <tr>
              <th>Тип справочника</th>
              <th>Название</th>
              <th>Описание</th>
              <th>---</th>
              <th>---</th>
            </tr>
          </thead>
          <tbody>
            { repairs.map(item => (
              <tr key={item.id}>
                <td>{ item.type }</td>
                <td><Link to={'/repair/' + item.id}
                >{ item.name }</Link></td>
                <td>
                  { item.description.length > 20 && item.description.slice(0, 20) + '...' }
                  { item.description.length <= 20 && item.description }
                </td>
                <td><button onClick={(e) => updateHolder('repair', item.id, e)}
                >Изменить</button></td>
                <td><button>Удалить</button></td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
    )
  }
}
