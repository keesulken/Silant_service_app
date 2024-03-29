import React, { useState, useEffect } from 'react';
import NotFoundPage from '../NotFoundPage';
import { useNavigate } from 'react-router-dom';
import ErrorBlock from '../app/ErrorBlock';

export default function MaintenanceForm(props) {
  let [instance, setInstance] = useState();
  let [repairs, setRepairs] = useState();
  let [machines, setMachines] = useState();
  let [companies, setCompanies] = useState();
  let [errorBlock, setErrorBlock] = useState();
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
        } else if (res.status === 403 ||
          res.status === 401) {
          throw new Error('403');
        } else {
          throw new Error('500');
        };
      }).then(result => setInstance(result))
      .catch(error => {
        if (error.message === '403') {
          errorBlockVoid();
          let block = <ErrorBlock error={'Недостаточно прав'} />;
          setErrorBlock(block);
        } else if (error.message === '500' ||
        error.name === 'TypeError') {
          errorBlockVoid();
          let block = <ErrorBlock error={'Неизвестная ошибка, попробуйте позже'} />;
          setErrorBlock(block);
        };
      });
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
        errors.push('Все поля обязательны к заполнению');
        break;
      };
    };
    if (now - new Date(data.get('mt-date')) < 0 ) {
      errors.push('Поле "Дата ТО" заполнено некорректно');
    } else if (now - new Date(data.get('work-order-date')) < 0) {
      errors.push('Поле "Дата заказ-наряда" заполнено некорректно');
    };
    if (!isNumber(data.get('mt-time'))) {
      errors.push('Поле "Наработка" должно быть числовым');
    };
    errorBlockVoid();
    if (errors.length !== 0) {
      let block = <ErrorBlock error={errors[0]} />;
      setErrorBlock(block);
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
          } else if (res.status === 403 ||
            res.status === 401) {
            throw new Error('403');
          } else {
            throw new Error('500');
          };
        }).catch(error => {
          if (error.message === '403') {
            errorBlockVoid();
            let block = <ErrorBlock error={'Недостаточно прав'} />;
            setErrorBlock(block);
          } else if (error.message === '500' ||
          error.name === 'TypeError') {
            errorBlockVoid();
            let block = <ErrorBlock error={'Неизвестная ошибка, попробуйте позже'} />;
            setErrorBlock(block);
          };
        });
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
          } else if (res.status === 403 ||
            res.status === 401) {
            throw new Error('403');
          } else {
            throw new Error('500');
          };
        }).catch(error => {
          if (error.message === '403') {
            errorBlockVoid();
            let block = <ErrorBlock error={'Недостаточно прав'} />;
            setErrorBlock(block);
          } else if (error.message === '500' ||
          error.name === 'TypeError') {
            errorBlockVoid();
            let block = <ErrorBlock error={'Неизвестная ошибка, попробуйте позже'} />;
            setErrorBlock(block);
          };
        });
      };
    };
  }


  function errorBlockVoid () {
    if (document.getElementById('error-block')) {
        setErrorBlock();
    };
  }


  if (instance === 404) {
    return <NotFoundPage />
  } else if (!(repairs && machines && companies)) {
    return <div>No data</div>
  } else if (instance && instance !== 404) {
    return (
      <>
        <p>Редактирование данных о ТО</p>
        { errorBlock }
        <form onSubmit={sendForm} encType="multipart/form-data" className='creation-form'>
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
          <p className='form-controls'>
            <input type='submit' value='Отправить' className='form-button' />
            <input type='reset' value='Сброс' onMouseLeave={dataLoader} className='form-button' />
          </p>
        </form>
      </>
    )
  } else {
    
    
    
    return (
      <>
        <p>Создание новой записи ТО</p>
        { errorBlock }
        <form onSubmit={sendForm} encType="multipart/form-data" className='creation-form'>
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
          <p className='form-controls'>
            <input type='submit' value='Отправить' className='form-button' />
            <input type='reset' value='Сброс' className='form-button' />
          </p>
        </form>
      </>
    )
  }
}
