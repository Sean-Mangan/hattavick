import { Typography, Paper, Button } from '@mui/material';
import React, {useState, useEffect} from 'react';
import Content_Wrapper from '../../components/Content_Wrapper/Content_Wrapper';
import "./MyCharacter.css"
import axios from 'axios';
import TextareaAutosize from "react-autosize-textarea"
import {get_pc_data} from '../../utils/queries'

function MyCharacter() {

    const [edit, setEdit] = useState(true)
    const [character, setCharacter] = useState({})
    var uri = 'https://f12u17d0a5.execute-api.us-east-1.amazonaws.com/dev/api/player_character'


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

    useEffect(async ()=>{
        var char = await get_pc_data()
        console.log(char.character_name)
        setCharacter(char)
    }, [])

    async function get_pc(){
        try{
        var response = await axios.get(uri,
        {
            withCredentials: true,
            headers: { crossDomain: true, 'Content-Type': 'application/json' }
        })
        if(response.data){
            setCharacter(response.data)
        }else{
            console.log("Can't get character data")
        }
        }catch (err){
            console.log(err)
        }
    }

      const handleClick = async (event) => {
        event.preventDefault();
        if (!edit){
            var new_data = {
                "player_name" : character.player_name,
                "image": event.target.char_image.value,
                "description": event.target.char_description.value,
                "backstory" : debreaker(event.target.char_backstory.value+ "\n\n"),
                "public": [],
                "character_name":event.target.char_name.value,
            }

            try{
            var response = await axios.put(uri, new_data,
            {
                withCredentials: true,
                headers: { crossDomain: true, 'Content-Type': 'application/json' }
            })
            }catch (err){
                console.log(err)
            }
            setEdit(!edit)
        }else{
            setEdit(!edit)
        }
      };

  return (
      <Content_Wrapper>
          <form onSubmit={handleClick}>
            <div className="mycharacter_wrapper" style={{minHeight:'100vh'}}>
                    <TextareaAutosize
                    defaultValue={(character.character_name) ? character.character_name : "No Name"}
                    className='char_title'
                    key={(character.character_name) ? character.character_name : "No Name"}
                    style={{
                        textAlign: "center", 
                        marginTop: "3vh", 
                        fontSize:"48px", 
                        marginBottom: "0",
                        marginLeft: "0",
                        border: (edit) ? "none" : '1px solid black' 
                    }}
                    name="char_name"
                    disabled={edit}
                    />
                    <h3 style={{textAlign: "center", paddingTop:"10px", paddingBottom:"30px"}}>
                        Player: {(character.player_name) ? character.player_name : "Unknown"}
                    </h3>
                    <img className="character_image" src={(character.image) ? character.image : "https://media.istockphoto.com/vectors/male-user-icon-vector-id517998264?k=20&m=517998264&s=612x612&w=0&h=pdEwtkJlZsIoYBVeO2Bo4jJN6lxOuifgjaH8uMIaHTU="} />
                    <h3 style={{marginTop:"30px"}} hidden={edit}>Character Image Link</h3>
                    <input 
                    name="char_image"
                    style={{marginTop: "0", padding:"10px", width:"75%"}}type="url" 
                    defaultValue={(character.image) ? character.image : ''} 
                    hidden={edit}/>
                    <h3 style={{marginTop:"30px", paddingBottom:"0"}} hidden={edit}>Description</h3>
                    <Typography className='character_description'>
                        <TextareaAutosize 
                        name="char_description"
                        className="description"
                        defaultValue={(character.description) ? character.description : "No Description"} 
                        key={(character.description) ? character.description : "No Description"} 
                        style={{border: (edit) ? "none" : '1px solid black', padding: (!edit) ? "15px 0 30px" : "30px 0 15px"}}
                        disabled={edit}/>
                    </Typography>
                    <h3 className='backstory_title'>Backstory</h3>
                    <Paper elevation={10} className='backstory_wrapper'>
                        <TextareaAutosize 
                        name="char_backstory"
                        style={{border: (edit) ? "none" : '1px solid black'}}
                        className="backstory" 
                        key={(character.backstory) ? breaker(character.backstory) : "No Backstory"} 
                        defaultValue={(character.backstory) ? breaker(character.backstory) : "No Backstory"} 
                        disabled={edit}/>
                    </Paper>
                    <Button type="submit" size="large" variant="contained" color="error" style={{margin:'30px'}}>
                        {(edit) ? "Edit Page" : "Submit Changes"}
                    </Button>
            </div>
          </form>
      </Content_Wrapper>
  )
}

export default MyCharacter;
