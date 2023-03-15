import React, { useEffect } from 'react'

export default function AuthMaintenance(props) {
  let id = 'maintenance-table-elem';

  useEffect(()=>{
    try{
      document.getElementById(id).style.display = props.style;
    } catch (e) {
      if (e instanceof TypeError) {
      }
    };
  })

  if (props.maintenance) {
    return (
      <div id={id}>
        <table>
          <thead>
            <tr>
              <th>Вид ТО</th>
              <th>Дата проведения ТО</th>
              <th>Наработка, м/час</th>
              <th>№ заказ-наряда</th>
              <th>Дата заказ-наряда</th>
              <th>Организация, проводившая ТО</th>
              <th>Машина</th>
              <th>Сервисная компания</th>
            </tr>
          </thead>
          <tbody>
            { props.maintenance.map(item => (
              <tr key={item.id}>
                <td>{ item.type.name }</td>
                <td>{ item.date }</td>
                <td>{ item.operating_time }</td>
                <td>{ item.work_order_number }</td>
                <td>{ item.work_order_date }</td>
                <td>{ item.maintenance_holder.name }</td>
                <td>{ item.machine.factory_number }</td>
                <td>{ item.service_company.name }</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  } else {
    return (<div id={id}>No data</div>)
  }
}
