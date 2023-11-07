import React, { useState } from 'react'
import { useDeleteCampaignMutation, useGetCampaignsQuery, useLeaveCampaignMutation } from '../../features/campaign/campaignApiSlice'

import "./CampaignManagementPage.css"
import { Alert, AlertTitle, Button, Divider, Paper, TextField } from '@mui/material'
import AddBoxIcon from '@mui/icons-material/AddBox';
import LaunchIcon from '@mui/icons-material/Launch';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const CampaignManagementPage = () => {

  // Get campaign related datas
  const {data: campaigns, isSuccess, isLoading} = useGetCampaignsQuery()
  const [deleteCampaign, {isLoading: delLoading}] = useDeleteCampaignMutation({fixedCacheKey: 'delete-campaign'})
  const [leaveCampaign] = useLeaveCampaignMutation()

  // Helpful hooks
  const navigate = useNavigate()

  // Hold onto state
  const [delCampaignName, setDelCampaignName] = useState("")
  const [delVerify, setDelVerify] = useState("")
  const [delCampaignId, setDelCampaignId] = useState("")
  const [error, setError] = useState("")

  /**
   * Handles the request to delete a campaign
   */
  const handleDelete = async () => {
    try{
      await deleteCampaign(delCampaignId).unwrap()
      setDelCampaignId("")
      setDelCampaignName("")
      setDelVerify("")
    } catch (err){
      const errMsg = (err?.data?.error) ? err?.data?.error : "An unkown error occured, try again or contact support"
      setError(errMsg)
    }
  }

  /**
   * Handles the request to leave a campaign
   */
  const handleLeave = async (campaignId) => {
    try{
      await leaveCampaign(campaignId).unwrap()
      setDelCampaignId("")
      setDelCampaignName("")
      setDelVerify("")
    } catch (err){
      const errMsg = (err?.data?.error) ? err?.data?.error : "An unkown error occured, try again or contact support"
      setError(errMsg)
    }
  }

  // A component for each campaign that the user owns
  const OwnerRow = ({campaignData}) => {
    return (
      <div className='owner-row'>
        <div className='campaign-name-title'><strong>{campaignData.name}</strong></div>
        <Button 
        variant='contained' 
        onClick={() => navigate(`/campaign/${campaignData.id}`)}
        startIcon={<LaunchIcon/>}
        >
          Launch
        </Button>
        <Button 
        variant='contained'
        color='error'
        startIcon={<DeleteIcon/>}
        onClick={() => {setDelCampaignName(campaignData.name); setDelCampaignId(campaignData.id)}}
        >
          Delete
        </Button>
        <Button 
        variant='contained'
        startIcon={<AddBusinessIcon/>}
        color='secondary'
        disabled
        >
          Add to Market Place
          </Button>
        <Button 
        variant='contained' 
        onClick={() => navigate(`/campaign/${campaignData.id}/settings`)}
        startIcon={<SettingsApplicationsIcon/>}
        color="success"
        >
          Settings
        </Button>
      </div>
    )
  }

    // A component for each campaign that the user owns
  const RegularRow = ({campaignData}) => {
    return (
      <div className='owner-row'>
        <div className='campaign-name-title'><strong>{campaignData.name}</strong></div>
        <Button 
        variant='contained' 
        onClick={() => navigate(`/campaign/${campaignData.id}`)}
        startIcon={<LaunchIcon/>}
        >
          Launch
        </Button>
        <Button 
        variant='contained'
        color='error'
        startIcon={<LogoutIcon/>}
        onClick={() => {handleLeave(campaignData.id)}}
        >
          Leave
        </Button>
      </div>
    )
  }

  return (
    <div className='campaign-management-wrap'>
      { (!isLoading) ?
        <>
          {(delCampaignName !== "") ? 
            <div className='delete-campaign-wrap'>
              <Paper elevation={10} className='delete-campaign-box'>
                <div className='close-icon-wrap'>
                  <Button 
                  onClick={() => {setDelCampaignName(""); setDelVerify("")}} 
                  startIcon={<CloseIcon/>}
                  style={{color: "black"}}
                  size='l'
                  />
                </div>
                <h3>Enter the name of the campaign ({delCampaignName}) to delete.</h3>
                <TextField placeholder={delCampaignName} value={delVerify} onChange={(e) => setDelVerify(e.target.value)}></TextField>
                <br/>
                <br/>
                <Button 
                  variant='contained' 
                  color="error" 
                  disabled={(delVerify !== delCampaignName) || (delLoading) }
                  onClick={() => handleDelete()}
                  >Delete</Button>
              </Paper>
            </div> 
          :<></>}
          <h1>Campaigns</h1>
          <Alert
            className='login_err'
            onClose={() => {setError("")}} style={(error !== "") ? {textAlign:"left", marginBottom: "1em"} : {display: "none"}} 
            severity="error"
          >
              <AlertTitle>Error</AlertTitle>
              <strong>Oops, an error occured</strong> — {Error}
          </Alert>
          { (campaigns.owner.length !== 0) ?
            <Paper elevation={10} className='campaign-management-box-wrap'>
              <div className='owner-title-wrap'>
                <div className='campaign-management-box-title'><strong>Owned Campaigns</strong></div>
                <Button 
                startIcon={<AddBoxIcon className='add-icon'/>}
                variant='contained'
                color='error'
                className='add-btn'
                style={{backgroundColor: "#21b6ae"}}
                onClick={() => navigate("/create")}
                >
                  New
                </Button>
              </div>
              {(isSuccess) ? <>{(campaigns.owner ?? []).map((item) => <OwnerRow campaignData={item} key={item.id}/>)}</> : <></>}
            </Paper>
          : <></>
          }
          <br/>
          { (campaigns.admin.length !== 0) ?
            <Paper elevation={10} className='campaign-management-box-wrap'>
              <div className='owner-title-wrap'>
                <div className='campaign-management-box-title'><strong>Admin Campaigns</strong></div>
              </div>
              {(isSuccess) ? <>{(campaigns.admin ?? []).map((item) => <RegularRow campaignData={item} key={item.id}/>)}</> : <></>}
            </Paper>
          : <></>
          }
          <br/>
          { (campaigns.player.length !== 0) ?
            <Paper elevation={10} className='campaign-management-box-wrap'>
              <div className='owner-title-wrap'>
                <div className='campaign-management-box-title'><strong>Player Campaigns</strong></div>
              </div>
              {(isSuccess) ? <>{(campaigns.player ?? []).map((item) => <RegularRow campaignData={item} key={item.id}/>)}</> : <></>}
            </Paper>
          : <></>
          }
        </>
      : <></>
      }
    </div> 
  )
}

export default CampaignManagementPage