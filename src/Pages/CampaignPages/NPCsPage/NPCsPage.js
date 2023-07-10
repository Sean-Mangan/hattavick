import { Button, Card, TextField } from '@mui/material'
import React, { useState } from 'react'
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add';
import "./NPCsPage.css";
import { useCreateNewNPCMutation, useGetNPCDataQuery } from '../../../features/campaign/campaignApiSlice'

function NPCsPage() {

    // Some helpful hooks to get context and facilitate redirects
    const {campaignId, isAdmin} = useOutletContext()
    const navigate = useNavigate()

    // Get all characters
    const {data: allChars} = useGetNPCDataQuery(campaignId)

    // Handy mutation for creating a new character
    const [createNewNPC] = useCreateNewNPCMutation({fixedCacheKey: 'create-npc'})

    // Hold onto state for filtering of characters
    const [chars, setChars] = useState(allChars)
    const [name, setName] = useState('')

    // If a image is not associated, use this as default
    const notGiven = "https://d32ogoqmya1dw8.cloudfront.net/images/serc/empty_user_icon_256.v2.png"

    /**
     * Will attempt to query the backend to create a new npc
     */
    const create_npc = async() => {
        try{
            const result = await createNewNPC(campaignId).unwrap()
            navigate(`/campaign/${campaignId}/characters/npc/${result.character_id}`)
        }catch{}
    }

    /**
     * Will filter out names from the list of all npc based on event input
     * @param {*} e 
     */
    const filter = (e) => {
        const keyword = e.target.value;
        if (keyword !== '') {
            const results = allChars.filter((char) => {
            return char.name.toLowerCase().includes(keyword.toLowerCase()) && !(char.name.includes("Unknown"));
            });
            setChars(results);
        } else {
            setChars(allChars);
        }
      setName(keyword);
    };

    /**
     * A handy representation of character data in a row
     * @param {*} param0 
     * @returns 
     */
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