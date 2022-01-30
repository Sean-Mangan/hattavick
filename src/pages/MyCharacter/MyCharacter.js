import { Typography, Paper, Button } from '@mui/material';
import React from 'react';
import Content_Wrapper from '../../components/Content_Wrapper/Content_Wrapper';
import "./MyCharacter.css"
import TextareaAutosize from "react-autosize-textarea"

const character= {
    player_name: "Beth Lilygren",
    character_name: "Kuligall The Great",
    backstory: ["Kuligall was born into a nomadic orc clan that traveled the wilds of the north. From a young age, he always had an affinity with nature in general, and animals more specifically. The clans' resident druid took him under her wing after she found him talking with animals, and started teaching him what she knew.","But this life could not last for long.","    A group of cultists that worshiped a primordial evil had poisoned the local water supply, causing all of the clan members to fall into an enchanted sleep... All that is, except for the druid and her apprentice, since they had some resistance to the posion.","    The cultists came into the camp, gathering everyone they could find into a ritual circle that they carved out, and then they started chanting. A dark portal opened overhead as the druids watched, helpless to do a thing since the poison had the side effect of blocking off the flow of all magic. Tendrils of dark energies flowed out from the portal, tethering to all present, orc and cultist alike, with a larger tendril being attached to the young Kuligall.","    As the life could be seen being drained from all present, The young half-orc could hear a deep, resonant voice echoing inside of his mind, telling him how it was going to take control of his body and bring a reign of terror down on the world like it had never known before.","    At this moment, something snapped inside of the youngling, and he ripped the tendril asunder, not noticing as some squirmed into his forehead. All of this left him alone with his dead clansmen and enemies.He did not know, though, that the snapped tendril had left a portion of the old one in his mind, just waiting for the time that it could take over and be free..." ,"    Since then, he has traveled south from the frozen northlands that stretch further than the  furthest dale's, and has recently heard of a clan of goblins that have been ambushing people near Neverwinter, and has decided that he shall pay this clan a 'visit'..."],
    public : ["Example1, Example2"],
    description : "Shaggy has a characteristic speech pattern which is marked by his frequent use of the filler word 'like'. He also sports a rough goatee. His signature attire consists of a green v-neck T-shirt and maroon or brown bell-bottom pants, both of which fit loosely. In The 13 Ghosts of Scooby-Doo and early made-for-TV films, he wore a red v-neck and blue jeans.",
    image: "https://arcaneeye.com/wp-content/uploads/2021/01/Goliath2.jpg"
}

function MyCharacter() {

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

  return (
      <Content_Wrapper>
          <div className="mycharacter_wrapper" style={{minHeight:'100vh'}}>
                <h1 style={{textAlign: "center", marginTop: "3vh", fontSize:"48px", marginBottom: "0"}}>
                  {(character.character_name) ? character.character_name : "No Name"} 
                </h1>
                <h3 style={{textAlign: "center", paddingTop:"10px", paddingBottom:"30px"}}>
                    Player: {(character.player_name) ? character.player_name : "Unknown"}
                </h3>
                <img className="character_image" src={(character.image) ? character.image : "https://media.istockphoto.com/vectors/male-user-icon-vector-id517998264?k=20&m=517998264&s=612x612&w=0&h=pdEwtkJlZsIoYBVeO2Bo4jJN6lxOuifgjaH8uMIaHTU="} />
                
                <Typography className='character_description'>
                    {(character.description) ? <i>{character.description}</i> : "There is no description"}
                </Typography>
                <h3 className='backstory_title'>Backstory</h3>
                <Paper elevation={10} className='backstory_wrapper'>
                    <TextareaAutosize className="backstory" defaultValue={(character.backstory) ? breaker(character.backstory) : "No Backstory"} readOnly/>
                </Paper>
                {/* <button className='edit_button'>Edit Page</button> */}
                <Button size="large" variant="contained" color="error" style={{margin:'30px'}}>
                    Edit Page
                </Button>
          </div>
      </Content_Wrapper>
  )
}

export default MyCharacter;
