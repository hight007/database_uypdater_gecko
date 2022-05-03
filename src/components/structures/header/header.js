import React from "react";

const Header = () => {
  return (
    <nav className="main-header navbar navbar-expand navbar-dark navbar-light">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button">
            <i className="fas fa-bars" />
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
