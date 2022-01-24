import React, {useState}from 'react';
import Character_Row from '../../components/Character_Row/Character_Row';
import Content_Wrapper from '../../components/Content_Wrapper/Content_Wrapper';

import './NPCs.css';

// This holds a list of some fiction people
// Some  have the same name but different age and id
const USERS = [
    { id: 1, name: 'Andy', age: 32 },
    { id: 2, name: 'Bob', age: 30 },
    { id: 3, name: 'Tom Hulk', age: 40 },
    { id: 4, name: 'Tom Hank', age: 50 },
    { id: 5, name: 'Audra', age: 30 },
    { id: 6, name: 'Anna', age: 68 },
    { id: 7, name: 'Tom', age: 34 },
    { id: 8, name: 'Tom Riddle', age: 28 },
    { id: 9, name: 'Bolo', age: 23 },
  ];

const characters = [
    {
    name: "Mike",
    icon : "https://media.istockphoto.com/vectors/male-user-icon-vector-id517998264?k=20&m=517998264&s=612x612&w=0&h=pdEwtkJlZsIoYBVeO2Bo4jJN6lxOuifgjaH8uMIaHTU=",
    title: "Example Title",
    location: "Example location",
    blurb: "This is an example blurb",
    background: ["blurb1", "blurb2", "blurb3"],
    },
    {
    name: "Meriam \"Six-Shot\" Jonstantine",
    icon : "https://media.istockphoto.com/vectors/male-user-icon-vector-id517998264?k=20&m=517998264&s=612x612&w=0&h=pdEwtkJlZsIoYBVeO2Bo4jJN6lxOuifgjaH8uMIaHTU=",
    title: "Example Title",
    location: "Example location",
    blurb: "This is an example blurb an example blurb an example blurb an example blurb an example blurb an example blurb an example blurb an example blurb an example blurb an example blurb an example blurb an example blurb an example blurb end",
    background: ["blurb1", "blurb2", "blurb3"], 
    },
    {
    name: "Steve",
    icon : "https://media.istockphoto.com/vectors/male-user-icon-vector-id517998264?k=20&m=517998264&s=612x612&w=0&h=pdEwtkJlZsIoYBVeO2Bo4jJN6lxOuifgjaH8uMIaHTU=",
    title: "Example Title",
    location: "Example location",
    blurb: "This is an example blurb",
    background: ["blurb1", "blurb2", "blurb3"], 
    },
    {
    name: "Alice",
    icon : "https://media.istockphoto.com/vectors/male-user-icon-vector-id517998264?k=20&m=517998264&s=612x612&w=0&h=pdEwtkJlZsIoYBVeO2Bo4jJN6lxOuifgjaH8uMIaHTU=",
    title: "Example Title",
    location: "Example location",
    blurb: "This is an example blurb",
    background: ["blurb1", "blurb2", "blurb3"], 
    },
    {
    name: "Scootie",
    icon : "https://media.istockphoto.com/vectors/male-user-icon-vector-id517998264?k=20&m=517998264&s=612x612&w=0&h=pdEwtkJlZsIoYBVeO2Bo4jJN6lxOuifgjaH8uMIaHTU=",
    location: "Example location",
    blurb: "This is an example blurb",
    background: ["blurb1", "blurb2", "blurb3"], 
    }
]

function NPCs() {

    const [name, setName] = useState('');

    // the search result
    const [foundUsers, setFoundUsers] = useState(characters);
  
    const filter = (e) => {

        const keyword = e.target.value;
    
        if (keyword !== '') {
            const results = characters.filter((user) => {
            return user.name.toLowerCase().startsWith(keyword.toLowerCase());
            // Use the toLowerCase() method to make it case-insensitive
            });
            setFoundUsers(results);
        } else {
            setFoundUsers(characters);
            // If the text field is empty, show all users
        }
    
      setName(keyword);
    };



    return (

        
        <Content_Wrapper>
            <div className="npc_wrapper">
                <h3 className='npc_title'>NPC Overview</h3>
                <div>
                    <input
                        type="search"
                        value={name}
                        onChange={filter}
                        className="input"
                        placeholder="Search Name"
                    />
                    <div>
                        <br/>
                        {foundUsers && foundUsers.length > 0 ?  (
                            foundUsers.map((character) => (<Character_Row key={character.name} character_data={character}/>))) 
                            : (<h3>No results found!</h3>)
                        }
                    </div>
                </div>
            </div>
        </Content_Wrapper>
    )
}

export default NPCs
