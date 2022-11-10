import { Button, Card, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import AddIcon from '@mui/icons-material/Add';
import "./NPCsPage.css";

function NPCsPage() {

    const axiosPrivate = useAxiosPrivate()
    const {campaignId} = useParams()
    const {auth} = useAuth()

    const [allChars, setAllChars] = useState([])
    const [chars, setChars] = useState([])
    const [err, setErr] = useState("")
    const [name, setName] = useState('');

    const isAdmin = auth.permissions.admin.concat(auth.permissions.owner).includes(campaignId)
    const notGiven = "https://d32ogoqmya1dw8.cloudfront.net/images/serc/empty_user_icon_256.v2.png"

    const get_npcs = () => {
        axiosPrivate.get(`${campaignId}/characters/npcs`)
        .then((resp) => {setAllChars(resp?.data?.npcs); setChars(resp?.data?.npcs)})
        .catch((err) => {setErr(err?.response?.data?.error)})
    }

    const create_npc = () => {
        axiosPrivate.post(`${campaignId}/characters/npcs`)
        .then((resp) => {window.location.href= `/campaign/${campaignId}/characters/npc/${resp.data.character_id}`})
        .catch((err) => {setErr(err?.response?.data?.error)})
    }

    const filter = (e) => {
        const keyword = e.target.value;
        if (keyword !== '') {
            const results = allChars.filter((char) => {
            return char.name.toLowerCase().includes(keyword.toLowerCase()) && !(char.name.includes("Unknown"));
            });
            setChars(results);
        } else {
            setChars(allChars);
            // If the text field is empty, show all users
        }
      setName(keyword);
    };

    useEffect(()=>{get_npcs()}, [])

    const CharacterRow = ({char}) => {
        return(
            <div >
            <Link to={(char?.character_id) ? `/campaign/${campaignId}/characters/npc/${char.character_id}` : "#"} style={{textDecoration:"none"}}>
                <Card variant="outlined" onClick={()=>null} className="row_wrapper button">
                    <div className='icon_wrapper'>
                        <img className='npc_icon' src={(char.image) ? char.image : notGiven} alt=""/>
                    </div>
                    <div className='npc_data_wrapper'>
                        <div className='content_center'>
                            <h4 className='character_name'>{(char.name === "Unknown") ? 'Unknown Name' : char.name}</h4>
                            <h4 className='character_header'>{(char.location) ? char.location : "Unknown Location"}</h4>
                            <p className='character_header blurb'>{(char.description)? char.description.slice(0,200)+"..." : "You have not met this character yet"}</p>
                        </div>
                    </div>
                </Card>
            </Link>
        </div>
        )
    }

  return (
    <div className='npcs-wrapper'>
        <div className='npc-title'>All NPCs</div>
        <div className='npc-page-form-wrap'>
            {(isAdmin) 
            ? 
                <Button 
                    className="npcs-btn" 
                    variant="contained" 
                    color="error"
                    onClick={() => create_npc()} 
                    startIcon={<AddIcon />}
                    >Add Npc</Button> 
            : <></>}
            <TextField
                className="npc_search"
                type="search"
                value={name}
                onChange={filter}
                placeholder="Search Name"
            />
        </div>
        {chars.map((char) => {return (<CharacterRow char={char} key={char.character_id}/>)})}
    </div>
  )
}

export default NPCsPage