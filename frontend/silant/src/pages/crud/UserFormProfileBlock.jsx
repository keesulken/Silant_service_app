import React, { useEffect } from 'react';

export default function UserFormProfileBlock(props) {
  useEffect(()=>{
    if (props.name) {
      document.getElementById('prof-name').value = props.name;
      document.getElementById('description').value = props.desc;
    };
  }, [])


  if (props.hidden) {
    <div style={{display: 'none'}}></div>
  } else {
    return (
      <>
          <p id='p-name'>Название в профиле:
              <input type='text' name='prof-name' id='prof-name' />
          </p>
          <p id='p-desc'>Описание в профиле:
              <input type='text' name='description' id='description' />
          </p>
      </>
    )
  }
}
