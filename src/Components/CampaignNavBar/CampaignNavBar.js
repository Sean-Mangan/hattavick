import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import * as AiIcons from "react-icons/ai";
import Nav_data from "./Nav_data";
import SubMenu from "../SubMenu/SubMenu";
import MenuIcon from "@mui/icons-material/Menu";

import "./CampaignNavBar.css";
import { Button } from "@mui/material";

function CampaignNavBar() {
  //Define ref for side menu and css value for left
  // Such that the menu is not on screen
  const wrapperRef = useRef(null);
  const [sideBar, setSideBar] = useState("-100%");

  // Adds an event listener to the dom for an onclick method
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  // Function that will switch between 0 and 11% for the sidenav left value
  const showSidebar = () => {
    setSideBar(sideBar === "0" ? "-100%" : "0");
  };

  // On a outside click close the menu
  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setSideBar("-100%");
    }
  };

  //render function
  return (
    <div ref={wrapperRef}>
      <div className="nav-content">
        <div className="title_wrapper">
          <Link to="/">
            <div className="red-title">Hattavick</div>
          </Link>
        </div>
        <div className="nav-link">
          <Button
            onClick={showSidebar}
            endIcon={
              <MenuIcon
                style={{
                  fontSize: "min(10vw, 48px)",
                  fontWeight: "bold",
                  color: "white",
                }}
              />
            }
          />
        </div>
      </div>
      <nav className="nav-sidebar example" style={{ right: sideBar }}>
        <div className="nav-div-sidebar example">
          <div className="nav-div-close-wrapper">
            <Link className="nav-link" to="#">
              <AiIcons.AiOutlineClose
                className="red-icon"
                style={{ color: "white", fontSize: "38px" }}
                onClick={showSidebar}
              />
            </Link>
          </div>
          <div className="menu_wrapper">
            {Nav_data.map((item, idx) => {
              return <SubMenu item={item} onclick={showSidebar} key={idx} />;
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default CampaignNavBar;
