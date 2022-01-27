import React, {useState, useEffect}from 'react';
import Character_Row from '../../components/Character_Row/Character_Row';
import Content_Wrapper from '../../components/Content_Wrapper/Content_Wrapper';
import axios from 'axios';
import { uuid } from 'uuidv4';
import { get_npcpage_data } from '../../utils/queries';

import './NPCs.css';


function NPCs() {

    const [allCharacters, setAllCharacters] = useState([])
    const [characters, setCharacters] = useState([])
    const [name, setName] = useState('');
    const [overview, setOverview] = useState(false)

    var uri = 'https://f12u17d0a5.execute-api.us-east-1.amazonaws.com/dev/api/characters'

    async function get_characters(){
        try{
            var response = await axios.post(uri, {},
            {
                withCredentials: true,
                headers: { crossDomain: true, 'Content-Type': 'application/json' }
            })
            if (response.data){
                setAllCharacters(response.data);
                setCharacters(response.data)
            }
        }catch (err){
            console.log(err)
        }
    }

    useEffect(async () => {
        get_characters();
        var data = await get_npcpage_data()
        if (data){
            setOverview(data.data)
        }else{
            console.log("Can't get homepage data")
        }
    },[]);

    const filter = (e) => {

        const keyword = e.target.value;
    
        if (keyword !== '') {
            const results = allCharacters.filter((user) => {
            return user.name.toLowerCase().startsWith(keyword.toLowerCase()) && (user.name !== "unknown");
            // Use the toLowerCase() method to make it case-insensitive
            });
            setCharacters(results);
        } else {
            setCharacters(allCharacters);
            // If the text field is empty, show all users
        }
    
      setName(keyword);
    };



    return (

        
        <Content_Wrapper>
            <div className="npc_wrapper">
                <h3 className='npc_title'>NPC Overview</h3>
                {(overview) ?  <p className='npc_page_overview'>&emsp;{overview[0]}</p>: <></>}
                <br/>
                <br/>
                <div>
                    <input
                        className="npc_search"
                        type="search"
                        value={name}
                        onChange={filter}
                        placeholder="Search Name"
                    />
                    <div>
                        <br/>
                        {characters && characters.length > 0 ?  (
                            characters.map((character) => (<Character_Row key={uuid()} character_data={character}/>))) 
                            : (<h3>No results found!</h3>)
                        }
                    </div>
                </div>
            </div>
        </Content_Wrapper>
    )
}

export default NPCs
