import { Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { axiosPrivate } from '../../../api/axios'
import useAuth from '../../../hooks/useAuth'
import "./SettingsPage.css"

function SettingsPage() {

    const [delCount, setDelCount] = useState(0)
    const [err, setErr] = useState("")
    const [inviteEmail, setInviteEmail] = useState("")

    const {auth} = useAuth()
    const {campaignId} = useParams()

    const perms = auth.permissions
    const permission = (perms.owner.includes(campaignId)) 
                        ? "owner" 
                        : (perms.admin.includes(campaignId)) 
                            ? "admin" 
                            : "player"

    const handleDelete = () => {
        if (delCount == 0 ){
            setDelCount(1)
        }else{
            axiosPrivate.delete(`campaign/${campaignId}`)
            .then(() => {window.location.href="/"})
            .catch((err) => setErr(err?.response?.data?.error))
            .finally(()=> setDelCount(0))
        }
    }

    const handleLeave = () => {
        if (delCount == 0 ){
            setDelCount(1)
        }else{
            axiosPrivate.post(`campaign/leave/${campaignId}`)
            .then(() => {window.location.href="/"})
            .catch((err) => setErr(err?.response?.data?.error))
        }
    }

    const handleInvite = (e) => {
        e.preventDefault()
        axiosPrivate.post(`campaign/invite/${campaignId}`, {invite_address: inviteEmail})
            .then(() => {alert("Successfully invited this player"); setInviteEmail("")})
            .catch((err) => setErr(err?.response?.data?.error))
    }

  return (
    <div className='settings-wrapper'>
        <div className='settings-title'>Settings</div>
        {(["owner", "admin"].includes(permission))
            ? 
                <div>
                    <form onSubmit={(e) => handleInvite(e)}>
                        <div className='settings-option-label'>Player Invite:</div>
                        <TextField 
                            sx={{width:"100%"}}
                            value={inviteEmail} 
                            onChange={(e) => setInviteEmail(e.target.value)} 
                            type="email"
                            required
                            label="Email"/>
                        <Button
                            type='submit'
                            variant="contained"
                            style={{marginTop:"0.5em"}}
                            value="Send Invite">Send Invite</Button>
                    </form>
                </div>
            : <></>
        }
        {(permission == "owner")
            ? <div className='settings-del-btn-wrap'>
                <div className='settings-option-label'>Delete Campaign:</div>
                <Button onClick={() => handleDelete()}
                variant="contained" 
                style={{marginTop:"0.5em"}}
                color="error">
                    {(delCount == 0) ? "Delete Campaign" : "Are You Sure?"}
                </Button></div>
            : <></>
        }
        {(permission == "player")
            ? <div className='settings-del-btn-wrap'>
                <div className='settings-option-label'>Leave Campaign:</div>
                <Button onClick={() => handleLeave()}
                variant="contained" 
                style={{marginTop:"0.5em"}}
                color="error">
                    {(delCount == 0) ? "Leave Campaign" : "Are You Sure?"}
                </Button></div>
            : <></>
        }
    </div>
  )
}

export default SettingsPage