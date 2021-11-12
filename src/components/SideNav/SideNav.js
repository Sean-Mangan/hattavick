import React, {useEffect, useState, useRef} from "react";
import {Link} from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import SideNav_data from '../SideNav/SideNav_data';
import SubMenu from "../SubMenu/SubMenu";

import './SideNav.css';


function SideNav() {

    //Define ref for side menu and css value for left
    // Such that the menu is not on screen
    const wrapperRef = useRef(null);
    const [sideBar, setSideBar] = useState( '-100%');

    // Adds an event listener to the dom for an onclick method
    useEffect(() => {
        document.addEventListener("click", handleClickOutside, false);
        return () => {
            document.removeEventListener("click", handleClickOutside, false);
            };
    }, []);

    // Function that will switch between 0 and 11% for the sidenav left value
    const showSidebar = () => {
        setSideBar((sideBar==='0') ? '-100%' : '0');
    };

    // On a outside click close the menu
    const handleClickOutside = event => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
          setSideBar('-100%');
        }
      };

    //render function
    return (
        <div ref={wrapperRef}>
            <div className='nav-content'>
                <Link className='nav-link' to='#'>
                    <FaIcons.FaBars className='red-icon' onClick={showSidebar}/>
                </Link>
                <div className='title_wrapper'>
                    <Link to='/'>
                        <h3 className='red-title'>Hattavick</h3>
                    </Link>
                </div>
            </div>
            <nav className='nav-sidebar' style={{left: sideBar}}>
                <div className='nav-div-sidebar'>
                    <Link className='nav-link' to='#'>
                        <AiIcons.AiOutlineClose className='red-icon' onClick={showSidebar}/>
                    </Link>
                    <div className='menu_wrapper'>
                        {SideNav_data.map((item, idx) =>{
                            return <SubMenu item={item} key={idx}/>;
                        })}
                    </div>
                </div>
            </nav>  
        </div>
    )
};

export default SideNav;
