import React, {useState, useEffect} from 'react';
import Content_Wrapper from '../../components/Content_Wrapper/Content_Wrapper';
import axios from 'axios';
import "./MyNotes.css"
import { get_notespage_data, get_player_notes, create_note } from '../../utils/queries';
import { uuid } from 'uuidv4';

import { Typography, Button } from '@mui/material';
import PlayerNote from '../../components/PlayerNote/PlayerNote';
import { textAlign } from '@mui/system';

axios.defaults.withCredentials = true;

function MyNotes() {

    var uri = 'https://f12u17d0a5.execute-api.us-east-1.amazonaws.com/dev/'


    const [overview, setOverview] = useState("")
    const [notes, setNotes] = useState([])

    async function set_up() {
        var data = await get_notespage_data()
        if (data){
            setOverview(data.data)
        }else{
            console.log("Can't get notes page data")
        }
        var notes = await get_player_notes()
        if(notes){
            var new_notes = notes.sort(function(a,b){
                return new Date(b.last_edit).getTime()  - new Date(a.last_edit).getTime() ;
              });
              if(new_notes){
                setNotes(new_notes);
              }
            
        }else{
             console.log("Couldn't get notes")
        }
    }

    async function create_notes(event){
        event.preventDefault()
        var success = await create_note()
        var help = await set_up()
    }


    useEffect(async ()=> {
        var data = await set_up()
        if (data) {
            console.log("Successfully loaded")
        }
    }, [])

  return (
    <Content_Wrapper>
        <div className='notes_wrapper'>
            <h1 className='notes_title'>My Notes</h1>
            <Typography  className='notes_description'>
                {overview}
            </Typography>
            <form onSubmit={create_notes} style={{textAlign:"center"}}>
                <Button type="submit" size="large" variant="contained" color="error" style={{marginBottom:'30px', textAlign:"center"}}>
                    Create Note
                </Button>
            </form>
            <div>
                {notes.map((note) => <PlayerNote key={uuid()} note={note} reload={set_up}/>)}
            </div>
        </div>
    </Content_Wrapper>
  )
}

export default MyNotes;
