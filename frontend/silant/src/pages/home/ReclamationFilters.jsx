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


  function filterHandler (e) {
    e.preventDefault();
    let data = new FormData(document.getElementById(id + '-form'));
    for (let [key, value] of data) {
      console.log(`${key} - ${value}`)
    }
  }


  if (props.repairs && props.companies) {
    return (
      <div id={id}>
        <p>Фильтры</p>
        <form id={id + '-form'} encType="multipart/form-data"
        onSubmit={filterHandler} >
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
                <td>
                  <select name='unt-filter'>
                    <option>-----</option>
                    { props.repairs.filter(item => item.type === 'UNT')
                      .map(item => (
                        <option key={item.pk}>{item.name}</option>
                      )) }
                  </select>
                </td>
                <td>
                  <select name='rpt-filter'>
                    <option>-----</option>
                    { props.repairs.filter(item => item.type === 'RPT')
                      .map(item => (
                        <option key={item.pk}>{item.name}</option>
                      )) }
                  </select>
                </td>
                <td>
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
            <input type='submit' value='Применить' />
            <input type='reset' value='Сброс' />
          </p>
        </form>
      </div>
    )
  } else {
    return <div>Нет данных</div>
  }
}
