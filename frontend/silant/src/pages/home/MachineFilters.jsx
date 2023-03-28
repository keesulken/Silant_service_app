import React, { useEffect } from 'react';

export default function MachineFilters(props) {
  let id = 'machine-filters';

  useEffect(()=>{
    try{
      document.getElementById(id).style.display = props.style;
    } catch (e) {
      if (e instanceof TypeError) {
      }
    };
  })


  if (props.units) {
    return (
      <div id={id} className='filter-table'>
        <p>Фильтры</p>
        <form id={id + '-form'} encType="multipart/form-data"
        onSubmit={props.handler} >
          <table>
            <thead>
              <tr>
                <th>Модель техники</th>
                <th>Модель двигателя</th>
                <th>Модель трансмиссии</th>
                <th>Модель ведущего моста</th>
                <th>Модель управляемого моста</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <select name='mcn-filter'>
                    <option>-----</option>
                    { props.units.filter(item => item.type === 'MCN')
                      .map(item => (
                        <option key={item.pk}>{item.name}</option>
                      )) }
                  </select>
                </td>
                <td>
                  <select name='eng-filter'>
                    <option>-----</option>
                    { props.units.filter(item => item.type === 'ENG')
                      .map(item => (
                        <option key={item.pk}>{item.name}</option>
                      )) }
                  </select>
                </td>
                <td>
                  <select name='trm-filter'>
                    <option>-----</option>
                    { props.units.filter(item => item.type === 'TRM')
                      .map(item => (
                        <option key={item.pk}>{item.name}</option>
                      )) }
                  </select>
                </td>
                <td>
                  <select name='dra-filter'>
                    <option>-----</option>
                    { props.units.filter(item => item.type === 'DRA')
                      .map(item => (
                        <option key={item.pk}>{item.name}</option>
                      )) }
                  </select>
                </td>
                <td>
                  <select name='sta-filter'>
                    <option>-----</option>
                    { props.units.filter(item => item.type === 'STA')
                      .map(item => (
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
