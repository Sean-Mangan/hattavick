import React, {useState, useEffect} from 'react';
import axios from 'axios';

const MyCharacterStats = () => {

    var [character, setCharacter] = useState();

    useEffect(() => {

        axios.get('https://f12u17d0a5.execute-api.us-east-1.amazonaws.com/dev/characters')
          .then(res => {
            setCharacter(res.data.message);
          })
      }, [])

    return (
        <div style={{textAlign: 'center'}}>
            <h1> My Character is {(character) ? character.name : ''} </h1>
            <h3>My Characters description is {(character) ? character.description : ''}</h3>
        </div>
    )
}

export default MyCharacterStats
