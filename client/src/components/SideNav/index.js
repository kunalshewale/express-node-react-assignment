import React from "react";
import { Link } from "react-router-dom";

const SideNav = ({ displaySideNav, showHideSideBar, navItems }) => (
  <aside className={`sidenav ${displaySideNav ? "sidenav--active" : ""}`}>
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
            <Link className="navList-heading-title" to={item.navigateTo}>
              {item.name}
            </Link>
          </div>
        </li>
      ))}
    </ul>
  </aside>
);

export default SideNav;
