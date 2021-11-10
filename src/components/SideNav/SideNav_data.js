import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';

export const SideNav_data = [
    {
        title: 'My Character',
        path: '#',
        icon: <AiIcons.AiFillHome/>,
        iconClosed: <RiIcons.RiArrowDownSFill/>,
        iconOpened: <RiIcons.RiArrowUpSFill/>,
        subNav: [
            {
                title: 'Stats',
                path: '/mycharacter/stats',
                icon: <IoIcons.IoIosPaper/>,
            },
            {
                title: 'Backstory',
                path: '/mycharacter/backstory',
                icon: <IoIcons.IoIosAirplane/>,
            }
        ]
    },
    {
        title: 'Characters',
        path: '#',
        icon: <AiIcons.AiFillRocket/>,
        iconClosed: <RiIcons.RiArrowDownSFill/>,
        iconOpened: <RiIcons.RiArrowUpSFill/>,
        subNav: [
            {
                title: 'Party',
                path: '/characters/party',
                icon: <IoIcons.IoIosAlarm/>,
            },
            {
                title: 'NPC\'s',
                path: '/characters/npcs',
                icon: <IoIcons.IoIosAnalytics/>,
            },
            {
                title: 'All',
                path: '/characters/all',
                icon: <IoIcons.IoIosAperture/>,
            }
        ]
    },
    {
        title: 'Setting',
        path: '#',
        icon: <FaIcons.FaCartPlus/>,
        iconClosed: <RiIcons.RiArrowDownSFill/>,
        iconOpened: <RiIcons.RiArrowUpSFill/>,
        subNav: [
            {
                title: 'Locations',
                path: '/setting/locations',
                icon: <IoIcons.IoIosAlarm/>,
            },
            {
                title: 'Things',
                path: '/setting/things',
                icon: <IoIcons.IoIosAnalytics/>,
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