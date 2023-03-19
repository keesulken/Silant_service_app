import React from 'react';
import { useParams } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';
import MachineList from './crud/MachineList';
import MaintenanceList from './crud/MaintenanceList';
import ReclamationList from './crud/ReclamationList';
import DirectoryList from './crud/DirectoryList';
import ProfileList from './crud/ProfileList';
import Forbidden403 from './Forbidden403';

export default function UpdateList(props) {
  let { instance } = useParams();
  let tags = [
    'machine', 
    'maintenance', 
    'reclamation', 
    'directory',
    'profile',
  ];

  if (!tags.includes(instance)) {
    return <NotFoundPage />
  } else if (props.user) {
    if (instance === 'machine' && props.user.type === 'MFR') {
      return <MachineList />
    } else if (instance === 'maintenance' && props.user.type === 'MFR') {
      return <MaintenanceList />
    } else if (instance === 'reclamation' && props.user.type === 'MFR') {
      return <ReclamationList />
    } else if (instance === 'directory' && props.user.type === 'MFR') {
      return <DirectoryList />
    } else if (instance === 'profile' && props.user.type === 'MFR') {
      return <ProfileList />
    } else {
      return <Forbidden403 />
    };
  } else {
    return <div>No data</div>
  }
}
