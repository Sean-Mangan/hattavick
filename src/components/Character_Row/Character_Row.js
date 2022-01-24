import React from 'react';
import { Card, Button } from '@mui/material';

import "./Character_Row.css"

function Character_Row({character_data}) {
    return (
        <div className="button" onClick={()=>console.log(character_data.icon)}>
            <Card variant="outlined" className="row_wrapper">
                <div className='icon_wrapper'>
                    <img className='npc_icon' src={character_data.icon} alt="character picture"/>
                </div>
                <div className='npc_data_wrapper'>
                    <h3 className='character_header'>{character_data.name} - {character_data.title}</h3>
                    <h4 className='character_header'>{character_data.location}</h4>
                    <p className='character_header blurb'>{character_data.blurb}</p>
                </div>
            </Card>
        </div>
    )
}

export default Character_Row
