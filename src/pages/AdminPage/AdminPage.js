import React, {useState, useEffect} from 'react';
import axios from 'axios';
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
    console.log(characters)
  },[]);

  return (
  <div>{characters.map((character)=> (<AdminCharacterRow character={character}/>))}</div>
  );
}

export default AdminPage;
