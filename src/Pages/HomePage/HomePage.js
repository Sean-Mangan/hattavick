import { Button, Paper } from '@mui/material';
import React from 'react';
import "./HomePage.css";

function HomePage() {
    return (
        <main className="home_wrapper">
            <header className="home_header">
                <h1>Hattavick - D&D and TTRPG Campaign Manager</h1>
                <p>Your ultimate tool for managing lore, campaigns, and party collaboration in tabletop RPGs.</p>
            </header>
            <section className="home_content">
                <img 
                    className="home_image" 
                    alt="Animated dice rolling for tabletop RPGs" 
                    src="https://i.pinimg.com/originals/db/b6/a4/dbb6a4485cd2b9d570a83fa6bf3a5cda.gif" 
                />
                <Paper className="home_outline_wrapper" elevation={6}>
                    <div className="home_outline_text">
                        <strong>
                            One-stop shop for all things lore for your new Tabletop RPG game!
                        </strong>
                    </div>
                    <p>
                        To get started with your first campaign, log in or create an account. Then, click on the campaign menu to begin creating your campaign. Once complete, invite your friends to join and collaborate!
                    </p>
                    <Button 
                        variant="contained" 
                        href="https://discord.gg/nUcFjPY6s2" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="home_button"
                    >
                        <strong>Join the Discord!</strong>
                    </Button>
                </Paper>
            </section>
            <section className="main_changelog">
                <h2 className="changelog_title">Changelog</h2>

                <article className="changelog_entry">
                    <h3>Email Automation and Security: <time dateTime="2023-11-15">November 15, 2023</time></h3>
                    <p>
                        We've added email automation and bot protection to ensure secure account registration. Additionally, you can now manage players more effectively, including kicking players from games. A new "marketplace" feature is in development to allow campaign duplication for other parties to use your lore.
                    </p>
                    <p>
                        While style updates are delayed, we're focusing on core functionality to deliver a better experience. Stay tuned for more updates!
                    </p>
                </article>

                <article className="changelog_entry">
                    <h3>Backend Changes and Caching: <time dateTime="2023-07-10">July 10, 2023</time></h3>
                    <p>
                        Backend improvements include client-side caching for faster loading times and better error handling. Form validation has been added to ensure text and image sizes stay within limits. These changes enhance performance and reliability for all users.
                    </p>
                </article>

                <article className="changelog_entry">
                    <h3>Initial Functionality: <time dateTime="2022-10-30">October 30, 2022</time></h3>
                    <p>
                        Our initial launch included login functionality, email utilities, and basic campaign management features. While some pages and styles are still under development, the foundation for displaying campaign data is in place.
                    </p>
                </article>
            </section>
        </main>
    );
}

export default HomePage;