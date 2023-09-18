import React, {useState} from 'react';
import {Link, useOutletContext, useParams} from 'react-router-dom';
import './SubMenu.css';


function SubMenu({item, onclick}) {

    const [subnav, setSubnav] = useState(false);
    const showSubnav = () => setSubnav(!subnav);
    const {campaignId} = useParams()

    const {isAdmin} = useOutletContext()
    
    return (
        <div>
            <Link onClick={(item.subNav) ? showSubnav : onclick}
            to={(item.path !== "#") ? `/campaign/${campaignId}/${item.path}` : "#"}
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
                
                return ((item.title === 'My Character' && isAdmin) ? <></> :
                    (
                        <div onClick={onclick} key={item.title}>
                            <Link to={(item.path !== "#") ? `/campaign/${campaignId}/${item.path}` : "#"}  className='dropdown_link'>
                                {item.icon}
                                <span className='dropdown_label'>
                                    {item.title}
                                </span>
                            </Link>
                        </div>
                )
                )
            })}
        </div>
    )
}

export default SubMenu
