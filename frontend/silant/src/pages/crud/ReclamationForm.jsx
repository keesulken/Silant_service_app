import React, { useState, useEffect } from 'react';
import NotFoundPage from '../NotFoundPage';
import { useNavigate } from 'react-router-dom';

export default function ReclamationForm(props) {
  let [instance, setInstance] = useState();
  let [repairs, setRepairs] = useState();
  let [machines, setMachines] = useState();
  let [companies, setCompanies] = useState();
  let downtime;
  let dt = document.getElementById('downtime-p');
  let navigate = useNavigate();


  useEffect(()=>{
    if (props.id) {
      let url = 'http://127.0.0.1:8000/api/v1/reclamation/' + props.id;
      let options = {
        method: 'GET',
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
        },
      };
      fetch(url, options).then(res => {
        if (res.status === 200) {
          return res.json();
        } else if (res.status === 404) {
          setInstance(404);
        } else {
          console.log('error');
        };
      }).then(result => {
        setInstance(result);
        downtime = result.downtime;
      })
      .catch(error => console.log(error.message));
    };
  }, [])


  useEffect(()=>{
    let repairsURL = 'http://127.0.0.1:8000/api/v1/repairs';
    let machinesURL = 'http://127.0.0.1:8000/api/v1/machines';
    let companiesURL = 'http://127.0.0.1:8000/api/v1/companies';
    let options = {
      method: 'GET',
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
    };
    Promise.all([
      fetch(repairsURL, options).then(res => res.json()),
      fetch(machinesURL, options).then(res => res.json()),
      fetch(companiesURL, options).then(res => res.json()),
    ]).then(result => {
      setRepairs(result[0]);
      setMachines(result[1]);
      setCompanies(result[2]);
    }).catch(error => console.log(error.message));
  }, [])


  function dataLoader () {
    if (document.querySelector('form') 
    && instance
    && instance !== 404) {
      document.getElementById('rl-date').value = instance.rejection_date;
      document.getElementById('operating').value = instance.operating_time;
      document.getElementById('rl-description').value = instance.description;
      document.getElementById('rl-parts').value = instance.spare_parts;
      document.getElementById('recovery-date').value = instance.recovery_date;
      if (dt) {
        dt.textContent = instance.downtime;
      };
    };
  }


  useEffect(dataLoader)


  function countDowntime () {
    let rejection = new Date(document.getElementById('rl-date').value);
    let recovery = new Date(document.getElementById('recovery-date').value);
    let result = (recovery - rejection) / 86400000;
    downtime = Number.isInteger(result) ? result : null;
    dt.textContent = downtime;
  }


  function sendForm (e) {
    e.preventDefault();
    let isNumber = n => !isNaN(n);
    let errors = [];
    let now = new Date();
    let data = new FormData(document.querySelector('form'));
    data.append('downtime', dt.textContent);
    for (let [key, value] of data) {
      if (value === '') {
        errors.push('All fields required');
        break;
      };
    };
    if ((now - new Date(data.get('rl-date')) < 0) || 
    (now - new Date(data.get('rejection-date')) < 0) ) {
      errors.push('invalid date');
    };
    if (Number(data.get('downtime')) < 0) {
      errors.push('Downtime is incorrect');
    };
    if (!isNumber(data.get('operating'))) {
      errors.push('Operating time is not number');
    };
    console.log(errors);
    if (errors.length !== 0) {
      console.log('error');
    } else {
      if (instance) {
        let url = 'http://127.0.0.1:8000/api/v1/reclamation/' + instance.id;
        let options = {
          method: 'PATCH',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
          body: data,
        };
        fetch(url, options).then(res => {
          if (res.status === 204) {
            navigate('/update/reclamation');
          } else {
            console.log('error');
          };
        }).catch(error => console.log(error.message));
      } else {
        let url = 'http://127.0.0.1:8000/api/v1/reclamations';
        let options = {
          method: 'POST',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
          body: data,
        };
        fetch(url, options).then(res => {
          if (res.status === 201) {
            navigate('/update/reclamation');
          } else {
            console.log('error');
          };
        }).catch(error => console.log(error.message));
      };
    };
  }


  if (instance === 404) {
    return <NotFoundPage />
  } else if (!(repairs && machines && companies)) {
    return <div>No data</div>
  } else if (instance && instance !== 404) {
    return (
      <form onSubmit={sendForm} encType="multipart/form-data">
        <p>Редактирование рекламации</p>
        <p>Дата отказа: 
          <input type='date' name='rl-date'
          id='rl-date' onChange={countDowntime} />
        </p>
        <p>Наработка: 
          <input type='text' name='operating'
          id='operating' />
        </p>
        <p>Узел отказа: 
          <select name='rl-unit'>
            <option>{ instance.unit.name }</option>
            { repairs.filter(item =>
              item.type === 'UNT' && item.name !== instance.unit.name)
              .map(item => <option key={item.pk}>{ item.name }</option>) }
          </select>
        </p>
        <p>Описание отказа: 
          <input type='text' name='rl-description' 
          id='rl-description' />
        </p>
        <p>Способ восстановления: 
          <select name='recovery'>
            <option>{ instance.repair_method.name }</option>
            { repairs.filter(item => 
              item.type === 'RPT' && item.name !== instance.repair_method.name)
              .map(item => <option key={item.pk}>{ item.name }</option>) }
          </select>
        </p>
        <p>Используемые запасные части: 
          <input type='text' name='rl-parts' id='rl-parts' />
        </p>
        <p>Дата восстановления: 
          <input type='date' name='recovery-date' id='recovery-date' 
          onChange={countDowntime} />
        </p>
        <p>Время простоя техники: <b id='downtime-p'>{ instance.downtime }</b></p>
        <p>Машина: 
          <select name='machine'>
            <option>{ instance.machine.factory_number }</option>
            { machines.filter(item => 
              item.factory_number !== instance.machine.factory_number)
              .map(item => 
              <option key={item.id}>{ item.factory_number }</option>) }
          </select>
        </p>
        <p>Сервисная компания: 
          <select name='company'>
            <option>{ instance.service_company.name }</option>
            { companies.filter(item => 
              item.name !== instance.service_company.name)
              .map(item =>
              <option key={item.pk}>{ item.name }</option>) }
          </select>
        </p>
        <p>
          <input type='submit' value='Отправить' />
          <input type='reset' value='Сброс' onMouseLeave={dataLoader} />
        </p>
      </form>
    )
  } else {
    
    
    
    return (
      <form onSubmit={sendForm} encType="multipart/form-data">
        <p>Создание новой рекламации</p>
        <p>Дата отказа: 
          <input type='date' name='rl-date' id='rl-date' 
          onChange={countDowntime} />
        </p>
        <p>Наработка: 
          <input type='text' name='operating' id='operating' />
        </p>
        <p>Узел отказа: 
          <select name='rl-unit'>
            { repairs.filter(item =>
              item.type === 'UNT')
              .map(item => <option key={item.pk}>{ item.name }</option>) }
          </select>
        </p>
        <p>Описание отказа: 
          <input type='text' name='rl-description' id='rl-description' />
        </p>
        <p>Способ восстановления: 
          <select name='recovery'>
            { repairs.filter(item => 
              item.type === 'RPT')
              .map(item => <option key={item.pk}>{ item.name }</option>) }
          </select>
        </p>
        <p>Используемые запасные части: 
          <input type='text' name='rl-parts' id='rl-parts' />
        </p>
        <p>Дата восстановления: 
          <input type='date' name='recovery-date' id='recovery-date' 
          onChange={countDowntime} />
        </p>
        <p>Время простоя техники: <b id='downtime-p'>{ downtime }</b></p>
        <p>Машина: 
          <select name='machine'>
            { machines.map(item => 
              <option key={item.id}>{ item.factory_number }</option>) }
          </select>
        </p>
        <p>Сервисная компания: 
          <select name='company'>
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
