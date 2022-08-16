import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { key } from "../../../constants";

const Header = () => {
  const navigate = useNavigate();

  const doLogout = () => {
    localStorage.removeItem(key.isLogined);
    localStorage.removeItem(key.loginTime);

    navigate("/login");
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-dark navbar-light">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button">
            <i className="fas fa-bars" />
          </a>
        </li>
      </ul>
      <ul className="navbar-nav ml-auto">
        <li
          className="nav-item"
          onClick={(e) => {
            doLogout();
          }}
        >
          <a
            className="nav-link"
            data-widget="control-sidebar"
            data-controlsidebar-slide="true"
            href="#"
            role="button"
          >
            {"Logout "}
            <i className="fas fa-sign-out-alt" />
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
