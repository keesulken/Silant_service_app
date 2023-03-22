import React, { useEffect, useState } from 'react';
import NotFoundPage from '../NotFoundPage';
import { useNavigate } from 'react-router-dom';

export default function MachineForm(props) {
  let [instance, setInstance] = useState();
  let [units, setUnits] = useState();
  let [clients, setClients] = useState();
  let [companies, setCompanies] = useState();
  let navigate = useNavigate();


  useEffect(()=>{
    if (props.id) {
      let url = 'http://127.0.0.1:8000/api/v1/search/' + props.id;
      fetch(url).then(res => {
        if (res.status === 200) {
          return res.json();
        } else if (res.status === 404) {
          setInstance(404);
        } else {
          console.log('error');
        }
      }).then(result => setInstance(result))
      .catch(error => console.log(error.message));
    };
  }, [])


  useEffect(()=>{
    let unitsURL = 'http://127.0.0.1:8000/api/v1/units';
    let clientsURL = 'http://127.0.0.1:8000/api/v1/clients';
    let companiesURL = 'http://127.0.0.1:8000/api/v1/companies';
    Promise.all([
      fetch(unitsURL).then(res => res.json()),
      fetch(clientsURL).then(res => res.json()),
      fetch(companiesURL).then(res => res.json()),
    ]).then(result => {
      setUnits(result[0]);
      setClients(result[1]);
      setCompanies(result[2]);
    })
    .catch(error => console.log(error.message));
  }, [])


  function dataLoader () {
    if (document.querySelector('form') 
    && instance
    && instance !== 404) {
      document.getElementById('serial').value = instance.factory_number;
      document.getElementById('engine').value = instance.engine_number;
      document.getElementById('transmission').value = instance.transmission_number;
      document.getElementById('drive').value = instance.drive_axle_number;
      document.getElementById('steered').value = instance.steered_axle_number;
      document.getElementById('supply').value = instance.supply_contract_number_date;
      document.getElementById('dispatch').value = instance.dispatch_date;
      document.getElementById('consignee').value = instance.consignee;
      document.getElementById('address').value = instance.delivery_address;
      document.getElementById('equipment').value = instance.equipment;
    };
  }


  useEffect(dataLoader)


  function sendForm (e) {
    e.preventDefault();
    let errors = [];
    let now = new Date();
    let data = new FormData(document.querySelector('form'))
    for (let [key, value] of data) {
      if (value === '') {
        errors.push('All fields required');
        break;
      };
    };
    if (now - new Date(data.get('dispatch')) < 0 ) {
      errors.push('invalid date');
    };
    console.log(errors);
    if (errors.length !== 0) {
      console.log('error');
    } else {
      if (instance) {
        let url = 'http://127.0.0.1:8000/api/v1/machine/' + instance.id;
        let options = {
          method: 'PATCH',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
          body: data,
        };
        fetch(url, options).then(res => {
          if (res.status === 204) {
            navigate('/machine/' + instance.id);
          } else {
            console.log('error');
          };
        }).catch(error => console.log(error.message));
      } else {
        let url = 'http://127.0.0.1:8000/api/v1/machine';
        let options = {
          method: 'POST',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
          body: data,
        };
        fetch(url, options).then(res => {
          if (res.status === 201) {
            return res.json();
          } else {
            console.log('error');
          };
        }).then(result => navigate('/machine/' + result.id))
        .catch(error => console.log(error.message));
      };
    };
  }


  if (instance === 404) {
    return <NotFoundPage />
  } else if (!(units && clients && companies)) {
    return <div>No data</div>
  } else if (instance && instance !== 404) {
    return (
      <form onSubmit={sendForm} encType="multipart/form-data">
      <p>Редактирование записи о машине</p>
      <p>Зав. № машины: <input type='text' name='serial' 
      id='serial' /></p>
      <p>Модель техники: 
        <select name='tech-model'>
          <option>{ instance.machine_model.name }</option>
          { units.filter(unit => 
          unit.type === 'MCN' && unit.name !== instance.machine_model.name)
          .map(unit => (
            <option key={unit.pk}>{ unit.name }</option>)) }
        </select>
      </p>
      <p>Модель двигателя: 
        <select name='eng-model'>
          <option>{ instance.engine_model.name }</option>
          { units.filter(unit => 
          unit.type === 'ENG' && unit.name !== instance.engine_model.name)
          .map(unit => (
            <option key={unit.pk}>{ unit.name }</option>)) }
        </select>
      </p>
      <p>Зав. № двигателя: <input type='text' name='engine' 
      id='engine' /></p>
      <p>Модель трансмиссии: 
        <select name='trm-model'>
          <option>{ instance.transmission_model.name }</option>
          { units.filter(unit => 
          unit.type === 'TRM' && unit.name !== instance.transmission_model.name)
          .map(unit => (
            <option key={unit.pk}>{ unit.name }</option>)) }
        </select>
      </p>
      <p>Зав. № трансмиссии: <input type='text' name='transmission' 
      id='transmission' /></p>
      <p>Модель ведущего моста: 
        <select name='dra-model'>
          <option>{ instance.drive_axle_model.name }</option>
          { units.filter(unit => 
          unit.type === 'DRA' && unit.name !== instance.drive_axle_model.name)
          .map(unit => (
            <option key={unit.pk}>{ unit.name }</option>)) }
        </select>
      </p>
      <p>Зав. № ведущего моста: <input type='text' name='drive' 
      id='drive' /></p>
      <p>Модель управляемого моста: 
        <select name='sta-model'>
          <option>{ instance.steered_axle_model.name }</option>
          { units.filter(unit => 
          unit.type === 'STA' && unit.name !== instance.steered_axle_model.name)
          .map(unit => (
            <option key={unit.pk}>{ unit.name }</option>)) }
        </select>
      </p>
      <p>Зав. № управляемого моста: <input type='text' name='steered' 
      id='steered' /></p>
      <p>Договор поставки №, дата: <input type='text' name='supply' 
      id='supply' /></p>
      <p>Дата отгрузки с завода: <input type='date' name='dispatch' 
      id='dispatch' /></p>
      <p>Грузополучатель (конечный потребитель): <input type='text' name='consignee' 
      id='consignee' /></p>
      <p>Адрес поставки (эксплуатации): <input type='text' name='address' 
      id='address' /></p>
      <p>Комплектация (доп. опции): <input type='text' name='equipment' 
      id='equipment' /></p>
      <p>Клиент: 
        <select name='client'>
          { instance.client && <option>{ instance.client.name }</option> }
          { instance.client && clients.filter(client => 
          client.name !== instance.client.name).map(client => (
          <option key={client.pk}>{ client.name }</option>)) }
          { instance.client && <option>-----</option> }
          { !instance.client && <option>-----</option> }
          { !instance.client &&  clients.map(client => (
            <option key={client.pk}>{ client.name }</option>
          )) }
        </select>
      </p>
      <p>Сервисная компания: 
        <select name='company'>
          { instance.service_company && 
          <option>{ instance.service_company.name }</option> }
          { instance.service_company && 
          companies.filter(company => 
          company.name !== instance.service_company.name)
          .map(company => (
          <option key={company.pk}>{ company.name }</option>)) }
          { instance.service_company && <option>-----</option> }
          { !instance.service_company && <option>-----</option> }
          { !instance.service_company && companies.map(company => (
            <option key={company.pk}>{ company.name }</option>
          )) }
        </select>
      </p>
      <p>
        <input type='submit' value='Отправить'></input>
        <input type='reset' value='Сброс' onMouseLeave={dataLoader}></input>
      </p>
    </form>  
    )
  } else {
    
    
    
    return (
    <form onSubmit={sendForm} encType="multipart/form-data">
      <p>Создание новой записи о машине</p>
      <p>Зав. № машины: <input type='text' name='serial' ></input></p>
      <p>Модель техники: 
        <select name='tech-model'>
          { units.filter(unit => unit.type === 'MCN').map(unit => (
            <option key={unit.pk}>{ unit.name }</option>
          )) }
        </select>
      </p>
      <p>Модель двигателя: 
        <select name='eng-model'>
          { units.filter(unit => unit.type === 'ENG').map(unit => (
            <option key={unit.pk}>{ unit.name }</option>
          )) }
        </select>
      </p>
      <p>Зав. № двигателя: <input type='text' name='engine'></input></p>
      <p>Модель трансмиссии: 
        <select name='trm-model'>
          { units.filter(unit => unit.type === 'TRM').map(unit => (
            <option key={unit.pk}>{ unit.name }</option>
          )) }
        </select>
      </p>
      <p>Зав. № трансмиссии: <input type='text' name='transmission'></input></p>
      <p>Модель ведущего моста: 
        <select name='dra-model'>
          { units.filter(unit => unit.type === 'DRA').map(unit => (
            <option key={unit.pk}>{ unit.name }</option>
          )) }
        </select>
      </p>
      <p>Зав. № ведущего моста: <input type='text' name='drive'></input></p>
      <p>Модель управляемого моста: 
        <select name='sta-model'>
          { units.filter(unit => unit.type === 'STA').map(unit => (
            <option key={unit.pk}>{ unit.name }</option>
          )) }
        </select>
      </p>
      <p>Зав. № управляемого моста: <input type='text' name='steered'></input></p>
      <p>Договор поставки №, дата: <input type='text' name='supply'></input></p>
      <p>Дата отгрузки с завода: <input type='date' name='dispatch'></input></p>
      <p>Грузополучатель (конечный потребитель): <input type='text' name='consignee'></input></p>
      <p>Адрес поставки (эксплуатации): <input type='text' name='address'></input></p>
      <p>Комплектация (доп. опции): <input type='text' name='equipment'></input></p>
      <p>Клиент: 
        <select name='client'>
          <option>-----</option>
          { clients.map(client => (
            <option key={client.pk}>{ client.name }</option>
          )) }
        </select>
      </p>
      <p>Сервисная компания: 
        <select name='company'>
          <option>-----</option>
          { companies.map(company => (
            <option key={company.pk}>{ company.name }</option>
          )) }
        </select>
      </p>
      <p>
        <input type='submit' value='Отправить'></input>
        <input type='reset' value='Сброс'></input>
      </p>
    </form>
    )
  }
}
