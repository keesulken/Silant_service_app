import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';
import ErrorBlock from './app/ErrorBlock';

export default function Detail() {
  let token = localStorage.getItem('token');
  let { details, id } = useParams();
  let [ item, setItem ] = useState();
  let [errorBlock, setErrorBlock] = useState();

  useEffect(()=> {
    if (!['unit', 'repair', 'client', 'company'].includes(details)) {
        setItem(404);
    } else {
        let url = 'http://127.0.0.1:8000/api/v1/' + details + '/' + id;
        let options;
        if (details === 'unit') {
          options = {};
        } else {
          options = {
            headers: {
              'Authorization': `Token ${token}`,
            },
          };
        };
        fetch(url, options).then(res => {
            if (res.status === 200) {
                return res.json();
            } else if (res.status === 404) {
                setItem(404);
            } else {
                throw new Error('500');
            };
        }).then(result => setItem(result))
        .catch(error => {
          if (error.message === '500' ||
          error.name === 'TypeError') {
            setErrorBlock('500');
          };
        });
    };
  }, [])

  if (!item) {
    return <div>Нет данных</div>
  } else if (item === 404) {
    return <NotFoundPage />
  } else if (errorBlock) {
    return <ErrorBlock error={'Неизвестная ошибка, попробуйте позже'} />
  } else {
    return (
        <div>
            <h2>{item.type && item.type} {item.name}</h2>
            <p>{item.description}</p>
        </div>
    )
  }
}
