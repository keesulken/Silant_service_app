import React, { useEffect } from 'react';

export default function MaintenanceFilters(props) {
  let id = 'maintenance-filters';

  useEffect(()=>{
    try{
      document.getElementById(id).style.display = props.style;
    } catch (e) {
      if (e instanceof TypeError) {
      }
    };
  })


  if (props.repairs && props.machines && props.companies) {
    return (
      <div id={id} className='filter-table'>
        <p>Фильтры</p>
        <form id={id + '-form'} encType="multipart/form-data"
        onSubmit={props.handler} >
          <table>
            <thead>
              <tr>
                <th>Вид ТО</th>
                <th>Зав. № машины</th>
                <th>Сервисная компания</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <select name='mnt-filter'>
                    <option>-----</option>
                    { props.repairs.filter(item => item.type === 'MNT')
                      .map(item => (
                        <option key={item.pk}>{item.name}</option>
                      )) }
                  </select>
                </td>
                <td>
                  <select name='mt-machine-filter'>
                    <option>-----</option>
                    { props.machines.map(item => (
                        <option key={item.id}>{item.factory_number}</option>
                      )) }
                  </select>
                </td>
                <td>
                  <select name='mt-sc-filter'>
                    <option>-----</option>
                    { props.companies.map(item => (
                        <option key={item.pk}>{item.name}</option>
                      )) }
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            <input type='submit' value='Применить' className='form-button' />
            <input type='reset' value='Сброс' className='form-button' />
          </p>
        </form>
      </div>
      )
  } else {
    return <div>Нет данных</div>
  }
}
