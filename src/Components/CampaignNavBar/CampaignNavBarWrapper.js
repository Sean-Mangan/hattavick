import React from 'react'
import { Outlet } from 'react-router-dom'
import CampaignNavBar from './CampaignNavBar'

function CampaignNavBarWrapper() {
  return (
    <div>
        <CampaignNavBar/>
        <Outlet/>
    </div>
  )
}

export default CampaignNavBarWrapper