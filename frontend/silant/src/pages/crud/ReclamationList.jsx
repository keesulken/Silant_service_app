import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DeleteBlock from './DeleteBlock';

export default function ReclamationList() {
  let [reclamation, setReclamation] = useState();
  let [deleteBlock, setDeleteBlock] = useState();
  let navigate = useNavigate();

  useEffect(()=>{
    let url = 'http://127.0.0.1:8000/api/v1/reclamations';
    let options = {
      method: 'GET',
      headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`,
      },
    };
    fetch(url, options).then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        console.log('error');
      };
    }).then(result => setReclamation(result))
    .catch(error => console.log(error.message));
  }, [])


  function updateHolder (id) {
    navigate(`/update/reclamation/${id}`)
  }


  function blockVoid () {
    setDeleteBlock();
  }


  function deleteHolder (id, instance, name) {
    let oldDeleteBlock = document.getElementById('delete-block');
    if (oldDeleteBlock) {
      blockVoid();
    };
    setDeleteBlock(<DeleteBlock id={id} instance={instance} name={name} void={blockVoid}/>);
  }


  if (!reclamation) {
    return <div>Данные не найдены</div>
  } else if (reclamation.length === 0) {
    return <div>По вашему запросу не найдено ни одной записи</div>
  } else {
    return (
      <div>
        <p>Обновление данных рекламаций</p>
        { deleteBlock }
        <table className='reclamation-update-table'>
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
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            { reclamation.map(item => (
              <tr key={item.id}>
                <td data-label='Дата отказа'>{ item.rejection_date }</td>
                <td data-label='Наработка м/час'>{ item.operating_time }</td>
                <td data-label='Узел отказа'><Link to={'/repair/' + item.unit.pk}
                >{ item.unit.name }</Link></td>
                <td data-label='Описание отказа'>{ item.description }</td>
                <td data-label='Способ восстановления'><Link to={'/repair/' + item.repair_method.pk}
                >{ item.repair_method.name }</Link></td>
                <td data-label='Используемые запасные части'>{ item.spare_parts }</td>
                <td data-label='Дата восстановления'>{ item.recovery_date }</td>
                <td data-label='Время простоя техники'>{ item.downtime }</td>
                <td data-label='Машина'><Link to={'/machine/' + item.machine.pk}
                >{ item.machine.factory_number }</Link></td>
                <td data-label='Сервисная компания'><Link to={'/company/' + item.service_company.pk}
                >{ item.service_company.name }</Link></td>
                <td data-label=' '><button onClick={(e) => updateHolder(item.id, e)}>Изменить</button></td>
                <td data-label=' '><button onClick={(e) => 
                deleteHolder(item.id, 'reclamation', 
                `${item.repair_method.name} ${item.unit.name} от ${item.rejection_date}`, e)}
                >Удалить</button></td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
    )
  }
}
