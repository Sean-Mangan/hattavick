import { Button, Container, Paper, Box, Grid } from "@mui/material";
import { Helmet } from "react-helmet";
import EmailIcon from "@mui/icons-material/Email";
import DiscordIcon from "@mui/icons-material/Forum";
import CoffeeIcon from "@mui/icons-material/LocalCafe";
import CodeIcon from "@mui/icons-material/Code";
import "./contact.css";
import Settings from "../../config/settings.json";

/**
 * Contact page component
 * Displays contact information, Discord link, and support options
 * Redesigned with modern red/black theme while maintaining personal touch
 * Includes SEO optimization
 */
function Contact() {
  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Hattavick",
    description:
      "Get in touch with the Hattavick development team. Join our Discord community, reach out to the developer, or support the project.",
    url: "https://hattavick.com/contact",
    mainEntity: {
      "@type": "Person",
      name: "Sean Mangan",
      jobTitle: "Software Engineer & Creator",
      url: "https://www.seanpmangan.com",
      sameAs: ["https://discord.gg/nUcFjPY6s2"],
    },
  };

  return (
    <>
      <Helmet>
        <title>
          Contact Us - Hattavick | D&D Campaign Manager Support & Community
        </title>
        <meta
          name="description"
          content="Contact the Hattavick team. Join our Discord community for support, reach out to developer Sean Mangan, or support the project. We're here to help with your D&D campaign management needs."
        />
        <meta
          name="keywords"
          content="Hattavick contact, D&D campaign manager support, TTRPG tool help, Discord community, Sean Mangan, campaign management support"
        />
        <link rel="canonical" href="https://hattavick.com/contact" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hattavick.com/contact" />
        <meta
          property="og:title"
          content="Contact Hattavick - D&D Campaign Manager Support"
        />
        <meta
          property="og:description"
          content="Join our Discord community, reach out to the developer, or support the Hattavick project. Built by a gamer for gamers."
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://hattavick.com/contact" />
        <meta
          name="twitter:title"
          content="Contact Hattavick - D&D Campaign Manager Support"
        />
        <meta
          name="twitter:description"
          content="Join our Discord community or reach out to the developer. We're here to help!"
        />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <main className="contact_page_wrapper">
      {/* Hero Section */}
      <section className="contact_hero_section">
        <Container maxWidth="md">
          <h1 className="contact_hero_title">Get In Touch</h1>
          <p className="contact_hero_subtitle">
            Built by a gamer, for gamers. Let's connect!
          </p>
        </Container>
      </section>

      {/* Main Contact Content */}
      <section className="contact_main_section">
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* About Section */}
            <Grid item xs={12} md={6}>
              <Paper className="contact_card" elevation={3}>
                <div className="contact_card_header">
                  <CodeIcon className="contact_card_icon" />
                  <h2 className="contact_card_title">Meet the Developer</h2>
                </div>
                <div className="contact_card_content">
                  <p className="contact_intro_text">
                    <strong>Hey there! I'm Sean Mangan</strong> — a software
                    engineer and the primary developer behind Hattavick.
                  </p>
                  <p className="contact_body_text">
                    I built this platform because I love TTRPGs and wanted a
                    better way to manage campaign lore. I'm always looking to
                    improve the site, so if you're experiencing any technical
                    difficulties or have ideas for new features, please reach
                    out!
                  </p>
                  <p className="contact_body_text">
                    Hattavick is a passion project — a small utility site for
                    hosting lore information for role-playing campaigns. I hope
                    you and your group get some great use out of it!
                  </p>
                  <p className="contact_highlight_text">
                    Thanks for stopping by. I'm excited to share this with you!
                  </p>
                </div>
              </Paper>
            </Grid>

            {/* Contact Options */}
            <Grid item xs={12} md={6}>
              <div className="contact_options_wrapper">
                <Paper className="contact_option_card" elevation={3}>
                  <DiscordIcon className="contact_option_icon" />
                  <h3 className="contact_option_title">Join Our Community</h3>
                  <p className="contact_option_description">
                    Connect with other game masters, get support, and share your
                    feedback in our Discord server.
                  </p>
                  <Button
                    variant="contained"
                    className="contact_cta_button"
                    href={Settings.EXTERNAL_URLS.DISCORD_INVITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    fullWidth
                  >
                    Join the Discord
                  </Button>
                </Paper>

                <Paper className="contact_option_card" elevation={3}>
                  <EmailIcon className="contact_option_icon" />
                  <h3 className="contact_option_title">Personal Contact</h3>
                  <p className="contact_option_description">
                    Want to reach out directly? Visit my personal website for
                    contact information.
                  </p>
                  <Button
                    variant="outlined"
                    className="contact_secondary_button"
                    href={Settings.EXTERNAL_URLS.PERSONAL_WEBSITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    fullWidth
                  >
                    Visit seanpmangan.com
                  </Button>
                </Paper>

                <Paper className="contact_option_card" elevation={3}>
                  <CoffeeIcon className="contact_option_icon" />
                  <h3 className="contact_option_title">Support the Project</h3>
                  <p className="contact_option_description">
                    Enjoying Hattavick? Consider buying me a coffee to support
                    continued development!
                  </p>
                  <Button
                    variant="outlined"
                    className="contact_secondary_button"
                    href={Settings.EXTERNAL_URLS.COFFEE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    fullWidth
                  >
                    Buy Me a Coffee
                  </Button>
                </Paper>
              </div>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Employee of the Month Section */}
      <section className="contact_employee_section">
        <Container maxWidth="md">
          <Paper className="contact_employee_card" elevation={6}>
            <h2 className="contact_employee_title">
              Employee of the Month 🏆
            </h2>
            <Box className="contact_employee_image_wrapper">
              <img
                className="contact_employee_image"
                src={Settings.IMAGES.CHEF_IMAGE_URL}
                alt="Chef - Employee of the month"
              />
            </Box>
            <p className="contact_employee_caption">
              Meet Chef — our hardest working team member and official morale
              booster! 🐾
            </p>
          </Paper>
        </Container>
      </section>
    </main>
    </>
  );
}

export default Contact;
