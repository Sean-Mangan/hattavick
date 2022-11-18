import { Accordion, AccordionDetails, AccordionSummary, Button, TextareaAutosize, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';

import './SessionsPage.css'


function SessionsPage() {

    const [sessions, setSessions] = useState([])
    const [delCount, setDelCount] = useState(0)
    const [err, setErr] = useState("")
    const [editMode, setEditMode] = useState([])
    const [editCopies, setEditCopies] = useState([])

    const {auth} = useAuth();
    const {campaignId} = useParams()
    const axiosPrivate = useAxiosPrivate()
    const isAdmin = (auth?.permissions?.admin.includes(campaignId) || auth?.permissions?.owner.includes(campaignId))

    const get_sessions = () => {
        axiosPrivate.get(`${campaignId}/notes/sessions`)
            .then((resp) => {
                setSessions(resp?.data?.sessions);
                setEditMode(resp?.data?.sessions.map(() => false))
                setDelCount(resp?.data?.sessions.map(() => 0))
                setEditCopies(resp?.data?.sessions);
            })
            .catch((err) => setErr(err?.response?.data?.error))
    }

    const handleDelCount = (idx, session_id) => {
        if (delCount[idx] === 0) {
            const new_edits = delCount.slice()
            new_edits[idx] = 1
            setDelCount(new_edits)
        }else{
            axiosPrivate.delete(`${campaignId}/notes/sessions/${sessions[idx].session_id}`)
            .then(() => get_sessions())
            .catch((err) => setErr(err?.response?.data?.error))
        }
    }

    const create_new_session = () => {
        axiosPrivate.post(`${campaignId}/notes/sessions`)
            .then(()=> get_sessions())
            .catch((err) => setErr(err?.response?.data?.error))
    }

    const handleEditSwap = (idx) => {

        if (editMode[idx]){
            if ((editCopies[idx].data === sessions[idx].data) 
                && (editCopies[idx].data === sessions[idx].data )
                && (editCopies[idx].data === sessions[idx].data)){
                    const new_edits = editMode.slice()
                    new_edits[idx] = !editMode[idx]
                    setEditMode(new_edits)
                }
            const form_data = new FormData()
            form_data.append("title", editCopies[idx].title)
            form_data.append("date", editCopies[idx].date)
            form_data.append("data", editCopies[idx].data)
            axiosPrivate.post(`${campaignId}/notes/sessions/${sessions[idx].session_id}`, form_data)
            .then(()=> get_sessions())
            .catch((err) => setErr(err?.response?.data?.error))

        } else{
            const new_edits = editMode.slice()
            new_edits[idx] = !editMode[idx]
            setEditMode(new_edits)
        }
    }

    const handleChange = (idx, v, k) => {
        const new_edits = editCopies.slice()
        new_edits[idx][k] = v
        setEditCopies(new_edits)
    }

    useEffect(() => {
      get_sessions()
    },[])

  return (
    <div className='sessions-wrapper'>
        <div className='sessions-title'>Session Notes</div>
        <div className='session-accordian-wrap'>
            {sessions.map((session, idx) => {
                return (
                    <div key={session.session_id}>
                        <Accordion style={{border: "1px solid grey"}} >
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header">
                                <h3 style={{padding:"0", margin:"0", width:'100%'}}>
                                    {(!editMode[idx])
                                    ?
                                        <>{(session.title) ? session.title : "None"} </>
                                    :
                                        <TextField value={editCopies[idx].title} label={"Title"} onChange={(e) => handleChange(idx, e.target.value, "title")} />
                                    }
                                </h3>
                            </AccordionSummary>
                            <AccordionDetails className='accordian-data-wrap'>
                                <div className='edit-btn-wrap' style={{display: `${(isAdmin) ? "block" : "none"}`}}>
                                    {(!editMode[idx])
                                    ?
                                        <></>
                                    :
                                        <Button  variant="contained" color="error" onClick={() => {handleDelCount(idx)}}>
                                            {(delCount[idx] === 0) ? "Delete" : "Are You Sure?"}
                                        </Button>
                                    }
                                    {(!editMode[idx])
                                    ?
                                        <Button  variant="contained" color="error" onClick={() => {handleEditSwap(idx)}}>
                                            Edit
                                        </Button>
                                    :
                                        <Button  variant="contained" color="primary" onClick={() => {handleEditSwap(idx)}}>
                                            Save
                                        </Button>
                                    }
                                </div>
                                {(!editMode[idx])
                                ?   
                                    <div className='accordian-data-wrap'>
                                        {(session.date) ? <strong className='session-date'>{session.date}<br/></strong> : <></>}
                                        <div className='accordian-data-wrap'>{session.data}</div>
                                    </div>
                                :
                                    <>
                                    <TextField value={editCopies[idx].date} label={"Date"} onChange={(e) => handleChange(idx, e.target.value, "date")} />
                                    <TextareaAutosize 
                                        className="session-resizer" 
                                        value={editCopies[idx].data}  
                                        onChange={(e) => handleChange(idx, e.target.value, "data")} />
                                    </>
                                }
                            </AccordionDetails>
                        </Accordion>
                    </div>
                )
            })}
        </div>
        {(isAdmin) ? <Button onClick={()=> create_new_session() }variant="contained" style={{marginTop: "1em"}}><AddIcon/></Button> : <></>}

    </div>
  )
}

export default SessionsPage