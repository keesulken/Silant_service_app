import React, { useState, useEffect } from 'react';
import AuthMachine from './AuthMachine';
import AuthMaintenance from './AuthMaintenance';
import AuthReclamation from './AuthReclamation';
import HomeControls from './HomeControls';
import MachineFilters from './MachineFilters';
import MaintenanceFilters from './MaintenanceFilters';
import ReclamationFilters from './ReclamationFilters';
import ErrorBlock from '../app/ErrorBlock';

export default function HomeAuth(props) {
    let token = localStorage.getItem('token');
    let user = props.user;
    let [machines, setMachines] = useState();
    let [maintenance, setMaintenance] = useState();
    let [reclamation, setReclamation] = useState();
    let [units, setUnits] = useState();
    let [machineFilters, setMachineFilters] = useState();
    let [repairs, setRepairs] = useState();
    let [companies, setCompanies] = useState();
    let [machinesStyle, setMachinesStyle] = useState('initial');
    let [maintenanceStyle, setMaintenanceStyle] = useState('none');
    let [reclamationStyle, setReclamationStyle] = useState('none');
    let [errorBlock, setErrorBlock] = useState();

    useEffect(()=>{
        let url = 'http://127.0.0.1:8000/api/v1/profile';
        let options = {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
            },
          };
          fetch(url, options).then(res => {
            if (res.status === 200) {
                errorBlockVoid();
                return res.json();
            } else if (res.status === 404) {
                throw new Error('404');
            } else if (res.status === 403) {
                throw new Error('403');
            } else {
                throw new Error('500');
            };
          }).then(result => {
            setMachines(result['machines']);
            setMaintenance(result['maintenance']);
            setReclamation(result['reclamation']);
            setUnits(result['units']);
            setMachineFilters(result['machines']);
            setRepairs(result['repairs']);
            setCompanies(result['companies']);
          }).catch(error => {
            if (error.message === '404') {
                errorBlockVoid();
                let block = <ErrorBlock error={'Такой страницы не существует'} />;
                setErrorBlock(block);
            } else if (error.message === '403') {
                errorBlockVoid();
                let block = <ErrorBlock error={'Недостаточно прав'} />;
                setErrorBlock(block);
            } else if (error.message === '500' ||
            error.name === 'TypeError') {
                errorBlockVoid();
                let block = <ErrorBlock error={'Неизвестная ошибка, попробуйте позже'} />;
                setErrorBlock(block);
            };
          });
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


    function machineFilterHandler (e) {
        e.preventDefault();
        let id = 'machine-filters-form';
        let nullList = [];
        let data = new FormData(document.getElementById(id));
        for (let [key, value] of data) {
            if (value === '-----') {
                nullList.push(key);
            };
        };
        for (let i of nullList) {
            data.delete(i);
        };
        if (nullList.length > 4) {
            let url = 'http://127.0.0.1:8000/api/v1/filtered/machine';
            let options = {
                method: 'GET',
                headers: {
                  'Authorization': `Token ${localStorage.getItem('token')}`,
                },
              };
            fetch(url, options).then(res => {
                if (res.status === 200) {
                    errorBlockVoid();
                    return res.json();
                } else if (res.status === 404) {
                    throw new Error('404');
                } else if (res.status === 403) {
                    throw new Error('403');
                } else {
                    throw new Error('500');
                };
            }).then(result => setMachines(result))
            .catch(error => {
                if (error.message === '404') {
                    errorBlockVoid();
                    let block = <ErrorBlock error={'Такой страницы не существует'} />;
                    setErrorBlock(block);
                } else if (error.message === '403') {
                    errorBlockVoid();
                    let block = <ErrorBlock error={'Недостаточно прав'} />;
                    setErrorBlock(block);
                } else if (error.message === '500' ||
                error.name === 'TypeError') {
                    errorBlockVoid();
                    let block = <ErrorBlock error={'Неизвестная ошибка, попробуйте позже'} />;
                    setErrorBlock(block);
                };
            });
        } else {
            let url = 'http://127.0.0.1:8000/api/v1/filtered/machine';
            let options = {
                method: 'POST',
                headers: {
                  'Authorization': `Token ${localStorage.getItem('token')}`,
                },
                body: data,
              };
            fetch(url, options).then(res => {
                if (res.status === 200) {
                    errorBlockVoid();
                    return res.json();
                } else if (res.status === 404) {
                    throw new Error('404');
                } else if (res.status === 403) {
                    throw new Error('403');
                } else {
                    throw new Error('500');
                };
            }).then(result => setMachines(result))
            .catch(error => {
                if (error.message === '404') {
                    errorBlockVoid();
                    let block = <ErrorBlock error={'Такой страницы не существует'} />;
                    setErrorBlock(block);
                } else if (error.message === '403') {
                    errorBlockVoid();
                    let block = <ErrorBlock error={'Недостаточно прав'} />;
                    setErrorBlock(block);
                } else if (error.message === '500' ||
                error.name === 'TypeError') {
                    errorBlockVoid();
                    let block = <ErrorBlock error={'Неизвестная ошибка, попробуйте позже'} />;
                    setErrorBlock(block);
                };
            });
        };
    }


    function maintenanceFilterHandler (e) {
        e.preventDefault();
        let id = 'maintenance-filters-form';
        let nullList = [];
        let data = new FormData(document.getElementById(id));
        for (let [key, value] of data) {
            if (value === '-----') {
                nullList.push(key);
            };
        };
        for (let i of nullList) {
            data.delete(i);
        };
        if (nullList.length > 2) {
            let url = 'http://127.0.0.1:8000/api/v1/filtered/maintenance';
            let options = {
                method: 'GET',
                headers: {
                  'Authorization': `Token ${localStorage.getItem('token')}`,
                },
              };
            fetch(url, options).then(res => {
                if (res.status === 200) {
                    errorBlockVoid();
                    return res.json();
                } else if (res.status === 404) {
                    throw new Error('404');
                } else if (res.status === 403) {
                    throw new Error('403');
                } else {
                    throw new Error('500');
                };
            }).then(result => setMaintenance(result))
            .catch(error => {
                if (error.message === '404') {
                    errorBlockVoid();
                    let block = <ErrorBlock error={'Такой страницы не существует'} />;
                    setErrorBlock(block);
                } else if (error.message === '403') {
                    errorBlockVoid();
                    let block = <ErrorBlock error={'Недостаточно прав'} />;
                    setErrorBlock(block);
                } else if (error.message === '500' ||
                error.name === 'TypeError') {
                    errorBlockVoid();
                    let block = <ErrorBlock error={'Неизвестная ошибка, попробуйте позже'} />;
                    setErrorBlock(block);
                };
            });
        } else {
            let url = 'http://127.0.0.1:8000/api/v1/filtered/maintenance';
            let options = {
                method: 'POST',
                headers: {
                  'Authorization': `Token ${localStorage.getItem('token')}`,
                },
                body: data,
              };
            fetch(url, options).then(res => {
                if (res.status === 200) {
                    errorBlockVoid();
                    return res.json();
                } else if (res.status === 404) {
                    throw new Error('404');
                } else if (res.status === 403) {
                    throw new Error('403');
                } else {
                    throw new Error('500');
                };
            }).then(result => setMaintenance(result))
            .catch(error => {
                if (error.message === '404') {
                    errorBlockVoid();
                    let block = <ErrorBlock error={'Такой страницы не существует'} />;
                    setErrorBlock(block);
                } else if (error.message === '403') {
                    errorBlockVoid();
                    let block = <ErrorBlock error={'Недостаточно прав'} />;
                    setErrorBlock(block);
                } else if (error.message === '500' ||
                error.name === 'TypeError') {
                    errorBlockVoid();
                    let block = <ErrorBlock error={'Неизвестная ошибка, попробуйте позже'} />;
                    setErrorBlock(block);
                };
            });
        };
    }


    function reclamationFilterHandler (e) {
        e.preventDefault();
        let id = 'reclamation-filters-form';
        let nullList = [];
        let data = new FormData(document.getElementById(id));
        for (let [key, value] of data) {
            if (value === '-----') {
                nullList.push(key);
            };
        };
        for (let i of nullList) {
            data.delete(i);
        };
        if (nullList.length > 2) {
            let url = 'http://127.0.0.1:8000/api/v1/filtered/reclamation';
            let options = {
                method: 'GET',
                headers: {
                  'Authorization': `Token ${localStorage.getItem('token')}`,
                },
              };
            fetch(url, options).then(res => {
                if (res.status === 200) {
                    errorBlockVoid();
                    return res.json();
                } else if (res.status === 404) {
                    throw new Error('404');
                } else if (res.status === 403) {
                    throw new Error('403');
                } else {
                    throw new Error('500');
                };
            }).then(result => setReclamation(result))
            .catch(error => {
                if (error.message === '404') {
                    errorBlockVoid();
                    let block = <ErrorBlock error={'Такой страницы не существует'} />;
                    setErrorBlock(block);
                } else if (error.message === '403') {
                    errorBlockVoid();
                    let block = <ErrorBlock error={'Недостаточно прав'} />;
                    setErrorBlock(block);
                } else if (error.message === '500' ||
                error.name === 'TypeError') {
                    errorBlockVoid();
                    let block = <ErrorBlock error={'Неизвестная ошибка, попробуйте позже'} />;
                    setErrorBlock(block);
                };
            });
        } else {
            let url = 'http://127.0.0.1:8000/api/v1/filtered/reclamation';
            let options = {
                method: 'POST',
                headers: {
                  'Authorization': `Token ${localStorage.getItem('token')}`,
                },
                body: data,
              };
            fetch(url, options).then(res => {
                if (res.status === 200) {
                    errorBlockVoid();
                    return res.json();
                } else if (res.status === 404) {
                    throw new Error('404');
                } else if (res.status === 403) {
                    throw new Error('403');
                } else {
                    throw new Error('500');
                };
            }).then(result => setReclamation(result))
            .catch(error => {
                if (error.message === '404') {
                    errorBlockVoid();
                    let block = <ErrorBlock error={'Такой страницы не существует'} />;
                    setErrorBlock(block);
                } else if (error.message === '403') {
                    errorBlockVoid();
                    let block = <ErrorBlock error={'Недостаточно прав'} />;
                    setErrorBlock(block);
                } else if (error.message === '500' ||
                error.name === 'TypeError') {
                    errorBlockVoid();
                    let block = <ErrorBlock error={'Неизвестная ошибка, попробуйте позже'} />;
                    setErrorBlock(block);
                };
            });
        };
    }


    function errorBlockVoid () {
        if (document.getElementById('error-block')) {
            setErrorBlock();
        };
    }


  return (
    <div>
        { user.type === 'MNU' && <p>Клиент {user.username}</p>}
        { user.type === 'SVC' && <p>Сервисная организация {user.username}</p>}
        { user.type === 'MFR' && <p>Представитель производителя {user.username}</p>}
        <p>Информация о комплектации и технических характеристиках Вашей техники</p>
        <p>
            <button id='machine-table' onClick={handleClick}>Общая инфо</button>
            <button id='maintenance-table' onClick={handleClick}>ТО</button>
            <button id='reclamation-table' onClick={handleClick}>Рекламации</button>
        </p>
        <hr />
        { errorBlock }
        <MachineFilters units={units} style={machinesStyle}
        handler={machineFilterHandler}  />
        <MaintenanceFilters repairs={repairs} companies={companies} 
        machines={machineFilters} style={maintenanceStyle} 
        handler={maintenanceFilterHandler} />
        <ReclamationFilters repairs={repairs} companies={companies} 
        style={reclamationStyle} handler={reclamationFilterHandler} />
        <hr />
        <AuthMachine machines={machines} style={machinesStyle} />
        <AuthMaintenance maintenance={maintenance} style={maintenanceStyle} />
        <AuthReclamation reclamation={reclamation} style={reclamationStyle} />
        <hr />
        <HomeControls user={user} />
    </div>
  )
}
