import React, { useEffect, useState } from 'react'
import { useNavigation } from 'react-router'
import HomeUnauth from './home/HomeUnauth'
import HomeAuth from './home/HomeAuth'

export default function Home(props) {
  if (props.user) {
    return <HomeAuth user={props.user} />
  } else {
    return <HomeUnauth />
  }
}
