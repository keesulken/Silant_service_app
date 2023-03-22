import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Forbidden403 from './Forbidden403';
import NotFoundPage from './NotFoundPage';
import AuthMaintenance from './home/AuthMaintenance';
import AuthReclamation from './home/AuthReclamation';
import SingleMachine from './singleobjtables/SingleMachine';
import SingleObjTitle from './singleobjtables/SingleObjTitle';

export default function Machine(props) {
  let token = localStorage.getItem('token');
  let { id } = useParams();
  let [machine, setMachine] = useState(null);
  let [maintenance, setMaintenance] = useState(null);
  let [reclamation, setReclamation] = useState(null);
  let [machineStyle, setMachineStyle] = useState('initial');
  let [maintenanceStyle, setMaintenanceStyle] = useState('none');
  let [reclamationStyle, setReclamationStyle] = useState('none');

  useEffect(()=>{
    let url = 'http://127.0.0.1:8000/api/v1/machine/' + id;
    let options = {
      headers: {
        'Authorization': `Token ${token}`,
      },
    };
    fetch(url, options).then(res => {
      if (res.status === 200) {
        return res.json();
      } else if (res.status === 404) {
        setMachine(404);
      } else {
        console.log('error');
      };
    }).then(result => {
      setMachine(result['machine']);
      setMaintenance(result['maintenance']);
      setReclamation(result['reclamation']);
    }).catch(error => console.log(error.message));
  }, [])


  function handleClick(event) {
    if (event.target.id === 'machine-table') {
        setMachineStyle('initial');
        setMaintenanceStyle('none');
        setReclamationStyle('none');
    } else if (event.target.id === 'maintenance-table') {
        setMachineStyle('none');
        setMaintenanceStyle('initial');
        setReclamationStyle('none');
    } else {
        setMachineStyle('none');
        setMaintenanceStyle('none');
        setReclamationStyle('initial');
    };
}

  if (!props.user) {
    return <Forbidden403 />
  } else if (machine === 404) {
    return <NotFoundPage />
  } else {
    return (
      <div>
        <SingleObjTitle machine={machine} />
        <p>Информация о вашей технике</p>
        <p>
            <button id='machine-table' onClick={handleClick}>Общая инфо</button>
            <button id='maintenance-table' onClick={handleClick}>ТО</button>
            <button id='reclamation-table' onClick={handleClick}>Рекламации</button>
        </p>
        <SingleMachine machine={machine} style={machineStyle} />
        <AuthMaintenance maintenance={maintenance} style={maintenanceStyle} />
        <AuthReclamation reclamation={reclamation} style={reclamationStyle} />
      </div>
    )
  }
}
