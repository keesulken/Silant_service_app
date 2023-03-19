import React, { useState, useEffect } from 'react';
import NotFoundPage from '../NotFoundPage';

export default function MaintenanceForm(props) {
  let [instance, setInstance] = useState(null);
  let [repairs, setRepairs] = useState(null);
  let [machines, setMachines] = useState(null);
  let [companies, setCompanies] = useState(null);


  useEffect(()=>{
    if (props.id) {
      let url = 'http://127.0.0.1:8000/api/v1/maintenance/' + props.id;
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
        <p>Редактирование данных о ТО</p>
        <p>Вид ТО:
          <select>
            <option>{ instance.type.name }</option>
            { repairs.filter(item => (
              item.type === 'MNT' && item.name !== instance.type.name
            )).map(item => 
            <option key={item.pk}>{ item.name }</option>) }
          </select>
        </p>
        <p>Дата проведения ТО:
          <input type='date' id='mt-date' value={instance.date} />
        </p>
        <p>Наработка, м/час:
          <input type='text' id='mt-time' value={instance.operating_time} />
        </p>
        <p>№ заказ-наряда:
          <input type='text' id='work-order-num' 
          value={instance.work_order_number} />
        </p>
        <p>Дата заказ-наряда:
          <input type='date' id='work-order-date' 
          value={instance.work_order_date} />
        </p>
        <p>Организация, проводившая ТО:
          <select>
            <option>{ instance.maintenance_holder.name }</option>
            { repairs.filter(item => (
            item.type === 'MTH' && item.name !== instance.type.name
            )).map(item => 
            <option key={item.pk}>{ item.name }</option>) }
          </select>
        </p>
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
        <p>Создание новой записи ТО</p>
        <p>Вид ТО:
          <select>
            { repairs.filter(item => (item.type === 'MNT'
            )).map(item => 
            <option key={item.pk}>{ item.name }</option>) }
          </select>
        </p>
        <p>Дата проведения ТО:
          <input type='date' id='mt-date' />
        </p>
        <p>Наработка, м/час:
          <input type='text' id='mt-time' />
        </p>
        <p>№ заказ-наряда:
          <input type='text' id='work-order-num' />
        </p>
        <p>Дата заказ-наряда:
          <input type='date' id='work-order-date' />
        </p>
        <p>Организация, проводившая ТО:
          <select>
            { repairs.filter(item => (item.type === 'MTH'
            )).map(item => 
            <option key={item.pk}>{ item.name }</option>) }
          </select>
        </p>
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
