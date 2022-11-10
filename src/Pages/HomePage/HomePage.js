import { Paper } from '@mui/material'
import React from 'react'
import "./HomePage.css"


function HomePage() {

    return (
        <div className='home_wrapper'>
            <h1>Hattavick Initial Launch!</h1>
            <div>
                <div className="home_content">
                    <img className="home_image" src="https://i.pinimg.com/originals/db/b6/a4/dbb6a4485cd2b9d570a83fa6bf3a5cda.gif"/>
                    <Paper className="home_outline_wrapper" elevation={6}>
                        <a className='home_outline_text'>
                            <strong>
                                One stop shop for all things lore for your new Table Top RPG game!
                            </strong>
                        </a>
                        <p>Login to get started writing your first campaign</p>
                    </Paper>
                </div>
                <Paper elevation={6} className="main_changelog">
                    <h1>Changelog</h1>
                    <p style={{textAlign:"center"}}>
                        <strong><i>10-30-2022:</i></strong>
                    </p>
                    <p>
                        We just had our initial launch! A bunch of 'initial' stuff was added including login functionality, 
                        email utilites and basic campaign functionality (create/invite/join/etc). We are still working on defining our style
                        so things like font and color are subject to change. Admittedly There is a bunch left to do. Not all of the main 
                        pages have been created (see the contact page). Most of the main application to show campaign data is already implemented
                        but still requires a bit of work due to changes in the database.
                    </p>
                    <p>
                        Future changes should include main pages (contact) as well as a naive implementation for the basic user interface for 
                        displaying campaign information. Also the style should hopefully be more defined. Thanks for checking in! -Sean
                    </p>
                </Paper>
            </div>
        </div>
    )
}

export default HomePage