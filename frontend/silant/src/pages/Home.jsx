import React, { useEffect, useState } from 'react'

export default function Home() {
  let [user, setUser] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/v1/user').then(res => res.json()).then(result => {
      setUser(result[0]);
    })
  }, [])


  return (
    <div>{user.username}</div>
  )
}
