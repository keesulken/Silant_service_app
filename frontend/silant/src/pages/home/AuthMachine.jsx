import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AuthMachine(props) {
  let id = 'machine-table-elem';
  
  useEffect(()=>{
    try{
      document.getElementById(id).style.display = props.style;
    } catch (e) {
      if (e instanceof TypeError) {
      }
    };
  })


  if (props.machines) {
    if (props.machines.length > 0) {
      return (
        <div id={id}>
          <table>
            <thead>
              <tr>
                <th>Зав. № машины</th>
                <th>Модель техники</th>
                <th>Модель двигателя</th>
                <th>Зав. № двигателя</th>
                <th>Модель трансмиссии</th>
                <th>Зав. № трансмиссии</th>
                <th>Модель ведущего моста</th>
                <th>Зав. № ведущего моста</th>
                <th>Модель управляемого моста</th>
                <th>Зав. № управляемого моста</th>
                <th>Договор поставки №, дата</th>
                <th>Дата отгрузки с завода</th>
                <th>Грузополучатель (конечный потребитель)</th>
                <th>Адрес поставки (эксплуатации)</th>
                <th>Комплектация (доп. опции)</th>
                <th>Клиент</th>
                <th>Сервисная компания</th>
              </tr>
            </thead>
            <tbody>
                { props.machines.map(item => (
                  <tr key={item.id}>
                    <td data-label='Зав. № машины'>
                      <Link to={'/machine/' + item.id}
                    >{ item.factory_number }</Link></td>
                    <td data-label='Модель техники'>
                      <Link to={'/unit/' + item.machine_model.pk}
                    >{ item.machine_model.name }</Link></td>
                    <td data-label='Модель двигателя'>
                      <Link to={'/unit/' + item.engine_model.pk}
                    >{ item.engine_model.name }</Link></td>
                    <td data-label='Зав. № двигателя'>{ item.engine_number }</td>
                    <td data-label='Модель трансмиссии'>
                      <Link to={'/unit/' + item.transmission_model.pk}
                    >{ item.transmission_model.name }</Link></td>
                    <td data-label='Зав. № трансмиссии'>{ item.transmission_number }</td>
                    <td data-label='Модель ведущего моста'>
                      <Link to={'/unit/' + item.drive_axle_model.pk}
                    >{ item.drive_axle_model.name }</Link></td>
                    <td data-label='Зав. № ведущего моста'>{ item.drive_axle_number }</td>
                    <td data-label='Модель управляемого моста'>
                      <Link to={'/unit/' + item.steered_axle_model.pk}
                    >{ item.steered_axle_model.name }</Link></td>
                    <td data-label='Зав. № управляемого моста'>{ item.steered_axle_number }</td>
                    <td data-label='Договор поставки №, дата'
                    >{ item.supply_contract_number_date }</td>
                    <td data-label='Дата отгрузки с завода'>{ item.dispatch_date }</td>
                    <td data-label='Грузополучатель (конечный потребитель)'>{ item.consignee }</td>
                    <td data-label='Адрес поставки (эксплуатации)'>{ item.delivery_address }</td>
                    <td data-label='Комплектация (доп. опции)'>{ item.equipment }</td>
                    { item.client && <td data-label='Клиент'><Link to={'/client/' + item.client.pk}
                    >{ item.client.name }</Link></td> }
                    { !item.client && <td data-label='Клиент'>---</td> }
                    { item.service_company && 
                    <td data-label='Сервисная компания'><Link to={'/company/' + item.service_company.pk}
                    >{ item.service_company.name }</Link></td> }
                    { !item.service_company && <td data-label='Сервисная компания'>---</td> }
                  </tr>
                )) }
            </tbody>
          </table>
        </div>
      )
    } else {
      return <div>По вашему запросу ничего не найдено</div>
    }
  } else {
    return (<div id={id}>Нет данных</div>)
  }
}
