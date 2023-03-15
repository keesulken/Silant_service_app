import React, { useEffect } from 'react'

export default function AuthReclamation(props) {
  let id = 'reclamation-table-elem';

  useEffect(()=>{
    try{
      document.getElementById(id).style.display = props.style;
    } catch (e) {
      if (e instanceof TypeError) {
      }
    };
  })

  if (props.reclamation) {
    return(
      <div id={id}>
        <table>
          <thead>
            <tr>
              <th>Дата отказа</th>
              <th>Наработка м/час</th>
              <th>Узел отказа</th>
              <th>Описание отказа</th>
              <th>Способ восстановления</th>
              <th>Используемые запасные части</th>
              <th>Дата восстановления</th>
              <th>Время простоя техники</th>
              <th>Машина</th>
              <th>Сервисная компания</th>
            </tr>
          </thead>
          <tbody>
            { props.reclamation.map(item => (
              <tr key={item.id}>
                <td>{ item.rejection_date }</td>
                <td>{ item.operating_time }</td>
                <td>{ item.unit.name }</td>
                <td>{ item.description }</td>
                <td>{ item.repair_method.name }</td>
                <td>{ item.spare_parts }</td>
                <td>{ item.recovery_date }</td>
                <td>{ item.downtime }</td>
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
