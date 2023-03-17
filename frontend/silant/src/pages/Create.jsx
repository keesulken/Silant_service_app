import React from 'react';
import { useParams } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';
import MaintenanceForm from './crud/MaintenanceForm';
import ReclamationForm from './crud/ReclamationForm';
import MachineForm from './crud/MachineForm';
import DirectoryForm from './crud/DirectoryForm';
import Forbidden403 from './Forbidden403';

export default function Create(props) {
    let { instance } = useParams();
    let tags = ['machine', 'maintenance', 'reclamation', 'directory'];

  if (!tags.includes(instance)) {
    return <NotFoundPage />
  } else if (props.user) {
    if (instance === 'maintenance' && props.user) {
    return <MaintenanceForm />
    } else if (instance === 'reclamation' && 
    (props.user.type === 'SVC' || props.user.type === 'MFR')) {
    return <ReclamationForm />
    } else if (instance === 'machine' && props.user.type === 'MFR') {
    return <MachineForm />
    } else if (instance === 'directory' && props.user.type === 'MFR') {
    return <DirectoryForm />
    } else {
    return <Forbidden403 />
    };
  } else {
    return <div>No data</div>
  }
}
