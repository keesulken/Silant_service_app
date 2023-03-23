import React, { useState, useEffect } from 'react';
import NotFoundPage from '../NotFoundPage';
import { useNavigate } from 'react-router-dom';

export default function MaintenanceForm(props) {
  let [instance, setInstance] = useState();
  let [repairs, setRepairs] = useState();
  let [machines, setMachines] = useState();
  let [companies, setCompanies] = useState();
  let navigate = useNavigate();


  useEffect(()=>{
    if (props.id) {
      let url = 'http://127.0.0.1:8000/api/v1/maintenance/' + props.id;
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
      }).then(result => setInstance(result))
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
      document.getElementById('mt-date').value = instance.date;
      document.getElementById('mt-time').value = instance.operating_time;
      document.getElementById('work-order-num').value = instance.work_order_number;
      document.getElementById('work-order-date').value = instance.work_order_date;
    };
  }


  useEffect(dataLoader)


  function sendForm (e) {
    e.preventDefault();
    let isNumber = n => !isNaN(n);
    let errors = [];
    let now = new Date();
    let data = new FormData(document.querySelector('form'));
    for (let [key, value] of data) {
      if (value === '') {
        errors.push('All fields required');
        break;
      };
    };
    if ((now - new Date(data.get('mt-date')) < 0) || 
    (now - new Date(data.get('work-order-date')) < 0) ) {
      errors.push('invalid date');
    };
    if (!isNumber(data.get('mt-time'))) {
      errors.push('operating must be numeric')
    };
    if (errors.length !== 0) {
      console.log('error');
    } else {
      if (instance) {
        let url = 'http://127.0.0.1:8000/api/v1/maintenance/' + instance.id;
        let options = {
          method: 'PATCH',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
          body: data,
        };
        fetch(url, options).then(res => {
          if (res.status === 204) {
            navigate('/update/maintenance');
          } else {
            console.log('error');
          };
        }).catch(error => console.log(error.message));
      } else {
        let url = 'http://127.0.0.1:8000/api/v1/maintenances';
        let options = {
          method: 'POST',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
          body: data,
        };
        fetch(url, options).then(res => {
          if (res.status === 201) {
            navigate('/update/maintenance');
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
        <p>Редактирование данных о ТО</p>
        <p>Вид ТО:
          <select name='mt-type'>
            <option>{ instance.type.name }</option>
            { repairs.filter(item => (
              item.type === 'MNT' && item.name !== instance.type.name
            )).map(item => 
            <option key={item.pk}>{ item.name }</option>) }
          </select>
        </p>
        <p>Дата проведения ТО:
          <input type='date' name='mt-date' id='mt-date' />
        </p>
        <p>Наработка, м/час:
          <input type='text' name='mt-time' id='mt-time' />
        </p>
        <p>№ заказ-наряда:
          <input type='text' name='work-order-num' 
          id='work-order-num' />
        </p>
        <p>Дата заказ-наряда:
          <input type='date' name='work-order-date' 
          id='work-order-date' />
        </p>
        <p>Организация, проводившая ТО:
          <select name='mt-holder'>
            <option>{ instance.maintenance_holder.name }</option>
            { repairs.filter(item => (
            item.type === 'MTH' && item.name !== instance.type.name
            )).map(item => 
            <option key={item.pk}>{ item.name }</option>) }
          </select>
        </p>
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
        <p>Создание новой записи ТО</p>
        <p>Вид ТО:
          <select name='mt-type'>
            { repairs.filter(item => (item.type === 'MNT'
            )).map(item => 
            <option key={item.pk}>{ item.name }</option>) }
          </select>
        </p>
        <p>Дата проведения ТО:
          <input type='date' name='mt-date' id='mt-date' />
        </p>
        <p>Наработка, м/час:
          <input type='text' name='mt-time' id='mt-time' />
        </p>
        <p>№ заказ-наряда:
          <input type='text' name='work-order-num' id='work-order-num' />
        </p>
        <p>Дата заказ-наряда:
          <input type='date' name='work-order-date' id='work-order-date' />
        </p>
        <p>Организация, проводившая ТО:
          <select name='mt-holder'>
            { repairs.filter(item => (item.type === 'MTH'
            )).map(item => 
            <option key={item.pk}>{ item.name }</option>) }
          </select>
        </p>
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
