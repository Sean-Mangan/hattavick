import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Content_Wrapper from '../../components/Content_Wrapper/Content_Wrapper';
import AdminCharacterRow from '../../components/AdminCharacterRow/AdminCharacterRow';

function AdminPage() {

  const [characters, setCharacters] = useState([])
  var uri = 'https://f12u17d0a5.execute-api.us-east-1.amazonaws.com/dev/api/allcharacters'

  async function get_characters(){
    try{
        var response = await axios.post(uri, {},
        {
            withCredentials: true,
            headers: { crossDomain: true, 'Content-Type': 'application/json' }
        })
        console.log(response.data)
        if (response.data){
            setCharacters(response.data);
        }
    }catch (err){
        console.log(err)
    }
  }

  useEffect(() => {
    get_characters();
  },[]);

  async function add_character(event){
    event.preventDefault();
    var new_data = {"name" : event.target.name.value}
    new_data.location =  ""
    new_data.visible = false
    new_data.icon = ''
    new_data.image = ''
    new_data.job = ''
    new_data.description = ''
    new_data.all_notes = []
    new_data.available_notes = []
    try{
      var response = await axios.post('https://f12u17d0a5.execute-api.us-east-1.amazonaws.com/dev/api/character', new_data,
      {
          withCredentials: true,
          headers: { crossDomain: true, 'Content-Type': 'application/json' }
      })
      get_characters()
      }catch (err){
          console.log(err)
      }
  }

  return (
    <Content_Wrapper>
      <div style={{minHeight:"100vh"}}>
        <h1 style={{textAlign:"center"}}> NPCS</h1>
        <form style={{textAlign:'center', paddingBottom:"15px"}} onSubmit={add_character}>
          Add Character: <input name="name" placeholder="character name" type="text"/>
          <button type='submit'> Submit </button>
        </form>
        {characters.map((character)=> (<AdminCharacterRow reload={get_characters} character={character}/>))}
      </div>
    </Content_Wrapper>
  );
}

export default AdminPage;
