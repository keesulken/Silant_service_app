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
                  <td data-label='Дата отказа'>{ item.rejection_date }</td>
                  <td data-label='Наработка м/час'>{ item.operating_time }</td>
                  <td data-label='Узел отказа'><Link to={'/repair/' + item.unit.pk }
                  >{ item.unit.name }</Link></td>
                  <td data-label='Описание отказа'>{ item.description }</td>
                  <td data-label='Способ восстановления'><Link to={'/repair/' + item.repair_method.pk }
                  >{ item.repair_method.name }</Link></td>
                  <td data-label='Используемые запасные части'>{ item.spare_parts }</td>
                  <td data-label='Дата восстановления'>{ item.recovery_date }</td>
                  <td data-label='Время простоя техники'>{ item.downtime }</td>
                  <td data-label='Машина'><Link to={'/machine/' + item.machine.pk }
                  >{ item.machine.factory_number }</Link></td>
                  <td data-label='Сервисная компания'><Link to={'/company/' + item.service_company.pk }
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
