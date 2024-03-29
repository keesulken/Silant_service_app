import React, { useEffect } from 'react';

export default function ReclamationFilters(props) {
  let id = 'reclamation-filters';

  useEffect(()=>{
    try{
      document.getElementById(id).style.display = props.style;
    } catch (e) {
      if (e instanceof TypeError) {
      }
    };
  })


  if (props.repairs && props.companies) {
    return (
      <div id={id} className='filter-table'>
        <p>Фильтры</p>
        <form id={id + '-form'} encType="multipart/form-data"
        onSubmit={props.handler} >
          <table>
            <thead>
              <tr>
                <th>Узел отказа</th>
                <th>Способ восстановления</th>
                <th>Сервисная компания</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-label='Узел отказа'>
                  <select name='unt-filter'>
                    <option>-----</option>
                    { props.repairs.filter(item => item.type === 'UNT')
                      .map(item => (
                        <option key={item.pk}>{item.name}</option>
                      )) }
                  </select>
                </td>
                <td data-label='Способ восстановления'>
                  <select name='rpt-filter'>
                    <option>-----</option>
                    { props.repairs.filter(item => item.type === 'RPT')
                      .map(item => (
                        <option key={item.pk}>{item.name}</option>
                      )) }
                  </select>
                </td>
                <td data-label='Сервисная компания'>
                  <select name='recl-sc-filter'>
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
