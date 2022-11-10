import React from 'react'
import { Outlet } from 'react-router-dom'
import HomeNav from './HomeNav'

function HomeNavWrapper({campaigns, loggedIn, children}) {
  return (
    <div>
        <HomeNav campaigns={campaigns} loggedIn={loggedIn}/>
        <Outlet/>
    </div>
  )
}

export default HomeNavWrapper