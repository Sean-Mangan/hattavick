import React, {useState, useEffect} from 'react';
import { Button, Accordion, Typography, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextareaAutosize from "react-autosize-textarea"
import axios from 'axios';
import Moment from 'moment';
import { uuid } from 'uuidv4';
import './PlayerNote.css';

function PlayerNote({note, reload}) {


  const [editable, setEditable] = useState(false)

  var uri = 'https://f12u17d0a5.execute-api.us-east-1.amazonaws.com/dev/api/notes'

  async function handle_click(event){
    event.preventDefault()
    var new_data = {
      "name" : note.player_name,
      "title": event.target.title.value,
      "content": event.target.content.value,
      "_id": note._id
    }
    try{
      if(editable){
      var response = await axios.put(uri, new_data,
        {
            withCredentials: true,
            headers: { crossDomain: true, 'Content-Type': 'application/json' }
        })
        if(response){
          reload()
        }
      }
      setEditable(!editable)
    }catch (err){
        console.log(err)
    }
  }

  async function handleDelete(){
    var new_data = {"data":{
      "_id": note._id
    }}
    try{
      var response = await axios.delete(uri, new_data,
        {
            withCredentials: true,
            headers: { crossDomain: true, 'Content-Type': 'application/json' }
        })
        if(response){
          reload()
        }
    }catch (err){
        console.log(err)
    }
  }

  return (
    <form onSubmit={handle_click}>
      <Accordion style={{border: "1px solid grey"}}>
          <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          disabled={editable}>
            <h2 style={{padding:"0", margin:"0"}}>{note.title}</h2>
          </AccordionSummary>
          <AccordionDetails>
          <TextareaAutosize 
                name="title"
                className='edit_title' 
                defaultValue={(note.title) ? note.title : "No Title"}
                key={uuid()}
                style={{border: (editable) ? "1px solid black" : "none"}}
                disabled={!editable}/>
                <div style={{display:"flex"}}>
                  <h4 className='date'>
                    {"LastEdit:"}
                  </h4>
                  {Moment(note.last_edit).format('d MMM YYYY')}
                </div>
              <TextareaAutosize 
                name="content"
                className='edit_content' 
                style={{border: (editable) ? "1px solid black" : "none"}}
                defaultValue={(note.content) ? note.content : "No Title"}
                key={uuid()}
                disabled={!editable}/>
                <Button type="submit" size="small" variant="contained" color="error" style={{marginTop:'20px', textAlign:"right"}}>
                  {(editable) ? "Save Changes" : "Edit Note"}
                </Button>
                <Button 
                size="small" 
                variant="contained" 
                color="error" 
                style={{margin:'20px 15px 0px', textAlign:"right"}}
                onClick={handleDelete}
                disabled={editable}>
                  Delete Note
                </Button>
          </AccordionDetails>
      </Accordion>
    </form>
  );
}

export default PlayerNote;
