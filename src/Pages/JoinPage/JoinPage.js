import { Button } from '@mui/material';
import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import "./JoinPage.css"

function JoinPage({reload}) {

  const {campaign_id, invite_id} = useParams();
  const axiosPrivate = useAxiosPrivate();
  const [campaign, setCampaign] = useState({});
  const [err, SetErr] = useState("")

  const get_campaign_data = () => {
      axiosPrivate.get(`/campaign/${campaign_id}`).then((resp) => {
          setCampaign (resp.data)
      }).catch((err) => {
          console.log(err)
          SetErr(err.response.data.error)
      })
  }

  const join_campaign_via_link = () => {
    axiosPrivate.post(`/campaign/join/${campaign_id}/${invite_id}`).then((resp) => {
      setCampaign (resp.data)
      window.location.href="/"
    }).catch((err) => {
        SetErr(err.response.data.error)
    })
  }

  const join_campaign = () => {
    axiosPrivate.post(`/campaign/join/${campaign_id}`).then((resp) => {
        setCampaign (resp.data)
        window.location.href="/"
    }).catch((err) => {
        SetErr(err.response.data.error)
    })
  }

  useEffect(() => {(invite_id) ? join_campaign_via_link() : get_campaign_data()},[])

  return (
    <>
      {(err === "") 
        ?
          <div className="join_wrapper">
            <h1>You have been invited to join {campaign.name}</h1>
            <Button variant="contained" color="error" onClick={() => join_campaign()}>Join Campaign</Button>
          </div>
        : 
          <div className="join_wrapper">
            <h1>Oops, an error occured</h1>
            <h3>{err}</h3>
            <div>Try again, or ask an admin to re-invite you to the campaign</div>
          </div>
      }
    </>
  )
}

export default JoinPage