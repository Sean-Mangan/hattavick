import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as BiIcons from 'react-icons/bi';

export const Nav_data = [
    {
        title: 'Home',
        path: '',
        icon: <FaIcons.FaHome/>,
        iconClosed: <RiIcons.RiArrowDownSFill/>,
        iconOpened: <RiIcons.RiArrowUpSFill/>,
    },
    {
        title: 'Characters',
        path: '#',
        icon: <BiIcons.BiGroup/>,
        iconClosed: <RiIcons.RiArrowDownSFill/>,
        iconOpened: <RiIcons.RiArrowUpSFill/>,
        subNav: [
            {
                title: 'My Character',
                path: 'characters/mycharacter',
                icon: <IoIcons.IoIosPerson/>,
            },
            {
                title: 'Party',
                path: 'characters/party',
                icon: <RiIcons.RiSwordFill/>,
            },
            {
                title: 'NPC\'s',
                path: 'characters/npcs',
                icon: <RiIcons.RiFileTextFill/>,
            }
        ]
    },
    {
        title: 'Lore',
        path: '#',
        icon: <FaIcons.FaBookOpen/>,
        iconClosed: <RiIcons.RiArrowDownSFill/>,
        iconOpened: <RiIcons.RiArrowUpSFill/>,
        subNav: [
            {
                title: 'World Lore',
                path: 'lore/worldlore',
                icon: <BiIcons.BiWorld/>,
            },
            {
                title: 'Factions',
                path: 'lore/factions',
                icon: <RiIcons.RiBuilding2Line/>,
            },
            {
                title: 'Locations',
                path: 'lore/locations',
                icon: <FaIcons.FaMapPin/>,
            },
            {
                title: 'Things',
                path: 'lore/things',
                icon: <RiIcons.RiTempHotFill/>,
            }
        ]
    },
    {
        title: 'Notes',
        path: '#',
        icon: <FaIcons.FaBattleNet/>,
        iconClosed: <RiIcons.RiArrowDownSFill/>,
        iconOpened: <RiIcons.RiArrowUpSFill/>,
        subNav: [
            {
                title: 'My Notes',
                path: 'notes/mynotes',
                icon: <IoIcons.IoIosStats/>,
            },
            {
                title: 'Sessions',
                path: 'notes/sessions',
                icon: <FaIcons.FaStickyNote/>,
            }

        ]
    },
    {
        title: 'Settings',
        path: 'settings',
        icon: <FaIcons.FaGlobeAmericas/>,
        iconClosed: <RiIcons.RiArrowDownSFill/>,
        iconOpened: <RiIcons.RiArrowUpSFill/>,
    }
]

export default Nav_data;