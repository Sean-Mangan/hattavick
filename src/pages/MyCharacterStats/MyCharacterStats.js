import React, {useState, useEffect} from 'react';
import axios from 'axios';

const MyCharacterStats = () => {

    var [character, setCharacter] = useState({name: 'penis'});

    useEffect(() => {

        axios.get('https://f12u17d0a5.execute-api.us-east-1.amazonaws.com/dev/characters')
          .then(res => {
            setCharacter(res.data.message);
          })
      }, [])

    return (
        <div style={{textAlign: 'center'}}>
        </div>
    )
}

export default MyCharacterStats
