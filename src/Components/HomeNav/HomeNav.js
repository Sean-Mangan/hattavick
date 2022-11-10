import React, { useRef } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './HomeNav.css';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { Link } from 'react-router-dom';


function HomeNav({campaigns, loggedIn}) {

    const navRef = useRef();
    const axiosPrivate = useAxiosPrivate()
    const {auth, setAuth} = useAuth();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const campaign_list = campaigns["owner"].concat(campaigns["admin"], campaigns["player"]).filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.id === value.id && t.name === value.name
        ))
    )

    const showNavBar = () =>{
        navRef.current.classList.toggle("responsive_nav")
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    function logout() {
        axiosPrivate.get("/logout").then(() => {
            setAuth({access_token: null})
            window.location.href= "/"
        }
        ).catch((err) =>
            console.log(err)
        )
    }

    return (
        <div className="main_nav_wrapper">
            <div className="red_title">Hattavick</div>
            <nav ref={navRef}>
                <Link to='/' style={{textDecoration:"None", color: "white"}}><div className="nav_link" >Home</div></Link>
                <br/>
                <Link to='/contact' style={{textDecoration:"None", color: "white"}}><div className="nav_link" >Contact</div></Link>
                <br/>
                {(loggedIn)
                    ? <>
                        <a className="nav_link" onClick={() => {logout()}}>Logout</a>
                        &nbsp;
                        <Button
                        id="demo-positioned-button"
                        aria-controls={open ? 'demo-positioned-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        variant="contained"
                        color="error"
                        endIcon={<KeyboardArrowDownIcon/>}
                        className="nav_link"
                        style={{fontFamily: '"Times New Roman", Times, serif', fontSize: "1.2rem"}}
                        >
                        Campaigns
                        </Button>
                        <Menu
                        id="demo-positioned-menu"
                        aria-labelledby="demo-positioned-button"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        >
                        {campaign_list.map((campaign) => { return (
                            <Link style={{textDecoration:"None", color: "black"}} key={campaign.id} to={`/campaign/${campaign.id}`} >
                                <MenuItem>
                                    {campaign.name}
                                </MenuItem>
                            </Link>
                        )})}
                            <Link to='/create' style={{textDecoration:"None", color: "black"}}>
                                <MenuItem >
                                    <strong>+ New Campaign</strong>
                                </MenuItem>
                            </Link>
                        </Menu>
                    </>
                    :<Button 
                        onClick={() => window.location.href="/login"}
                        variant="contained"
                        color="error"
                        style={{fontFamily: '"Times New Roman", Times, serif', fontSize: "1.2rem", textDecoration:"None"}}
                        >
                        Login
                    </Button>
                }
                <Button 
                className="nav_btn nav_close_btn"
                onClick={showNavBar}
                endIcon={<CloseIcon style={{fontSize: 'min(10vw, 48px)', fontWeight:"bold"}}/>} />
            </nav>
            <Button 
            className="nav_btn"
            onClick={showNavBar}
            endIcon={<MenuIcon style={{fontSize: 'min(10vw, 48px)', fontWeight:"bold"}}/>} />
        </div>    
    )

};

export default HomeNav;
