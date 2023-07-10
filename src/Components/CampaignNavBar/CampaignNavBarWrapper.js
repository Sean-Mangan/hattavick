import React from 'react'
import { Outlet, useOutletContext } from 'react-router-dom'
import CampaignNavBar from './CampaignNavBar'

function CampaignNavBarWrapper() {
  return (
    <div>
        <CampaignNavBar/>
        <Outlet context={useOutletContext()}/>
    </div>
  )
}

export default CampaignNavBarWrapper