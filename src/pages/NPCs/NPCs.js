import React from 'react';
import Character_Row from '../../components/Character_Row/Character_Row';
import { Grid, Hidden } from '@mui/material';
import Content_Wrapper from '../../components/Content_Wrapper/Content_Wrapper';

import './NPCs.css';

function NPCs() {

    const data = {
        name: "example name",
        icon: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.seekpng.com%2Fipng%2Fu2w7i1r5y3u2q8u2_rono-daniel-empty-profile-picture-icon%2F&psig=AOvVaw1HOr5ILqfgJtFoeBmBWU4X&ust=1642955658244000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCNCc__XkxfUCFQAAAAAdAAAAABAJ",
        title: "Example Title",
        location: "Example location",
        blurb: "This is an example blurb",
        background: ["blurb1", "blurb2", "blurb3"],
    }

    return (
        <Content_Wrapper>
            <div className="npc_wrapper">
                    <h3 className='npc_title'>NPC Overview</h3>
                    <Character_Row character_data={data}/>
            </div>
        </Content_Wrapper>
    )
}

export default NPCs
