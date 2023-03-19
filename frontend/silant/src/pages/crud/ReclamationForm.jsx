import React, { useState, useEffect } from 'react';
import NotFoundPage from '../NotFoundPage';

export default function ReclamationForm(props) {
  let [instance, setInstance] = useState(null);
  let [repairs, setRepairs] = useState(null);
  let [machines, setMachines] = useState(null);
  let [companies, setCompanies] = useState(null);


  useEffect(()=>{
    if (props.id) {
      let url = 'http://127.0.0.1:8000/api/v1/reclamation/' + props.id;
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
    };
  }, [])


  useEffect(()=>{
    let repairsURL = 'http://127.0.0.1:8000/api/v1/repairs';
    let machinesURL = 'http://127.0.0.1:8000/api/v1/machines';
    let companiesURL = 'http://127.0.0.1:8000/api/v1/companies';
    Promise.all([
      fetch(repairsURL).then(res => res.json()),
      fetch(machinesURL).then(res => res.json()),
      fetch(companiesURL).then(res => res.json()),
    ]).then(result => {
      setRepairs(result[0]);
      setMachines(result[1]);
      setCompanies(result[2]);
    }).catch(error => console.log(error.message));
  }, [])


  if (instance === 404) {
    return <NotFoundPage />
  } else if (!(repairs && machines && companies)) {
    return <div>No data</div>
  } else if (instance && instance !== 404) {
    return (
      <form>
        <p>Редактирование рекламации</p>
        <p>Дата отказа: 
          <input type='date' id='rl-date' 
          value={instance.rejection_date} />
        </p>
        <p>Наработка: 
          <input type='text' id='operating' 
          value={instance.operating_time} />
        </p>
        <p>Узел отказа: 
          <select>
            <option>{ instance.unit.name }</option>
            { repairs.filter(item =>
              item.type === 'UNT' && item.name !== instance.unit.name)
              .map(item => <option key={item.pk}>{ item.name }</option>) }
          </select>
        </p>
        <p>Описание отказа: 
          <input type='text' id='rl-description' 
          value={instance.description} />
        </p>
        <p>Способ восстановления: 
          <select>
            <option>{ instance.repair_method.name }</option>
            { repairs.filter(item => 
              item.type === 'RPT' && item.name !== instance.repair_method.name)
              .map(item => <option key={item.pk}>{ item.name }</option>) }
          </select>
        </p>
        <p>Используемые запасные части: 
          <input type='text' id='rl-parts' 
          value={instance.spare_parts} />
        </p>
        <p>Дата восстановления: 
          <input type='date' id='recovery-date'
          value={instance.recovery_date} />
        </p>
        <p>Время простоя техники: {instance.downtime}</p>
        <p>Машина: 
          <select>
            <option>{ instance.machine.factory_number }</option>
            { machines.filter(item => 
              item.factory_number !== instance.machine.factory_number)
              .map(item => 
              <option key={item.id}>{ item.factory_number }</option>) }
          </select>
        </p>
        <p>Сервисная компания: 
          <select>
            <option>{ instance.service_company.name }</option>
            { companies.filter(item => 
              item.name !== instance.service_company.name)
              .map(item =>
              <option key={item.pk}>{ item.name }</option>) }
          </select>
        </p>
        <p>
          <input type='submit' value='Отправить' />
          <input type='reset' value='Сброс' />
        </p>
      </form>
    )
  } else {
    return (
      <form>
        <p>Создание новой рекламации</p>
        <p>Дата отказа: 
          <input type='date' id='rl-date' />
        </p>
        <p>Наработка: 
          <input type='text' id='operating' />
        </p>
        <p>Узел отказа: 
          <select>
            { repairs.filter(item =>
              item.type === 'UNT')
              .map(item => <option key={item.pk}>{ item.name }</option>) }
          </select>
        </p>
        <p>Описание отказа: 
          <input type='text' id='rl-description' />
        </p>
        <p>Способ восстановления: 
          <select>
            { repairs.filter(item => 
              item.type === 'RPT')
              .map(item => <option key={item.pk}>{ item.name }</option>) }
          </select>
        </p>
        <p>Используемые запасные части: 
          <input type='text' id='rl-parts' />
        </p>
        <p>Дата восстановления: 
          <input type='date' id='recovery-date' />
        </p>
        <p>Время простоя техники: </p>
        <p>Машина: 
          <select>
            { machines.map(item => 
              <option key={item.id}>{ item.factory_number }</option>) }
          </select>
        </p>
        <p>Сервисная компания: 
          <select>
            { companies.map(item =>
              <option key={item.pk}>{ item.name }</option>) }
          </select>
        </p>
        <p>
          <input type='submit' value='Отправить' />
          <input type='reset' value='Сброс' />
        </p>
      </form>
    )
  }
}
