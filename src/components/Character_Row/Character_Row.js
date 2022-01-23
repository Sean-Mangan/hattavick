import React from 'react';

function Character_Row({character_data}) {
    return (
        <div onClick={()=>console.log(character_data.name)}>
            {character_data.name}
        </div>
    )
}

export default Character_Row
