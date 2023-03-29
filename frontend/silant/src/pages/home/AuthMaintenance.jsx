import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

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
    if (props.maintenance.length > 0) {
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
                  <td data-label='Вид ТО'><Link to={'/repair/' + item.type.pk }
                  >{ item.type.name }</Link></td>
                  <td data-label='Дата проведения ТО'>{ item.date }</td>
                  <td data-label='Наработка, м/час'>{ item.operating_time }</td>
                  <td data-label='№ заказ-наряда'>{ item.work_order_number }</td>
                  <td data-label='Дата заказ-наряда'>{ item.work_order_date }</td>
                  <td data-label='Организация, проводившая ТО'
                  ><Link to={'/repair/' + item.maintenance_holder.pk }
                  >{ item.maintenance_holder.name }</Link></td>
                  <td data-label='Машина'><Link to={'/machine/' + item.machine.pk }
                  >{ item.machine.factory_number }</Link></td>
                  <td data-label='Сервисная компания'
                  ><Link to={'/company/' + item.service_company.pk }
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
    return (<div id={id}>ТО ещё не проводилось</div>)
  }
}
