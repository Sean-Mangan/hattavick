import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import * as AiIcons from "react-icons/ai";
import Nav_data from "./Nav_data";
import SubMenu from "../SubMenu/SubMenu";
import MenuIcon from "@mui/icons-material/Menu";
import { Button } from "@mui/material";
import "./CampaignNavBar.css";

function CampaignNavBar() {
  // Ref for detecting clicks outside the sidebar
  const wrapperRef = useRef(null);

  // Sidebar position: "-100%" (hidden) or "0" (visible)
  const [sideBar, setSideBar] = useState("-100%");

  /**
   * Closes the sidebar when clicking outside of it
   * @param {Event} event - Click event
   */
  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setSideBar("-100%");
    }
  };

  /**
   * Toggles sidebar visibility between hidden and visible states
   */
  const showSidebar = () => {
    setSideBar(sideBar === "0" ? "-100%" : "0");
  };

  // Set up click outside listener for closing sidebar
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
