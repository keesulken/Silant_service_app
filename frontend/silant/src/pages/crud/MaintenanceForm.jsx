import React, { useState, useEffect } from 'react';
import NotFoundPage from '../NotFoundPage';

export default function MaintenanceForm(props) {
  let [instance, setInstance] = useState(null);
  let [repairs, setRepairs] = useState(null);
  let [machines, setMachines] = useState(null);
  let [companies, setCompanies] = useState(null);


  useEffect(()=>{
    if (props.id) {
      let url = 'http://127.0.0.1:8000/api/v1/maintenance/' + props.id;
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
    let repairsURL = 'http://127.0.0.1:8000/api/v1/repairs';
    let machinesURL = 'http://127.0.0.1:8000/api/v1/machines';
    let companiesURL = 'http://127.0.0.1:8000/api/v1/companies';
    Promise.all([
      fetch(repairsURL).then(res => res.json()),
      fetch(machinesURL).then(res => res.json()),
      fetch(companiesURL).then(res => res.json()),
    ]).then(result => {
      setRepairs(result[0]);
      setMachines(result[1]);
      setCompanies(result[2]);
    }).catch(error => console.log(error.message));
  }, [])


  if (instance === 404) {
    return <NotFoundPage />
  } else if (!(repairs && machines && companies)) {
    return <div>No data</div>
  }
}
