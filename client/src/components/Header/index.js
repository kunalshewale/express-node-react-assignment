import React from "react";
import { Link } from "react-router-dom";

const Header = ({ showHideSideBar }) => (
  <div className="application-title-bar text-bold">
    <Link to="/" className="application-title">
      Covid-19 Data Representation
    </Link>
    <i className="fas fa-bars hamburger-menu" onClick={showHideSideBar}></i>
  </div>
);

export default Header;
