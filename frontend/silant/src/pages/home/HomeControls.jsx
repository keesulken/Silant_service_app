import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomeControls(props) {
    const navigate = useNavigate();

    function create (instance) {
        navigate(`/create/${instance}`);
    }

    function update (instance) {
        navigate(`/update/${instance}`);
    }

  return (
    <div>
        { props.user.type === 'MNU' && <p>Создать новую запись: 
            <button onClick={(e) => create('maintenance', e)}>Тех. обслуживание</button></p>}
        { props.user.type === 'SVC' && <p>Создать новую запись: 
            <button onClick={(e) => create('maintenance', e)}>Тех. обслуживание</button>
            <button onClick={(e) => create('reclamation', e)}>Рекламация</button></p>}
        { props.user.type === 'MFR' && 
        <>
        <p>Создать запись: 
            <button onClick={(e) => create('machine', e)}>Машина</button>
            <button onClick={(e) => create('maintenance', e)}>Тех. обслуживание</button>
            <button onClick={(e) => create('reclamation', e)}>Рекламация</button>
        </p>
        <p>Редактировать запись: 
            <button onClick={(e) => update('machine', e)}>Машина</button>
            <button onClick={(e) => update('maintenance', e)}>Тех. обслуживание</button>
            <button onClick={(e) => update('reclamation', e)}>Рекламация</button>
        </p>
        <p>Управление справочниками: 
            <button onClick={(e) => create('directory', e)}>Создать запись</button>
            <button onClick={(e) => update('directory', e)}>Редактировать записи</button>
            <button onClick={(e) => update('profile', e)}>Редактировать профили</button>
        </p>
        </>}
    </div>
  )
}
