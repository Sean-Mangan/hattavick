import { Button } from '@mui/material';
import React, {useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom';

import "./JoinPage.css"
import { useGetCampaignQuery, useJoinCampaignMutation } from '../../features/campaign/campaignApiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/auth/authSlice';
import { useRefreshMutation } from '../../features/auth/authApiSlice';

function JoinPage() {

  // helpful navigation things
  const navigate = useNavigate()

  // Some helpful state things
  const {campaign_id} = useParams();
  const [campaign, setCampaign] = useState({});
  const [err, SetErr] = useState("")

  // Get the new permissions after joining
  const dispatch = useDispatch()
  const [refresh] = useRefreshMutation()

  // RTK query stuff
  const {data, isLoading, isSuccess} = useGetCampaignQuery(campaign_id)
  const [joinCampaign, {isLoading: joinLoad}] = useJoinCampaignMutation()

  const join_campaign = async () => {
    try{
      await joinCampaign(campaign_id).unwrap()
      const data = await refresh().unwrap()
      dispatch(setCredentials(data))
      navigate(`/campaign/${campaign_id}`)
    } catch (e) {
      SetErr(e.data.error)
    }
  }

  // On Campaign change, set that data
  useEffect(() => {setCampaign(data)},[data])

  return (
    <>
    {((!isLoading) || (!joinLoad))
      ?
      <>
        {(isSuccess) 
          ?
            <div className="join_wrapper">
              <h1>You have been invited to join {campaign?.name ?? "Unkown Campaign"}</h1>
              <Button variant="contained" color="error" onClick={() => join_campaign()}>Join Campaign</Button>
            </div>
          : 
            <div className="join_wrapper">
              <h1>Oops, an error occured</h1>
              <h3>{err}</h3>
              <div>Try again, or ask an admin to re-invite you to the campaign</div>
            </div>
        }</> 
          :
          <>Loading</>
        }
      </>
  )
}

export default JoinPage