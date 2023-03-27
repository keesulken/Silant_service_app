import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

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
    if (props.reclamation.length > 0) {
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
                  <td><Link to={'/repair/' + item.unit.pk }
                  >{ item.unit.name }</Link></td>
                  <td>{ item.description }</td>
                  <td><Link to={'/repair/' + item.repair_method.pk }
                  >{ item.repair_method.name }</Link></td>
                  <td>{ item.spare_parts }</td>
                  <td>{ item.recovery_date }</td>
                  <td>{ item.downtime }</td>
                  <td><Link to={'/machine/' + item.machine.pk }
                  >{ item.machine.factory_number }</Link></td>
                  <td><Link to={'/company/' + item.service_company.pk }
                  >{ item.service_company.name }</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    } else {
      return <div>По вашему запросу ничего не найдено</div>
    }
  } else {
    return (<div id={id}>Рекламации по данной технике отсутствуют</div>)
  }
}
