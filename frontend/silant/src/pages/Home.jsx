import React from 'react';
import HomeUnauth from './home/HomeUnauth';
import HomeAuth from './home/HomeAuth';

export default function Home(props) {
  if (props.user) {
    return <HomeAuth user={props.user} />
  } else {
    return <HomeUnauth />
  }
}
