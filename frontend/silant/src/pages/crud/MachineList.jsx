import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DeleteBlock from './DeleteBlock';
import ErrorBlock from '../app/ErrorBlock';

export default function MachineList() {
  let [machines, setMachines] = useState();
  let [deleteBlock, setDeleteBlock] = useState();
  let [errorBlock, setErrorBlock] = useState();
  let navigate = useNavigate();


  useEffect(()=>{
    let url = 'http://127.0.0.1:8000/api/v1/machines';
    let options = {
      method: 'GET',
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
    };
    fetch(url, options).then(res => {
      if (res.status === 200) {
        return res.json();
      } else if (res.status === 403 ||
        res.status === 401) {
        throw new Error('403');
      } else {
        throw new Error('500');
      };
    }).then(result => setMachines(result))
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
  }, [])


  function updateHolder (id) {
    navigate(`/update/machine/${id}`)
  }


  function blockVoid () {
    setDeleteBlock();
  }


  function deleteHolder (id, instance, name) {
    let oldDeleteBlock = document.getElementById('delete-block');
    if (oldDeleteBlock) {
      blockVoid();
    };
    setDeleteBlock(<DeleteBlock id={id} instance={instance} name={name} void={blockVoid}/>);
  }


  function errorBlockVoid () {
    if (document.getElementById('error-block')) {
        setErrorBlock();
    };
  }


  if (!machines) {
    return <div>Данные не найдены</div>
  } else if (machines.length === 0) {
    return <div>По вашему запросу не найдено ни одной записи</div>
  } else {
    return (
      <div>
        <p>Обновление данных о технике</p>
        { errorBlock }
        { deleteBlock }
        <table>
          <thead>
            <tr>
              <th>Зав. № машины</th>
              <th>Модель техники</th>
              <th>Договор поставки №, дата</th>
              <th>Дата отгрузки с завода</th>
              <th>Грузополучатель (конечный потребитель)</th>
              <th>Адрес поставки (эксплуатации)</th>
              <th>Комплектация (доп. опции)</th>
              <th>Клиент</th>
              <th>Сервисная компания</th>
              <th>---</th>
              <th>---</th>
            </tr>
          </thead>
          <tbody>
            { machines.map(item => (
              <tr key={item.id}>
                <td><Link to={'/machine/' + item.id}
                >{ item.factory_number }</Link></td>
                <td><Link to={'/unit/' + item.machine_model.pk}
                >{ item.machine_model.name }</Link></td>
                <td>{ item.supply_contract_number_date }</td>
                <td>{ item.dispatch_date }</td>
                <td>{ item.consignee }</td>
                <td>{ item.delivery_address }</td>
                <td>{ item.equipment }</td>
                { item.client && <td><Link to={'/client/' + item.client.pk}
                >{ item.client.name }</Link></td> }
                { !item.client && <td>---</td> }
                { item.service_company && 
                <td><Link to={'/company/' + item.service_company.pk}
                >{ item.service_company.name }</Link></td> }
                { !item.service_company && <td>---</td> }
                <td><button onClick={(e) => updateHolder(item.id, e)}>Изменить</button></td>
                <td><button onClick={(e) => 
                deleteHolder(item.id, 'machine', 
                `${item.machine_model.name} №${item.factory_number}`, e)}
                >Удалить</button></td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
    )
  }
}
