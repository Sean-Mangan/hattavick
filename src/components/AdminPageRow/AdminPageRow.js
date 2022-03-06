import React from 'react';
import { Accordion, Typography, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

function AdminPageRow({reload, page}) {

    var uri = 'https://f12u17d0a5.execute-api.us-east-1.amazonaws.com/dev/api/page'


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

    const handle_submit = async (event) => {
        event.preventDefault();
        var new_data = {
                "data": debreaker(event.target.page_data.value),
                "page" : page.page,
                "img" : event.target.image.value
        }
        console.log(new_data)
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
            {page.page}
            </Typography>
        </AccordionSummary>
        <AccordionDetails>
            <form onSubmit={handle_submit}>
              <h3>Overview:</h3>
                <textarea  className="text_area" type="text" defaultValue={(page.data) ? breaker(page.data) : ""} name="page_data"/>
              <h3>Image</h3>
                <textarea  className="text_area" style={{height:'15px', marginBottom:'10px'}} type="text" defaultValue={(page.img) ? page.img : ""} name="image"/>
                <button type="submit" value="Submit"> Submit </button>
            </form>
        </AccordionDetails>
    </Accordion>
  );

}

export default AdminPageRow;
