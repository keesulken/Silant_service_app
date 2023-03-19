import React, { useEffect, useState } from 'react';
import NotFoundPage from '../NotFoundPage';

export default function MachineForm(props) {
  let [instance, setInstance] = useState(null);
  let [units, setUnits] = useState(null);
  let [clients, setClients] = useState(null);
  let [companies, setCompanies] = useState(null);


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

  if (instance === 404) {
    return <NotFoundPage />
  } else if (!(units && clients && companies)) {
    return <div>No data</div>
  } else if (instance && instance !== 404) {
    return (
      <form>
      <p>Редактирование записи о машине</p>
      <p>Зав. № машины: <input type='text' id='serial' 
      value={instance.factory_number} /></p>
      <p>Модель техники: 
        <select id='tech-model'>
          <option>{ instance.machine_model.name }</option>
          { units.filter(unit => 
          unit.type === 'MCN' && unit.name !== instance.machine_model.name)
          .map(unit => (
            <option key={unit.pk}>{ unit.name }</option>)) }
        </select>
      </p>
      <p>Модель двигателя: 
        <select id='eng-model'>
          <option>{ instance.engine_model.name }</option>
          { units.filter(unit => 
          unit.type === 'ENG' && unit.name !== instance.engine_model.name)
          .map(unit => (
            <option key={unit.pk}>{ unit.name }</option>)) }
        </select>
      </p>
      <p>Зав. № двигателя: <input type='text' id='engine' 
      value={ instance.engine_number } /></p>
      <p>Модель трансмиссии: 
        <select id='trm-model'>
          <option>{ instance.transmission_model.name }</option>
          { units.filter(unit => 
          unit.type === 'TRM' && unit.name !== instance.transmission_model.name)
          .map(unit => (
            <option key={unit.pk}>{ unit.name }</option>)) }
        </select>
      </p>
      <p>Зав. № трансмиссии: <input type='text' id='transmission' 
      value={ instance.transmission_number } /></p>
      <p>Модель ведущего моста: 
        <select id='dra-model'>
          <option>{ instance.drive_axle_model.name }</option>
          { units.filter(unit => 
          unit.type === 'DRA' && unit.name !== instance.drive_axle_model.name)
          .map(unit => (
            <option key={unit.pk}>{ unit.name }</option>)) }
        </select>
      </p>
      <p>Зав. № ведущего моста: <input type='text' id='drive' 
      value={instance.drive_axle_number} /></p>
      <p>Модель управляемого моста: 
        <select id='sta-model'>
          <option>{ instance.steered_axle_model.name }</option>
          { units.filter(unit => 
          unit.type === 'STA' && unit.name !== instance.steered_axle_model.name)
          .map(unit => (
            <option key={unit.pk}>{ unit.name }</option>)) }
        </select>
      </p>
      <p>Зав. № управляемого моста: <input type='text' id='steered' 
      value={instance.steered_axle_number} /></p>
      <p>Договор поставки №, дата: <input type='text' id='supply' 
      value={instance.supply_contract_number_date} /></p>
      <p>Дата отгрузки с завода: <input type='date' id='dispatch' 
      value={instance.dispatch_date} /></p>
      <p>Грузополучатель (конечный потребитель): <input type='text' id='consignee' 
      value={instance.consignee} /></p>
      <p>Адрес поставки (эксплуатации): <input type='text' id='address' 
      value={instance.delivery_address} /></p>
      <p>Комплектация (доп. опции): <input type='text' id='equipment' 
      value={instance.equipment} /></p>
      <p>Клиент: 
        <select id='client'>
          <option>{ instance.client.name }</option>
          { clients.filter(client => 
          client.name !== instance.client.name).map(client => (
          <option key={client.pk}>{ client.name }</option>)) }
          <option>-----</option>
        </select>
      </p>
      <p>Сервисная компания: 
        <select id='company'>
          <option>{ instance.service_company.name }</option>
          { companies.filter(company => 
          company.name !== instance.service_company.name)
          .map(company => (
          <option key={company.pk}>{ company.name }</option>)) }
          <option>-----</option>
        </select>
      </p>
      <p>
        <input type='submit' value='Отправить'></input>
        <input type='reset' value='Сброс'></input>
      </p>
    </form>  
    )
  } else {
    return (
    <form>
      <p>Создание новой записи о машине</p>
      <p>Зав. № машины: <input type='text' id='serial'></input></p>
      <p>Модель техники: 
        <select id='tech-model'>
          { units.filter(unit => unit.type === 'MCN').map(unit => (
            <option key={unit.pk}>{ unit.name }</option>
          )) }
        </select>
      </p>
      <p>Модель двигателя: 
        <select id='eng-model'>
          { units.filter(unit => unit.type === 'ENG').map(unit => (
            <option key={unit.pk}>{ unit.name }</option>
          )) }
        </select>
      </p>
      <p>Зав. № двигателя: <input type='text' id='engine'></input></p>
      <p>Модель трансмиссии: 
        <select id='trm-model'>
          { units.filter(unit => unit.type === 'TRM').map(unit => (
            <option key={unit.pk}>{ unit.name }</option>
          )) }
        </select>
      </p>
      <p>Зав. № трансмиссии: <input type='text' id='transmission'></input></p>
      <p>Модель ведущего моста: 
        <select id='dra-model'>
          { units.filter(unit => unit.type === 'DRA').map(unit => (
            <option key={unit.pk}>{ unit.name }</option>
          )) }
        </select>
      </p>
      <p>Зав. № ведущего моста: <input type='text' id='drive'></input></p>
      <p>Модель управляемого моста: 
        <select id='sta-model'>
          { units.filter(unit => unit.type === 'STA').map(unit => (
            <option key={unit.pk}>{ unit.name }</option>
          )) }
        </select>
      </p>
      <p>Зав. № управляемого моста: <input type='text' id='steered'></input></p>
      <p>Договор поставки №, дата: <input type='text' id='supply'></input></p>
      <p>Дата отгрузки с завода: <input type='date' id='dispatch'></input></p>
      <p>Грузополучатель (конечный потребитель): <input type='text' id='consignee'></input></p>
      <p>Адрес поставки (эксплуатации): <input type='text' id='address'></input></p>
      <p>Комплектация (доп. опции): <input type='text' id='equipment'></input></p>
      <p>Клиент: 
        <select id='client'>
          <option>-----</option>
          { clients.map(client => (
            <option key={client.pk}>{ client.name }</option>
          )) }
        </select>
      </p>
      <p>Сервисная компания: 
        <select id='company'>
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
