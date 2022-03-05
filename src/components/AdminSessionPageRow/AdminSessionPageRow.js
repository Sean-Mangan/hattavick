import React from 'react'
import { Button, Accordion, Typography, AccordionDetails, AccordionSummary} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import TextareaAutosize from "react-autosize-textarea"

import { uuid } from 'uuidv4';


function AdminSessionPageRow({session, reload}) {

  function breaker(text){
    var result =""
    for (let i = 0; i < text.length; i++){
      result+=text[i]+"\n\n"
    }
    return result
  }

  function debreaker(text){
    var wow = text.split("\n\n")
    return wow
}

  var uri = 'https://f12u17d0a5.execute-api.us-east-1.amazonaws.com/dev/api/sessions'


  const delete_row = async (event) => {
    event.preventDefault();
    const certain_row = {"data":{
      "_id": session._id
    }}
    try{
      var response = await axios.delete(uri, certain_row,
      {
          withCredentials: true,
          headers: { crossDomain: true, 'Content-Type': 'application/json' }
      })
      reload()
    }catch (err){
        console.log(err)
    }
  };

  const handle_Submit = async (event) => {
    event.preventDefault();
    // const new_data = {
    //   title : (event.target.title.value) ? event.target.title.value: "No title",
    //   date : (event.target.date.value) ? event.target.date.value: "",
    //   data : (event.target.data.value) ? debreaker(event.target.data.value) : [],
    //   "_id": session._id
    // }
    const new_data = {
      "_id": session._id,
      title : (event.target.title.value) ? event.target.title.value: "No title",
      date : (event.target.date.value) ? event.target.date.value: "",
      data : (event.target.data.value) ? debreaker(event.target.data.value) : [],
    }
    var response = await axios.put(uri, new_data,
      {
          withCredentials: true,
          headers: { crossDomain: true, 'Content-Type': 'application/json' }
      })
      if(response){
        reload()
      }
    }

  return (
    <Accordion style={{border: "1px solid grey"}}>
    <AccordionSummary
    expandIcon={<ExpandMoreIcon />}
    aria-controls="panel1bh-content"
    id="panel1bh-header">
        <h3 style={{padding:"0", margin:"0", width:'100%'}}>
          {(session.title) ? session.title : "None"} 
        </h3>
    </AccordionSummary>
    <AccordionDetails>
      <form name="myForm" style={{textAlign:'left'}}onSubmit={handle_Submit} className='form_container'>
        <h3>Title:</h3>
        <TextareaAutosize 
                name="title"
                defaultValue={(session.title) ? session.title : "No Title"}
                className='edit_content'
                key={uuid()}/>
        <h3>Date:</h3>
        <TextareaAutosize 
        name="date"
        defaultValue={(session.date) ? session.date : "no date"}
        className='edit_content'
        key={uuid()}/>
        <br/>
        <TextareaAutosize 
                  name="data"
                  style={{border: '2px solid black', marginTop: '15px'}}
                  className='edit_content'
                  defaultValue={(session.data) ? breaker(session.data) : "No data"}
                  key={uuid()}/>
          <div style={{textAlign: 'left', marginTop:"10px"}}>
            <Button type="submit" size="small" variant="contained" color="error" onClick={delete_row}> Delete Row </Button>
            <Button style={{marginLeft: '15px'}} type="submit" size="small" variant="contained" color="error">
              {"Save Changes"}
            </Button>
          </div>
      </form>
    </AccordionDetails>
  </Accordion>
  )
}

export default AdminSessionPageRow