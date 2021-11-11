import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as BiIcons from 'react-icons/bi';

export const SideNav_data = [
    {
        title: 'My Character',
        path: '#',
        icon: <IoIcons.IoIosPerson/>,
        iconClosed: <RiIcons.RiArrowDownSFill/>,
        iconOpened: <RiIcons.RiArrowUpSFill/>,
        subNav: [
            {
                title: 'Stats',
                path: '/mycharacter/stats',
                icon: <IoIcons.IoIosStats/>,
            },
            {
                title: 'Backstory',
                path: '/mycharacter/backstory',
                icon: <BiIcons.BiHistory/>,
            }
        ]
    },
    {
        title: 'Characters',
        path: '#',
        icon: <BiIcons.BiGroup/>,
        iconClosed: <RiIcons.RiArrowDownSFill/>,
        iconOpened: <RiIcons.RiArrowUpSFill/>,
        subNav: [
            {
                title: 'Party',
                path: '/characters/party',
                icon: <RiIcons.RiSwordFill/>,
            },
            {
                title: 'NPC\'s',
                path: '/characters/npcs',
                icon: <RiIcons.RiFileTextFill/>,
            },
            {
                title: 'All',
                path: '/characters/all',
                icon: <BiIcons.BiAperture/>,
            }
        ]
    },
    {
        title: 'Setting',
        path: '#',
        icon: <FaIcons.FaMap/>,
        iconClosed: <RiIcons.RiArrowDownSFill/>,
        iconOpened: <RiIcons.RiArrowUpSFill/>,
        subNav: [
            {
                title: 'Locations',
                path: '/setting/locations',
                icon: <FaIcons.FaMapPin/>,
            },
            {
                title: 'Things',
                path: '/setting/things',
                icon: <RiIcons.RiTempHotFill/>,
            },
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
                path: '/lore/worldlore',
                icon: <BiIcons.BiWorld/>,
            },
            {
                title: 'Factions',
                path: '/lore/factions',
                icon: <RiIcons.RiBuilding2Line/>,
            },
        ]
    },
    {
        title: 'Sessions',
        path: '/sessions',
        icon: <FaIcons.FaBattleNet/>,
        iconClosed: <RiIcons.RiArrowDownSFill/>,
        iconOpened: <RiIcons.RiArrowUpSFill/>,
    }
]

export default SideNav_data;