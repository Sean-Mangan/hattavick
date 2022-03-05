import React from 'react';
import { Button, Accordion, Typography, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './SessionRow.css';
import { width } from '@mui/system';

function SessionRow({session}) {

    function breaker(text){
        var result =""
        for (var i = 0; i < text.length-1; i++){
          result+=text[i]+"\n\n"
        }
        return result + text[i]
    }
    
    function debreaker(text){
        var wow = text.split("\n\n")
        var last = wow.pop()
        return wow
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
         {(session.data)
        ? (session.data).map((paragraph) => <p>{paragraph}</p>)
        : <p>Could not find data</p>
        }

    </AccordionDetails>
  </Accordion>
  )
}

export default SessionRow