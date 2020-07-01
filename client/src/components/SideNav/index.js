import React from "react";
import { Link } from "react-router-dom";
import OutsideClickHandler from "react-outside-click-handler";
import "./SideNav.scss";

const SideNav = ({ displaySideNav, showHideSideBar, navItems }) => (
  <aside className={`sidenav ${displaySideNav ? "sidenav--active" : ""}`}>
    <OutsideClickHandler
      onOutsideClick={displaySideNav ? showHideSideBar : () => {}}
    >
      <div className="sidenav-close-container">
        <i
          className="fas fa-times sidenav-close-button"
          onClick={showHideSideBar}
        ></i>
      </div>
      <ul className="navList">
        {navItems.map((item, index) => (
          <li className="navList-heading" key={`navItem_${index}`}>
            <i className={`fa fa-${item.iconName}`}></i>
            <div className="navList-heading-titleContainer">
              <Link
                className="navList-heading-title"
                to={item.navigateTo}
                onClick={showHideSideBar}
              >
                {item.name}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </OutsideClickHandler>
  </aside>
);

export default SideNav;
