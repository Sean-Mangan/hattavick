import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom'
import Content_Wrapper from '../../components/Content_Wrapper/Content_Wrapper';
import axios from 'axios';

import './NPC_Page.css'
import { Typography, Paper } from '@mui/material';

function NPC_Page() {

    let { name } = useParams();
    const [character, setCharacter] = useState({})
    var uri = "https://f12u17d0a5.execute-api.us-east-1.amazonaws.com/dev/api/character"

    function breaker(text){
        var result =""
        for (let i = 0; i < text.length; i++){
          result+=text[i]+"\n\n"
        }
        return result
    }

    async function get_character(){
        try{
            var response = await axios.patch(uri, {"name" : name},
            {
                withCredentials: true,
                headers: { crossDomain: true, 'Content-Type': 'application/json' }
            })
            console.log(response.data)
            if (response.data){
                setCharacter(response.data);
            }
        }catch (err){
            console.log(err)
        }
      }

      useEffect(() => {
        get_character();
      },[]);

    return (
        <Content_Wrapper>
            <div className="character_wrapper">
                <div className='character_title'>
                    <h1 style={{padding: "0", margin:"0"}}>{name}</h1>
                    <h4 style={{padding: "0", margin:"0"}}>{character.job} - {character.location}</h4>
                </div>
                <i>{(character.quote) ? character.quote :""}</i>
                <div className='desc_wrapper'>
                    <img className="npc_page_image" src={character.image}/>
                    <div className='desc_text'>
                        <Typography varaint="subtitle" align="center">{character.description}</Typography>
                    </div>
                </div>
                <h3 className='notes_title'>Notes</h3>
                <Paper elevation={10} className='note_content'>
                    <br/>
                    {((character.available_notes) && (character.available_notes.length >= 1)) 
                    ?    character.available_notes.map((paragraph)=> (<Typography className='noted'>&emsp;&emsp;{paragraph}</Typography>)) 
                    : <Typography>You do not have any notes on this NPC yet</Typography>}
                    <br/>
                </Paper>
            </div>
        </Content_Wrapper>
    );
}

export default NPC_Page;
