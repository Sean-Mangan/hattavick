import { Grid } from '@mui/material'
import React from 'react'

import "./contact.css"

function Contact() {
  return (
    <>
    <div className='contact_wrapper'>
      <p className='contact_title'>
        Contact Us
      </p>
      <p className='contact_text'>
        Hey there! My name is Sean Mangan. I am a software engineer and primary developer for Hattavick. I'm always looking to improve the site so if you are experiencing any technical difficulties please reach out!
      </p>
      <div className='desc_stuff contact_center'>
        <p className='contact_text'>
          Hattavick is just a small utility site for hosting lore information for role playing campaigns. I hope you and your group gets some use out of it!
        </p>
        <p 
        className='contact_text'
        >
          <strong>Thanks for stopping by, I am very excited to share this with you all!</strong>
        </p>
          </div>
      </div>
      <div style={{textAlign:"center"}}>
        <img 
        className=" contact_image contact_center"
        src="https://hattavick.s3.amazonaws.com/chef2.jpg"/>
        <p style={{marginTop:"0"}}>{"^^Chef is the employee of the month"}</p>
      </div>
    <div style={{textAlign: "center", margin: "auto"}}>
        <p className='contact_text' style={{padding:"0", margin:"0"}}>
        {"If you are interested in reaching out to me personally, you can find my information on my personal site: "}
        <a href='https://www.seanpmangan.com/'><strong className='linker'>{"www.seanpmangan.com"}</strong></a>.
      </p>
      <br/>
      <p className='contact_text' style={{paddingBottom:"1em", margin:"0"}}>
        {"If you use the site and enjoy it, consider buying me a cup of coffee here "}
        <a href='https://www.buymeacoffee.com/seanpmangan'><strong className='linker'>{"Buy Me a Coffee"}</strong></a>.
      </p>
      </div>
    </>
)
}

export default Contact