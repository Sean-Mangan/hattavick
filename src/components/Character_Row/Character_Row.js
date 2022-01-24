import React from 'react';
import { Card, Button } from '@mui/material';

import "./Character_Row.css"



function Character_Row({character_data}) {

    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - (button.offsetLeft + radius)}px`;
        circle.style.top = `${event.clientY - (button.offsetTop + radius)}px`;
        circle.classList.add("ripple"); 
        const ripple = button.getElementsByClassName("ripple")[0];

        if (ripple) {
        ripple.remove();
        }

        button.appendChild(circle);
      }


    return (
        <div className='wrapper'>
            <Card variant="outlined" onClick={createRipple} className="row_wrapper button">
                <div className='icon_wrapper'>
                    <img className='npc_icon' src={character_data.icon} alt="character picture"/>
                </div>
                <div className='npc_data_wrapper'>
                    <h4 className='character_name'>{character_data.name}</h4>
                    <h4 className='character_header'>{character_data.location}</h4>
                    <p className='character_header blurb'>{character_data.blurb}</p>
                </div>
            </Card>
        </div>
    )
}

export default Character_Row
