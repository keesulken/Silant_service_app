import React, { useState, useEffect } from 'react';
import AuthMachine from './AuthMachine';
import AuthMaintenance from './AuthMaintenance';
import AuthReclamation from './AuthReclamation';

export default function HomeAuth(props) {
    let token = localStorage.getItem('token');
    let user = props.user;
    let [machines, setMachines] = useState(null);
    let [maintenance, setMaintenance] = useState(null);
    let [reclamation, setReclamation] = useState(null);
    let [machinesStyle, setMachinesStyle] = useState('initial');
    let [maintenanceStyle, setMaintenanceStyle] = useState('none');
    let [reclamationStyle, setReclamationStyle] = useState('none');

    useEffect(()=>{
        let url = 'http://127.0.0.1:8000/api/v1/profile';
        let params = {
            username: user.username,
        };
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Token ${token}`,
            },
            body: JSON.stringify(params)
          };
          fetch(url, options).then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                console.log('error');
            };
          }).then(result => {
            setMachines(result['machines']);
            setMaintenance(result['maintenance']);
            setReclamation(result['reclamation']);
          }).catch(error => console.log(error.message));
    }, [])


    function handleClick(event) {
        if (event.target.id === 'machine-table') {
            setMachinesStyle('initial');
            setMaintenanceStyle('none');
            setReclamationStyle('none');
        } else if (event.target.id === 'maintenance-table') {
            setMachinesStyle('none');
            setMaintenanceStyle('initial');
            setReclamationStyle('none');
        } else {
            setMachinesStyle('none');
            setMaintenanceStyle('none');
            setReclamationStyle('initial');
        };
    }


  return (
    <div>
        { user.type === 'MNU' && <p>Клиент {user.username}</p>}
        { user.type === 'SVC' && <p>Сервисная организация {user.username}</p>}
        { user.type === 'MFR' && <p>Представитель производителя {user.username}</p>}
        <p>info about machines</p>
        <p>
            <button id='machine-table' onClick={handleClick}>main info</button>
            <button id='maintenance-table' onClick={handleClick}>maintenance</button>
            <button id='reclamation-table' onClick={handleClick}>reclamation</button>
        </p>
        <AuthMachine machines={machines} style={machinesStyle} />
        <AuthMaintenance maintenance={maintenance} style={maintenanceStyle} />
        <AuthReclamation reclamation={reclamation} style={reclamationStyle} />
    </div>
  )
}
