import React, {useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';

import './SideNav.css';
import { Typography } from "@mui/material";

function SideNav() {
    const [sideBar, setSideBar] = useState('-100%');

    const showSidebar = () => {
        console.log(sideBar)
        setSideBar((sideBar==='0') ? '-100%' : '0');
    };

    return (
        <>
            <div className='nav-content'>
                <Link className='nav-link' to='#'>
                    <FaIcons.FaBars className='red-icon' onClick={showSidebar}/>
                </Link>
                <Link to='home'>
                    <h3 className='red-title'>Hattavick</h3>
                </Link>
            </div>
            <nav className='nav-sidebar' style={{left: sideBar}}>
                <div className='nav-div-sidebar'>
                    <Link className='nav-link' to='#'>
                        <AiIcons.AiOutlineClose className='red-icon' onClick={showSidebar}/>
                    </Link>
                </div>
            </nav>  
        </>
    )
};

export default SideNav;
