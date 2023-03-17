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
        { props.user.type === 'MNU' && <p>
            <button onClick={(e) => create('maintenance', e)}>Create maintenance</button></p>}
        { props.user.type === 'SVC' && <p>
            <button onClick={(e) => create('maintenance', e)}>Create maintenance</button>
            <button onClick={(e) => create('reclamation', e)}>Create reclamation</button></p>}
        { props.user.type === 'MFR' && 
        <>
        <p>
            <button onClick={(e) => create('machine', e)}>Create machine</button>
            <button onClick={(e) => create('maintenance', e)}>Create maintenance</button>
            <button onClick={(e) => create('reclamation', e)}>Create reclamation</button>
        </p>
        <p>
            <button onClick={(e) => update('machine', e)}>Update machine</button>
            <button onClick={(e) => update('maintenance', e)}>Update maintenance</button>
            <button onClick={(e) => update('reclamation', e)}>Update reclamation</button>
        </p>
        <p>
            <button onClick={(e) => create('directory', e)}>Create directory</button>
            <button onClick={(e) => update('directory', e)}>Update directory</button>
            <button onClick={(e) => update('profile', e)}>Update client profile</button>
        </p>
        </>}
    </div>
  )
}
