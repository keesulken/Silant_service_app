import React, { useEffect } from 'react'

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
                  <td>{ item.factory_number }</td>
                  <td>{ item.machine_model.name }</td>
                  <td>{ item.engine_model.name }</td>
                  <td>{ item.engine_number }</td>
                  <td>{ item.transmission_model.name }</td>
                  <td>{ item.transmission_number }</td>
                  <td>{ item.drive_axle_model.name }</td>
                  <td>{ item.drive_axle_number }</td>
                  <td>{ item.steered_axle_model.name }</td>
                  <td>{ item.steered_axle_number }</td>
                  <td>{ item.supply_contract_number_date }</td>
                  <td>{ item.dispatch_date }</td>
                  <td>{ item.consignee }</td>
                  <td>{ item.delivery_address }</td>
                  <td>{ item.equipment }</td>
                  <td>{ item.client.name }</td>
                  <td>{ item.service_company.name }</td>
                </tr>
              )) }
          </tbody>
        </table>
      </div>
    )
  } else {
    return (<div id={id}>No data</div>)
  }
}
