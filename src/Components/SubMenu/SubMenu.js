import { useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import "./SubMenu.css";

/**
 * SubMenu component
 * Renders a navigation menu item with optional submenu
 * Hides "My Character" submenu item for admin users
 *
 * @param {Object} props - Component props
 * @param {Object} props.item - Menu item configuration
 * @param {Function} props.onclick - Click handler for menu items
 */
function SubMenu({ item, onclick }) {
  const [subnav, setSubnav] = useState(false);
  const { campaignId } = useParams();
  const { isAdmin } = useOutletContext();

  /**
   * Toggle submenu visibility
   */
  const showSubnav = () => setSubnav(!subnav);

  return (
    <div>
      <Link
        onClick={item.subNav ? showSubnav : onclick}
        to={item.path !== "#" ? `/campaign/${campaignId}/${item.path}` : "#"}
        className="submenu_link"
      >
        <div>
          {item.icon}
          <span className="submenu_label">{item.title}</span>
        </div>
        <div>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
              ? item.iconClosed
              : null}
        </div>
      </Link>
      {subnav &&
        item.subNav.map((subItem) => {
          // Hide "My Character" for admin users
          if (subItem.title === "My Character" && isAdmin) {
            return null;
          }

          return (
            <div onClick={onclick} key={subItem.title}>
              <Link
                to={
                  subItem.path !== "#"
                    ? `/campaign/${campaignId}/${subItem.path}`
                    : "#"
                }
                className="dropdown_link"
              >
                {subItem.icon}
                <span className="dropdown_label">{subItem.title}</span>
              </Link>
            </div>
          );
        })}
    </div>
  );
}

export default SubMenu;
