import React from 'react';
import { useParams } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';
import MaintenanceForm from './crud/MaintenanceForm';
import ReclamationForm from './crud/ReclamationForm';
import MachineForm from './crud/MachineForm';
import DirectoryForm from './crud/DirectoryForm';
import UserProfileForm from './crud/UserProfileForm';
import Forbidden403 from './Forbidden403';

export default function Update(props) {
  let { instance, id } = useParams();
  let tags = [
    'machine', 
    'maintenance', 
    'reclamation', 
    'repair',
    'unit',
    'client',
    'company',
  ];

  if (!tags.includes(instance)) {
    return <NotFoundPage />
  } else if (props.user) {
    if (instance === 'maintenance' && props.user.type === 'MFR') {
    return <MaintenanceForm id={id} />
    } else if (instance === 'reclamation' && props.user.type === 'MFR') {
    return <ReclamationForm id={id} />
    } else if (instance === 'machine' && props.user.type === 'MFR') {
    return <MachineForm id={id} />
    } else if (instance === 'repair' && props.user.type === 'MFR') {
    return <DirectoryForm id={id} type={'repair'} />
    } else if (instance === 'unit' && props.user.type === 'MFR') {
    return <DirectoryForm id={id} type={'unit'} />
    } else if (instance === 'client' && props.user.type === 'MFR') {
    return <UserProfileForm id={id} type={'client'} />
    } else if (instance === 'company' && props.user.type === 'MFR') {
    return <UserProfileForm id={id} type={'company'} />
    } else {
    return <Forbidden403 />
    };
  } else {
    return <div>No data</div>
  }
}
