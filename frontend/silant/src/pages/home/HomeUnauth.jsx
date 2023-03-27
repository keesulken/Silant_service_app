import React, { useState } from 'react';
import UnauthMachine from './UnauthMachine';
import ErrorBlock from '../app/ErrorBlock';

export default function HomeUnauth() {
    const [machine, setMachine] = useState();
    let [errorBlock, setErrorBlock] = useState();


    function handleClick () {
        let num = document.getElementById('factory-num').value;
        let url = 'http://127.0.0.1:8000/api/v1/search';
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
                errorBlockVoid();
                return res.json();
            } else if (res.status === 400) {
                throw new Error('400');
            } else if (res.status === 403) {
                throw new Error('403');
            } else if (res.status === 404) {
                throw new Error('404');
            } else {
                throw new Error('500');
            };
        }).then(result => {
            setMachine(result);
        }).catch(error => {
            if (error.message === '400') {
                errorBlockVoid();
                let block = <ErrorBlock error={'Машины с таким серийным номером не найдено'} />;
                setErrorBlock(block);
            } else if (error.message === '403') {
                errorBlockVoid();
                let block = <ErrorBlock error={'Недостаточно прав'} />;
                setErrorBlock(block);
            } else if (error.message === '404') {
                errorBlockVoid();
                let block = <ErrorBlock error={'Такой страницы не существует'} />;
                setErrorBlock(block);
            } else if (error.message === '500' ||
            error.name === 'TypeError') {
                errorBlockVoid();
                let block = <ErrorBlock error={'Неизвестная ошибка, попробуйте позже'} />;
                setErrorBlock(block);
            };
        })
    }


    function errorBlockVoid () {
        if (document.getElementById('error-block')) {
            setErrorBlock();
        };
    }


  return (
    <div>
        <p>Проверьте комплектацию и технические характеристики техники Силант</p>
        { errorBlock }
        <p><input type='text' id='factory-num' />
        <button onClick={handleClick}>search</button></p>
        <hr />
        <UnauthMachine machine={machine} />
    </div>
  )
}
