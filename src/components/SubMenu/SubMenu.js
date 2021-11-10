import React, {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import './SubMenu.css';


function SubMenu({item}) {
    const [subnav, setSubnav] = useState(false);

    const showSubnav=()=> setSubnav(!subnav);


    return (
        <div>
            <Link onClick={item.subNav && showSubnav}
            to={item.path} 
            className='submenu_link'>
                <div>
                    {item.icon}
                    <span className='submenu_label'>{item.title}</span>
                </div>
                <div>
                    {item.subNav && subnav 
                    ? item.iconOpened 
                    : item.subNav
                    ? item.iconClosed 
                    : null}
                </div>
            </Link>
            {subnav && item.subNav.map((item, idx)=> {
                return (
                    <Link to={item.path} className='dropdown_link'>
                        {item.icon}
                        <span className='dropdown_label'>
                            {item.title}
                        </span>
                    </Link>
                )
            })}
        </div>
    )
}

export default SubMenu
