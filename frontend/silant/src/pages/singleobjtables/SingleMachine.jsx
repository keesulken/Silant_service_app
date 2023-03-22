import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function SingleMachine(props) {
    let id = 'machine-table-elem';
    let item = props.machine;
  
    useEffect(()=>{
      try{
        document.getElementById(id).style.display = props.style;
      } catch (e) {
        if (e instanceof TypeError) {
        }
      };
    })
  
  
    if (props.machine) {
      return (
        <div id={id}>
          <table>
            <thead>
              <tr>
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
                <tr>
                    <td><Link to={'/unit/' + item.machine_model.pk}
                    >{ item.machine_model.name }</Link></td>
                    <td><Link to={'/unit/' + item.engine_model.pk}
                    >{ item.engine_model.name }</Link></td>
                    <td>{ item.engine_number }</td>
                    <td><Link to={'/unit/' + item.transmission_model.pk}
                    >{ item.transmission_model.name }</Link></td>
                    <td>{ item.transmission_number }</td>
                    <td><Link to={'/unit/' + item.drive_axle_model.pk}
                    >{ item.drive_axle_model.name }</Link></td>
                    <td>{ item.drive_axle_number }</td>
                    <td><Link to={'/unit/' + item.steered_axle_model.pk}
                    >{ item.steered_axle_model.name }</Link></td>
                    <td>{ item.steered_axle_number }</td>
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
                </tr>
            </tbody>
          </table>
        </div>
      )
    } else {
      return (<div id={id}>Запись не существует</div>)
    }
}
