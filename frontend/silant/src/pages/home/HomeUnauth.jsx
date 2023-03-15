import React, { useState } from 'react'
import UnauthMachine from './UnauthMachine';

export default function HomeUnauth() {
    const [machine, setMachine] = useState(null);


    function handleClick () {
        let num = document.getElementById('factory-num').value;
        let url = 'http://127.0.0.1:8000/api/v1/machine';
        let params = {
            num: num,
        };
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
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
            setMachine(result);
        })
    }

  return (
    <div>
        <p>Проверьте технику по серийнику</p>
        <p><input type='text' id='factory-num' />
        <button onClick={handleClick}>search</button></p>
        <UnauthMachine machine={machine} />
    </div>
  )
}
