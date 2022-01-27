import React from 'react';
import { Card, Button } from '@mui/material';
import { Link } from 'react-router-dom';

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

      const not_there = "https://media.istockphoto.com/vectors/male-user-icon-vector-id517998264?k=20&m=517998264&s=612x612&w=0&h=pdEwtkJlZsIoYBVeO2Bo4jJN6lxOuifgjaH8uMIaHTU="



    return (
        <div className='wrapper'>
            <Link to={(character_data.name === "unknown") ? '#' : `/character/${character_data.name}`} style={{textDecoration:"none"}}>
                <Card variant="outlined" onClick={createRipple} className="row_wrapper button">
                    <div className='icon_wrapper'>
                        <img className='npc_icon' src={(character_data.icon) ? character_data.icon : not_there} alt="character picture"/>
                    </div>
                    <div className='npc_data_wrapper'>
                        <h4 className='character_name'>{(character_data.name === "unknown") ? 'Unknown Name' : character_data.name}</h4>
                        <h4 className='character_header'>{(character_data.location) ? character_data.location : "Unknown Location"}</h4>
                        <p className='character_header blurb'>{(character_data.description)? character_data.description.slice(0,240)+"..." : "You have not met this character yet"}</p>
                    </div>
                </Card>
            </Link>
        </div>
    )
}

export default Character_Row
