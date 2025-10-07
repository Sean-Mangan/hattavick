import { useEffect, useRef, useState } from "react";
import { Button, Divider, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import "./HomeNav.css";
import { Link, useNavigate } from "react-router-dom";
import { logOut, selectCurrentToken } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLogOutQueryMutation } from "../../features/auth/authApiSlice";
import { useGetCampaignsQuery } from "../../features/campaign/campaignApiSlice";

/**
 * HomeNav component
 * Main navigation bar for the home page
 * Handles user authentication, campaign navigation, and responsive mobile menu
 */
function HomeNav() {
  // Get campaign related datas
  const { data: campaigns } = useGetCampaignsQuery();
  const [campaignList, setCampaignList] = useState([]);

  // Get the current token should it exist
  const token = useSelector(selectCurrentToken);

  // Get the logout functionality
  const [logOutQuery] = useLogOutQueryMutation();

  // Some helpful hooks
  const navRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Functionality for mobile opening and closing the menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  /**
   * Toggle mobile navigation menu visibility
   */
  const showNavBar = () => {
    navRef.current?.classList.toggle("responsive_nav");
  };

  /**
   * Handle campaign dropdown menu click
   */
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Close campaign dropdown menu
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Handle user logout
   * Clears authentication data and redirects to home page
   */
  const handleLogout = async () => {
    try {
      // TODO Figure out why this does not navigate to home
      await logOutQuery().unwrap();
      dispatch(logOut());
      navigate("/");
    } catch (error) {
      // TODO render an error message
      console.error("Logout failed:", error);
      alert("Logout Failed");
    }
  };

  // On any change to the campaigns, set the list of campaigns
  useEffect(() => {
    let campList = [];
    if (campaigns) {
      campList = campaigns["owner"].concat(
        campaigns["admin"],
        campaigns["player"]
      );
    }
    setCampaignList(campList);
  }, [campaigns]);

  return (
    <div className="main_nav_wrapper">
      <div className="red_title">Hattavick</div>
      <nav ref={navRef}>
        <Link
          to="/"
          style={{ textDecoration: "None", color: "white" }}
          onClick={showNavBar}
        >
          <div className="nav_link">Home</div>
        </Link>
        <br />
        <Link
          to="/contact"
          style={{ textDecoration: "None", color: "white" }}
          onClick={showNavBar}
        >
          <div className="nav_link">Contact</div>
        </Link>
        <br />
        <div
          className="nav_link"
          onClick={() => {
            if (token) {
              handleLogout();
              showNavBar();
            } else {
              navigate("/login");
            }
          }}
        >
          {token ? "Logout" : "Login"}
        </div>
        &nbsp;
        {token ? (
          <>
            <Button
              id="demo-positioned-button"
              aria-controls={open ? "demo-positioned-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              variant="contained"
              color="error"
              endIcon={<KeyboardArrowDownIcon />}
              className="nav_link"
              style={{
                fontFamily: '"Times New Roman", Times, serif',
                fontSize: "1.2rem",
              }}
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
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              {campaignList.map((campaign) => {
                return (
                  <Link
                    style={{ textDecoration: "None", color: "black" }}
                    key={campaign.id}
                    to={`/campaign/${campaign.id}`}
                  >
                    <MenuItem>{campaign.name}</MenuItem>
                  </Link>
                );
              })}
              <Link
                onClick={showNavBar}
                to="/create"
                style={{ textDecoration: "None", color: "black" }}
              >
                <MenuItem>
                  <strong>+ New Campaign</strong>
                </MenuItem>
              </Link>
              <Divider />
              <Link
                onClick={showNavBar}
                to="/campaigns"
                style={{ textDecoration: "None", color: "black" }}
              >
                <MenuItem>
                  <strong>Manage Campaigns</strong>
                </MenuItem>
              </Link>
            </Menu>
          </>
        ) : (
          <Button
            onClick={() => {
              navigate("/campaigns");
              showNavBar();
            }}
            variant="contained"
            color="error"
            style={{
              fontFamily: '"Times New Roman", Times, serif',
              fontSize: "1.2rem",
              textDecoration: "None",
            }}
          >
            Campaigns
          </Button>
        )}
        <Button
          className="nav_btn nav_close_btn"
          onClick={showNavBar}
          endIcon={
            <CloseIcon
              style={{ fontSize: "min(10vw, 48px)", fontWeight: "bold" }}
            />
          }
        />
      </nav>
      <Button
        className="nav_btn"
        onClick={showNavBar}
        endIcon={
          <MenuIcon
            style={{ fontSize: "min(10vw, 48px)", fontWeight: "bold" }}
          />
        }
      />
    </div>
  );
}

export default HomeNav;
