import { useState } from "react";
import { Button, Paper, Alert, Box, Grid, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { selectCurrentToken } from "../../features/auth/authSlice";
import "./HomePage.css";
import Settings from "../../config/settings.json";
import GroupsIcon from "@mui/icons-material/Groups";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import PublicIcon from "@mui/icons-material/Public";
import PeopleIcon from "@mui/icons-material/People";
import SecurityIcon from "@mui/icons-material/Security";
import CloudSyncIcon from "@mui/icons-material/CloudSync";

/**
 * HomePage component - Landing page for the Hattavick D&D campaign manager.
 * Optimized for user conversion with clear value proposition and CTAs.
 * Includes comprehensive SEO optimization with meta tags and structured data.
 *
 * @returns {JSX.Element} The home page
 */
function HomePage() {
  const token = useSelector(selectCurrentToken);
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = useState(true);

  // Structured data for SEO (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Hattavick",
    applicationCategory: "GameApplication",
    description:
      "The ultimate D&D and TTRPG campaign management platform. Build immersive worlds, manage complex lore, and collaborate seamlessly with your party.",
    url: "https://hattavick.com",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Person",
      name: "Sean Mangan",
      url: "https://www.seanpmangan.com",
    },
    featureList: [
      "Comprehensive lore management",
      "Party collaboration",
      "Character and NPC tracking",
      "World building tools",
      "Session notes",
      "Campaign history",
    ],
    operatingSystem: "Web-based, cross-platform",
    audience: {
      "@type": "Audience",
      audienceType: "Tabletop RPG players and game masters",
    },
  };

  const handleGetStarted = () => {
    if (token) {
      navigate("/campaigns");
    } else {
      navigate("/login");
    }
  };

  const handleCloseBanner = () => {
    setShowBanner(false);
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>
          Hattavick - Ultimate D&D & TTRPG Campaign Manager | Free Campaign
          Management Tool
        </title>
        <meta
          name="description"
          content="Manage your D&D and TTRPG campaigns with ease. Hattavick offers comprehensive lore management, party collaboration, character tracking, and world-building tools. Free campaign manager for Dungeons & Dragons, Pathfinder, and all tabletop RPGs."
        />
        <meta
          name="keywords"
          content="D&D campaign manager, DnD campaign tool, TTRPG manager, Dungeons and Dragons organizer, tabletop RPG tools, campaign management software, lore tracker, world building tool, D&D Beyond alternative, Pathfinder campaign manager, RPG session notes, free campaign manager"
        />
        <link rel="canonical" href="https://hattavick.com" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hattavick.com/" />
        <meta
          property="og:title"
          content="Hattavick - Ultimate D&D & TTRPG Campaign Manager"
        />
        <meta
          property="og:description"
          content="Build immersive worlds, manage complex lore, and collaborate with your party. The ultimate free campaign management platform for D&D and all tabletop RPGs."
        />
        <meta
          property="og:image"
          content="https://hattavick.com/placeholder.webp"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://hattavick.com/" />
        <meta
          name="twitter:title"
          content="Hattavick - Ultimate D&D & TTRPG Campaign Manager"
        />
        <meta
          name="twitter:description"
          content="Build immersive worlds, manage complex lore, and collaborate with your party. Free campaign management for D&D and all tabletop RPGs."
        />
        <meta
          name="twitter:image"
          content="https://hattavick.com/placeholder.webp"
        />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <main className="home_wrapper">
        {/* Hero Section */}
        <section className="hero_section">
          {/* Alpha Testing Banner */}
          {showBanner && (
            <Alert
              severity="info"
              className="alpha_banner"
              onClose={handleCloseBanner}
            >
              <strong>Welcome to Hattavick Alpha Testing!</strong> We're constantly
              improving. Your feedback helps shape the future of TTRPG campaign
              management.
            </Alert>
          )}

        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <h1 className="hero_title">
                The Ultimate D&D Campaign Management Platform
              </h1>
              <p className="hero_subtitle">
                Build immersive worlds, manage complex lore, and collaborate
                seamlessly with your party. Everything you need to run epic
                tabletop RPG campaigns, all in one place.
              </p>
              <Box className="hero_cta_container">
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGetStarted}
                  className="cta_primary"
                >
                  {token ? "Go to Campaigns" : "Start Your Adventure"}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  href={Settings.EXTERNAL_URLS.DISCORD_INVITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta_secondary"
                >
                  Join Discord Community
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <img
                className="hero_image"
                alt="Animated dice rolling for tabletop RPGs"
                src={Settings.IMAGES.HOME_PAGE_HERO_IMAGE_URL}
              />
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features_section">
        <Container maxWidth="lg">
          <h2 className="section_title">Everything Your Campaign Needs</h2>
          <p className="section_subtitle">
            Powerful tools designed specifically for game masters and players
          </p>

          <Grid container spacing={4} className="features_grid">
            <Grid item xs={12} sm={6} md={4}>
              <Paper className="feature_card" elevation={3}>
                <LibraryBooksIcon className="feature_icon" />
                <h3 className="feature_title">Comprehensive Lore Management</h3>
                <p className="feature_description">
                  Organize factions, locations, and artifacts with rich text,
                  images, and interconnected relationships. Keep your world
                  building organized and accessible.
                </p>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper className="feature_card" elevation={3}>
                <GroupsIcon className="feature_icon" />
                <h3 className="feature_title">Party Collaboration</h3>
                <p className="feature_description">
                  Share characters, notes, and campaign details with your
                  entire party. Everyone stays on the same page with real-time
                  updates.
                </p>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper className="feature_card" elevation={3}>
                <PeopleIcon className="feature_icon" />
                <h3 className="feature_title">Character & NPC Tracking</h3>
                <p className="feature_description">
                  Maintain detailed profiles for player characters and NPCs.
                  Track stats, backstories, and relationships all in one place.
                </p>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper className="feature_card" elevation={3}>
                <PublicIcon className="feature_icon" />
                <h3 className="feature_title">World Building Tools</h3>
                <p className="feature_description">
                  Create rich, interconnected worlds with custom lore, session
                  notes, and campaign history that grows with your story.
                </p>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper className="feature_card" elevation={3}>
                <SecurityIcon className="feature_icon" />
                <h3 className="feature_title">Secure & Private</h3>
                <p className="feature_description">
                  Your campaigns are secure with email verification and
                  role-based access control. Invite players with confidence.
                </p>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper className="feature_card" elevation={3}>
                <CloudSyncIcon className="feature_icon" />
                <h3 className="feature_title">Always Accessible</h3>
                <p className="feature_description">
                  Access your campaigns from any device. Your world is always
                  available when inspiration strikes or game night begins.
                </p>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="how_it_works_section">
        <Container maxWidth="md">
          <h2 className="section_title">Get Started in Minutes</h2>
          <div className="steps_container">
            <div className="step">
              <div className="step_number">1</div>
              <div className="step_content">
                <h3 className="step_title">Create Your Account</h3>
                <p className="step_description">
                  Easy sign-up with email verification. Create an account and explore!
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step_number">2</div>
              <div className="step_content">
                <h3 className="step_title">Build Your Campaign</h3>
                <p className="step_description">
                  Create your campaign and start adding lore, characters, and
                  locations to bring your world to life.
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step_number">3</div>
              <div className="step_content">
                <h3 className="step_title">Invite Your Party</h3>
                <p className="step_description">
                  Share campaign access with your players. Collaborate and track
                  progress together in real-time.
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step_number">4</div>
              <div className="step_content">
                <h3 className="step_title">Run Epic Adventures</h3>
                <p className="step_description">
                  Focus on storytelling while Hattavick handles the organization.
                  Your best sessions await.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Final CTA Section */}
      <section className="final_cta_section">
        <Container maxWidth="md">
          <Paper className="final_cta_card" elevation={6}>
            <h2 className="final_cta_title">
              Ready to Elevate Your Campaign?
            </h2>
            <p className="final_cta_description">
              Join game masters and players who are already creating unforgettable
              adventures with Hattavick.
            </p>
            <Box className="final_cta_buttons">
              <Button
                variant="contained"
                size="large"
                onClick={handleGetStarted}
                className="cta_primary_large"
              >
                {token ? "Go to My Campaigns" : "Get Started!"}
              </Button>
            </Box>
            <p className="final_cta_note">
              100% Free to use! Join our{" "}
              <a
                href={Settings.EXTERNAL_URLS.DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline_link"
              >
                Discord community
              </a>{" "}
              for support and updates.
            </p>
          </Paper>
        </Container>
      </section>

      {/* Compact Changelog Section */}
      <section className="compact_changelog">
        <Container maxWidth="md">
          <details className="changelog_details">
            <summary className="changelog_summary">Recent Updates</summary>
            <div className="changelog_content">
              <article className="changelog_entry_compact">
                <h4>
                  Email Automation & Security{" "}
                  <time dateTime="2023-11-15">Nov 2023</time>
                </h4>
                <p>
                  Added email automation, bot protection, and enhanced player
                  management capabilities. Marketplace feature in development.
                </p>
              </article>

              <article className="changelog_entry_compact">
                <h4>
                  Backend Improvements <time dateTime="2023-07-10">Jul 2023</time>
                </h4>
                <p>
                  Client-side caching, improved error handling, and form
                  validation for better performance.
                </p>
              </article>
            </div>
          </details>
        </Container>
      </section>
    </main>
    </>
  );
}

export default HomePage;
