import { Button, Paper } from '@mui/material'
import React from 'react'
import "./HomePage.css"


function HomePage() {

    return (
        <div className='home_wrapper'>
            <h1>Hattavick Info and Updates</h1>
            <div>
                <div className="home_content">
                    <img className="home_image" alt="" src="https://i.pinimg.com/originals/db/b6/a4/dbb6a4485cd2b9d570a83fa6bf3a5cda.gif"/>
                    <Paper className="home_outline_wrapper" elevation={6}>
                        <div className='home_outline_text'>
                            <strong>
                                One stop shop for all things lore for your new Table Top RPG game!
                            </strong>
                        </div>
                        <p>
                            To get started with your first campaign, first login or create an account and click on the campaign menu!
                            From there you can start to create your campaign and invite your friends to join once its complete! 
                        </p>
                        <br/>
                        <Button 
                        variant='contained'
                        href="https://discord.gg/nUcFjPY6s2" 
                        target="_blank"
                        ><strong>Join the Discord!</strong></Button>
                   </Paper>
                </div>
                <Paper elevation={6} className="main_changelog">
                    <h1 style={{textAlign:"center"}}>Changelog</h1>

                    <p style={{textAlign:"left", paddingTop: "1em", fontSize: "18px"}}>
                        <strong>Email Automation and Security: <i>November 15, 2023</i></strong>
                    </p>
                    <p>
                        Hey there! Its been a busy couple of months and some change to design philosophy! To get to a workable product I have spent more
                        time working on functionality other than style. This has mainly been to the registration and login pages. Now we have a terms of 
                        service and a privacy policy as well as some bot protection. Lastly we have some email automation to ensure that the owner of the
                        email is the one registering for the account.
                    </p>
                    <p>
                        Finally we have some game launch changes. Now you can kick people from your game and manage players much easier! I am also working 
                        on a new 'marketplace' feature which should allow you to duplicate your campaign so other parties can use the lore you have already
                        written! This may take some time however since this will involve a good amount of work on the backend. That said, I should hopefully 
                        have that up on the next release!
                    </p>
                    <p>
                        I've also settled on delaying some of the style and design changes for a while. It doesn't seem of use at the moment since I 
                        am constantly adding new pages and features. So I figured a style update would be more beneficial after the core functionality is
                        done! -Sean
                    </p>

                    <p style={{textAlign:"left", paddingTop: "1em", fontSize: "18px"}}>
                        <strong>Backend Changes and Caching: <i>July 10, 2023</i></strong>
                    </p>
                    <p>
                        Hey there! It's been a while. I have admittedly been a bit preoccupied with some other things, but am back at it!
                        This most recent batch of changes included a bunch of backend stuff that you will not likely notice. This includes client-side
                        caching. The benefit of this caching results in minimal loading times and having the most current data at all times.
                        Other improvements include better error messages and loading screens. Any update/creation/deletion that fails will 
                        now result in a loading screen while the update is happening, and an error message if it fails. Finally the last 
                        update includes some form validation so that the maximum size of any item (npc, lore item, etc) cannot be have more
                        than 16kb in text and 30mb in images.
                    </p>
                    <p>
                        Super happy to get these changes in place, but there is still a lot more work to be done. After these caching
                        changes I think the backend should be set for a while but there is still much to do in terms of making the user
                        interface a bit better. I am hoping to make some color changes, font changes, etc, soon. Super excited to
                        get back to work! -Sean
                    </p>

                    <p style={{textAlign:"left", paddingTop: "1em", fontSize: "18px"}}>
                        <strong>Initial Functionality: <i>October 30, 2022</i></strong>
                    </p>
                    <p>
                        We just had our initial launch! A bunch of 'initial' stuff was added including login functionality, 
                        email utilities and basic campaign functionality (create/invite/join/etc). We are still working on defining our style
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