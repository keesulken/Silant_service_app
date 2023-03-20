import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function MaintenanceList() {
  let [maintenance, setMaintenance] = useState();
  let navigate = useNavigate();

  useEffect(()=>{
    let url = 'http://127.0.0.1:8000/api/v1/maintenances';
    fetch(url).then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        console.log('error');
      };
    }).then(result => setMaintenance(result))
    .catch(error => console.log(error.message));
  }, [])


  function updateHolder (id) {
    navigate(`/update/maintenance/${id}`)
  }

  if (!maintenance) {
    return <div>No data</div>
  } else {
    return (
      <div>
        <p>Обновление данных о ТО</p>
        <table>
          <thead>
            <tr>
              <th>Вид ТО</th>
              <th>Дата проведения ТО</th>
              <th>Наработка м/час</th>
              <th>№ заказ-наряда</th>
              <th>Дата заказ-наряда</th>
              <th>Организация, проводившая ТО</th>
              <th>Машина</th>
              <th>Сервисная компания</th>
              <th>---</th>
              <th>---</th>
            </tr>
          </thead>
          <tbody>
            { maintenance.map(item => (
              <tr key={item.id}>
                <td><Link to={'/repair/' + item.type.pk}
                >{ item.type.name }</Link></td>
                <td>{ item.date }</td>
                <td>{ item.operating_time }</td>
                <td>{ item.work_order_number }</td>
                <td>{ item.work_order_date }</td>
                <td><Link to={'/repair/' + item.maintenance_holder.pk}
                >{ item.maintenance_holder.name }</Link></td>
                <td><Link to={'/machine/' + item.machine.pk}
                >{ item.machine.factory_number }</Link></td>
                <td><Link to={'/company/' + item.service_company.pk}
                >{ item.service_company.name }</Link></td>
                <td><button onClick={(e) => updateHolder(item.id, e)}>Изменить</button></td>
                <td><button>Удалить</button></td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
    )
  }
}
