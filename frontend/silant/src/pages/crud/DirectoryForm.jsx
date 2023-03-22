import React, { useState, useEffect } from 'react';
import NotFoundPage from '../NotFoundPage';
import { useNavigate } from 'react-router-dom';

export default function DirectoryForm(props) {
  let [instance, setInstance] = useState();
  let navigate = useNavigate();
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
      if (!instance) {
        document.getElementById('unit-type').style.display = 'initial';
        document.getElementById('repair-type').style.display = 'none';
        document.getElementById('unit-radio').checked = true;
      }
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


  function dataLoader () {
    if (document.querySelector('form') 
    && instance
    && instance !== 404) {
      document.getElementById('name').value = instance.name;
      document.getElementById('description').value = instance.description;
    };
  }


  useEffect(dataLoader)


  function sendForm (e) {
    e.preventDefault();
    let errors = [];
    let data = new FormData(document.querySelector('form'));
    data.delete('dir-type');
    if (!instance) {
      if (document.getElementById('unit-radio').checked) {
        data.delete('repair');
      } else {
        data.delete('unit');
      };
    };
    for (let [key, value] of data) {
      if (value === '') {
        errors.push('All fields required');
        break;
      };
    };
    console.log(errors);
    if (errors.length !== 0) {
      console.log('error');
    } else {
      if (instance && props.type === 'unit') {
        let url = 'http://127.0.0.1:8000/api/v1/unit/' + instance.id;
        let options = {
          method: 'PATCH',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
          body: data,
        };
        fetch(url, options).then(res => {
          if (res.status === 204) {
            navigate('/unit/' + instance.id);
          } else {
            console.log('error');
          };
        }).catch(error => console.log(error.message));
      } else if (instance && props.type === 'repair') {
        let url = 'http://127.0.0.1:8000/api/v1/repair/' + instance.id;
        let options = {
          method: 'PATCH',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
          body: data,
        };
        fetch(url, options).then(res => {
          if (res.status === 204) {
            navigate('/repair/' + instance.id);
          } else {
            console.log('error');
          };
        }).catch(error => console.log(error.message));
      } else if (!instance && data.has('unit')) {
        let url = 'http://127.0.0.1:8000/api/v1/units';
        let options = {
          method: 'POST',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
          body: data,
        };
        fetch(url, options).then(res => {
          if (res.status === 201) {
            return res.json();
          } else {
            console.log('error');
          };
        }).then(result => navigate('/unit/' + result.id))
        .catch(error => console.log(error.message));
      } else {
        let url = 'http://127.0.0.1:8000/api/v1/repairs';
        let options = {
          method: 'POST',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
          body: data,
        };
        fetch(url, options).then(res => {
          if (res.status === 201) {
            return res.json();
          } else {
            console.log('error');
          };
        }).then(result => navigate('/repair/' + result.id))
        .catch(error => console.log(error.message));
      };
    };
  }


  if (instance === 404) {
    return <NotFoundPage />
  } else if (instance && instance !== 404) {
    return (
    <form onSubmit={sendForm} encType="multipart/form-data">
      <p>Редактирование справочника</p>
      { props.type === 'unit' && <p>Справочник агрегатов</p> }
      { props.type === 'repair' && <p>Справочник по обслуживанию</p> }
      <p id='p-dir-type' style={{display: 'block'}}>Тип справочника:
        <select name='type'>
          { props.type === 'unit' && units.map((unit, index) => (
            <option key={index}>{ unit }</option>
          )) }
          { props.type === 'repair' && repairs.map((repair, index) => (
            <option key={index}>{ repair }</option>
          )) }
        </select>
      </p>
      <p>Название: 
        <input type='text' name='name' id='name' ></input>
      </p>
      <p>Описание: 
        <input type='text' name='description' id='description' ></input>
      </p>
      <p>
        <input type='submit' value='Отправить' />
        <input type='reset' value='Сброс' onMouseLeave={dataLoader} />
      </p>
    </form>
    )
  } else {
    return (
    <form onSubmit={sendForm} encType="multipart/form-data">
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
        <select name='unit'>
          { units.map((item, index) => (
            <option key={index}>{ item }</option>
          )) }
        </select>
      </p>
      <p id='repair-type'>Тип справочника: 
        <select name='repair'>
          { repairs.map((item, index) => (
            <option key={index}>{ item }</option>
          )) }
        </select>
      </p>
      <p>Название: 
        <input type='text' name='name' id='name'></input>
      </p>
      <p>Описание: 
        <input type='text' name='description' id='description'></input>
      </p>
      <p>
        <input type='submit' value='Отправить' />
        <input type='reset' value='Сброс' />
      </p>
    </form>
    )
  }
}
