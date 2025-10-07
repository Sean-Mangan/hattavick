import { Button } from "@mui/material";
import "./contact.css";
import Settings from "../../config/settings.json";

/**
 * Contact page component
 * Displays contact information, Discord link, and support options
 */
function Contact() {
  return (
    <>
      {/* Main contact section */}
      <div className="contact_wrapper">
        <p className="contact_title">Contact Us</p>
        <p className="contact_text">
          Hey there! My name is Sean Mangan. I am a software engineer and
          primary developer for Hattavick. I'm always looking to improve the
          site so if you are experiencing any technical difficulties please
          reach out to me either via my personal website or the discord channel!
        </p>
        <Button
          variant="contained"
          href={Settings.EXTERNAL_URLS.DISCORD_INVITE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <strong>Join the Discord!</strong>
        </Button>
        <div className="desc_stuff contact_center">
          <p className="contact_text">
            Hattavick is just a small utility site for hosting lore information
            for role playing campaigns. I hope you and your group gets some use
            out of it!
          </p>
          <p className="contact_text">
            <strong>
              Thanks for stopping by, I am very excited to share this with you
              all!
            </strong>
          </p>
        </div>
      </div>

      {/* Employee of the month section */}
      <div className="contact_center_section">
        <img
          className="contact_image contact_center"
          src={Settings.IMAGES.CHEF_IMAGE_URL}
          alt="Chef - Employee of the month"
        />
        <p className="contact_caption">^^Chef is the employee of the month</p>
      </div>

      {/* Additional contact and support links */}
      <div className="contact_links_section">
        <p className="contact_text contact_link_text">
          If you are interested in reaching out to me personally, you can find
          my information on my personal site:{" "}
          <a
            href={Settings.EXTERNAL_URLS.PERSONAL_WEBSITE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong className="linker">www.seanpmangan.com</strong>
          </a>
          .
        </p>
        <br />
        <p className="contact_text contact_link_text contact_support_text">
          If you use the site and enjoy it, consider buying me a cup of coffee
          here{" "}
          <a
            href={Settings.EXTERNAL_URLS.COFFEE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong className="linker">Buy Me a Coffee</strong>
          </a>
          .
        </p>
      </div>
    </>
  );
}

export default Contact;
