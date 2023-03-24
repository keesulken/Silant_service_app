import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DeleteBlock from './DeleteBlock';

export default function DirectoryList() {
  let [units, setUnits] = useState();
  let [repairs, setRepairs] = useState();
  let [unitDeleteBlock, setUnitDeleteBlock] = useState();
  let [repairDeleteBlock, setRepairDeleteBlock] = useState();
  let navigate = useNavigate();


  useEffect(()=> {
    let unitURL = 'http://127.0.0.1:8000/api/v1/directory/units';
    let repairURL = 'http://127.0.0.1:8000/api/v1/directory/repairs';
    let options = {
      method: 'GET',
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
    };
    Promise.all([
      fetch(unitURL, options).then(res => res.json()),
      fetch(repairURL, options).then(res => res.json()),
    ]).then(result => {
      setUnits(result[0]);
      setRepairs(result[1]);
    }).catch(error => console.log(error.message));
  }, [])


  function updateHolder (instance, id) {
    navigate(`/update/${instance}/${id}`);
  }


  function unitBlockVoid () {
    setUnitDeleteBlock();
  }


  function deleteUnitHolder (id, instance, name) {
    let oldDeleteBlock = document.getElementById('delete-block');
    if (oldDeleteBlock) {
      unitBlockVoid();
    };
    setUnitDeleteBlock(<DeleteBlock id={id} instance={instance} 
      name={name} void={unitBlockVoid}/>);
  }


  function repairBlockVoid () {
    setRepairDeleteBlock();
  }


  function deleteRepairHolder (id, instance, name) {
    let oldDeleteBlock = document.getElementById('delete-block');
    if (oldDeleteBlock) {
      repairBlockVoid();
    };
    setRepairDeleteBlock(<DeleteBlock id={id} instance={instance} 
      name={name} void={repairBlockVoid}/>);
  }


  if (!units || !repairs) {
    return <div>Данные не найдены</div>
  } else if (units.length === 0 && repairs.length === 0) {
    return <div>По вашему запросу не найдено ни одной записи</div>
  } else if (units.length === 0 && repairs.length !== 0) {
    return (
    <div>
      <div>Справочников техники не найдено</div>
      <hr />
        <p>Изменение данных справочников по обслуживанию</p>
        { repairDeleteBlock }
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
                <td><button onClick={(e) => 
                deleteRepairHolder(item.id, 'repair', 
                `${item.type} ${item.name}`, e)}>Удалить</button></td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
    )
  } else if (units.length !== 0 && repairs.length === 0) {
    return (
      <div>
        <p>Изменение данных справочников техники</p>
        { unitDeleteBlock }
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
                <td><button onClick={(e) => 
                deleteUnitHolder(item.id, 'unit', 
                `${item.type} ${item.name}`, e)}>Удалить</button></td>
              </tr>
            )) }
          </tbody>
        </table>
        <hr />
        <div>Справочников по обслуживанию не найдено</div>
      </div>
    )
  } else {
    return (
      <div>
        <p>Изменение данных справочников техники</p>
        { unitDeleteBlock }
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
                <td><button onClick={(e) => 
                deleteUnitHolder(item.id, 'unit', 
                `${item.type} ${item.name}`, e)}>Удалить</button></td>
              </tr>
            )) }
          </tbody>
        </table>
        <hr />
        <p>Изменение данных справочников по обслуживанию</p>
        { repairDeleteBlock }
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
                <td><button onClick={(e) => 
                deleteRepairHolder(item.id, 'repair', 
                `${item.type} ${item.name}`, e)}>Удалить</button></td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
    )
  }
}
