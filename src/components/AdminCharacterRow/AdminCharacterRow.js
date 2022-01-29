import React, {useState} from 'react';
import { Accordion, Typography, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';


import "./AdminCharacterRow.css"

function AdminCharacterRow({character, reload}) {

  var uri = 'https://f12u17d0a5.execute-api.us-east-1.amazonaws.com/dev/api/character'

  const [check, setCheck] = useState(character.visible)

  function breaker(text){
    var result =""
    for (let i = 0; i < text.length; i++){
      result+=text[i]+"\n\n"
    }
    return result
  }

  function debreaker(text){
    var wow = text.split("\n\n")
    var last = wow.pop()
    return wow
  }

  function handleCheck(e){
    setCheck(e.target.checked)
  }

  const handleDelete = async (event) => {
    event.preventDefault();
    var new_data = {"data": {"name" : character.name}}
    console.log(new_data)
    try{
      var response = await axios.delete(uri, new_data,
      {
          withCredentials: true,
          headers: { crossDomain: true, 'Content-Type': 'application/json' }
      })
      reload()
    }catch (err){
        console.log(err)
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    var new_data = {"name" : character.name}
    new_data.location =  event.target.location.value
    new_data.visible = event.target.visible.checked
    new_data.icon = event.target.icon.value
    new_data.image =event.target.image.value
    new_data.job = event.target.job.value
    new_data.description = event.target.description.value
    new_data.all_notes = debreaker(event.target.all_notes.value)
    new_data.available_notes = debreaker(event.target.available_notes.value)
    try{
      var response = await axios.put(uri, new_data,
      {
          withCredentials: true,
          headers: { crossDomain: true, 'Content-Type': 'application/json' }
      })
      reload()
    }catch (err){
        console.log(err)
    }
  };

  return (
  <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            {character.name}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form name="myForm" onSubmit={handleSubmit} className='form_container'>
            <h3>Visible:</h3> 
            <input type="checkbox" name="visible" checked={check} onChange={handleCheck}/>

            <h3>Image:</h3>
            <input className='image' type="url" defaultValue={(character.image) ? character.image : ""} name="image"/>

            <h3>Icon:</h3>
            <input className='image' type="url" defaultValue={(character.icon) ? character.icon : ""} name="icon"/>

            <h3>Location:</h3>
            <input className='image' defaultValue={(character.location) ? character.location : ""} type="text" name="location"/>

            <h3>Job:</h3> 
            <input className='image' defaultValue={(character.job) ? character.job : ""} type="text" name="job"/>

            <h3>Description:</h3>
            <textarea name="description" className="text_area" defaultValue={(character.description) ? character.description : ""}/>

            <h3>All Notes:</h3>
            <textarea  className="text_area" type="text" defaultValue={(character.all_notes) ? breaker(character.all_notes) : ""} name="all_notes"/>

            <h3>Available Notes:</h3>
            <textarea  className="text_area" type="text" defaultValue={(character.available_notes) ? breaker(character.available_notes) : ""} name="available_notes"/>

            <input style={{marginTop: '15px'}}type="submit" value="Submit"/>
          </form>
          <form className="myForm" style={{textAlign:'center', marginTop: '15px'}} onSubmit={handleDelete}>
              <button type='submit'>Delete Character</button>
          </form>
        </AccordionDetails>
  </Accordion>
  );
}

export default AdminCharacterRow;
