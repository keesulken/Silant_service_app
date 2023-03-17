import React, { useState, useEffect } from 'react';
import NotFoundPage from '../NotFoundPage';

export default function DirectoryForm(props) {
  let [instance, setInstance] = useState(null);
  let units = [
    'Модель техники',
    'Модель двигателя',
    'Модель трансмиссии',
    'Модель ведущего моста',
    'Модель управляемого моста',
  ];
  let repairs = [
    'Вид ТО',
    'Способ восстановления',
    'Узел отказа',
    'Организация, проводившая ТО',
  ];

  useEffect(()=>{
    if (props.id) {
      let url = `http://127.0.0.1:8000/api/v1/${props.type}/${props.id}`;
      fetch(url).then(res => {
        if (res.status === 200) {
          return res.json();
        } else if (res.status === 404) {
          setInstance(404);
        } else {
          console.log('error');
        };
      }).then(result => setInstance(result))
      .catch(error => console.log(error.message));
    };
  }, [])


  useEffect(()=>{
    if (document.querySelector('form')) {
      document.getElementById('unit-radio').checked = true;
      document.getElementById('unit-type').style.display = 'initial';
      document.getElementById('repair-type').style.display = 'none';
    }
  }, [])


  function changeHandler () {
    let unit = document.getElementById('unit-type');
    let repair = document.getElementById('repair-type');
    if (unit.style.display === 'initial') {
      unit.style.display = 'none';
      repair.style.display = 'initial';
    } else {
      unit.style.display = 'initial';
      repair.style.display = 'none';
    };
  }


  if (instance === 404) {
    return <NotFoundPage />
  } else if (instance && instance !== 404) {
    return (
    <form>
      <p>Редактирование справочника</p>
      { props.type === 'unit' && <p>Справочник агрегатов</p> }
      { props.type === 'repair' && <p>Справочник по обслуживанию</p> }
      <p>Тип справочника:
        <select>
          { props.type === 'unit' && units.map((unit, index) => (
            <option key={index}>{ unit }</option>
          )) }
          { props.type === 'repair' && repairs.map((repair, index) => (
            <option key={index}>{ repair }</option>
          )) }
        </select>
      </p>
      <p>Название: 
        <input type='text' id='name' value={instance.name}></input>
      </p>
      <p>Описание: 
        <input type='text' id='description' value={instance.description}></input>
      </p>
    </form>
    )
  } else {
    return (
    <form>
      <p>Создание нового справочника</p>
      <p>Назначение:
        <label>
          <input type='radio' name='dir-type' id='unit-radio' 
          onChange={changeHandler} />
          Справочник агрегатов
        </label>
        <label>
          <input type='radio' name='dir-type' id='repair-radio'
          onChange={changeHandler} />
          Справочник по обслуживанию
        </label>
      </p>
      <p id='unit-type'>Тип справочника: 
        <select>
          { units.map((item, index) => (
            <option key={index}>{ item }</option>
          )) }
        </select>
      </p>
      <p id='repair-type'>Тип справочника: 
        <select>
          { repairs.map((item, index) => (
            <option key={index}>{ item }</option>
          )) }
        </select>
      </p>
      <p>Название: 
        <input type='text' id='name'></input>
      </p>
      <p>Описание: 
        <input type='text' id='description'></input>
      </p>
      <p>
        <input type='submit' value='Отправить'></input>
        <input type='reset' value='Сброс'></input>
      </p>
    </form>
    )
  }
}
