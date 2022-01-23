import React, {useState}from 'react';
import Character_Row from '../../components/Character_Row/Character_Row';
import { Grid, Hidden } from '@mui/material';
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
    icon: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.seekpng.com%2Fipng%2Fu2w7i1r5y3u2q8u2_rono-daniel-empty-profile-picture-icon%2F&psig=AOvVaw1HOr5ILqfgJtFoeBmBWU4X&ust=1642955658244000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCNCc__XkxfUCFQAAAAAdAAAAABAJ",
    title: "Example Title",
    location: "Example location",
    blurb: "This is an example blurb",
    background: ["blurb1", "blurb2", "blurb3"],
    },
    {
    name: "Meriam",
    icon: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.seekpng.com%2Fipng%2Fu2w7i1r5y3u2q8u2_rono-daniel-empty-profile-picture-icon%2F&psig=AOvVaw1HOr5ILqfgJtFoeBmBWU4X&ust=1642955658244000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCNCc__XkxfUCFQAAAAAdAAAAABAJ",
    title: "Example Title",
    location: "Example location",
    blurb: "This is an example blurb",
    background: ["blurb1", "blurb2", "blurb3"], 
    },
    {
    name: "Steve",
    icon: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.seekpng.com%2Fipng%2Fu2w7i1r5y3u2q8u2_rono-daniel-empty-profile-picture-icon%2F&psig=AOvVaw1HOr5ILqfgJtFoeBmBWU4X&ust=1642955658244000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCNCc__XkxfUCFQAAAAAdAAAAABAJ",
    title: "Example Title",
    location: "Example location",
    blurb: "This is an example blurb",
    background: ["blurb1", "blurb2", "blurb3"], 
    },
    {
    name: "Alice",
    icon: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.seekpng.com%2Fipng%2Fu2w7i1r5y3u2q8u2_rono-daniel-empty-profile-picture-icon%2F&psig=AOvVaw1HOr5ILqfgJtFoeBmBWU4X&ust=1642955658244000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCNCc__XkxfUCFQAAAAAdAAAAABAJ",
    title: "Example Title",
    location: "Example location",
    blurb: "This is an example blurb",
    background: ["blurb1", "blurb2", "blurb3"], 
    },
    {
    name: "Scootie",
    icon: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.seekpng.com%2Fipng%2Fu2w7i1r5y3u2q8u2_rono-daniel-empty-profile-picture-icon%2F&psig=AOvVaw1HOr5ILqfgJtFoeBmBWU4X&ust=1642955658244000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCNCc__XkxfUCFQAAAAAdAAAAABAJ",
    title: "Example Title",
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
                        {foundUsers && foundUsers.length > 0 ? (
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
