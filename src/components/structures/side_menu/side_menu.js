import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Side_menu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menu_master_render = () => {
    return (
      <li className="nav-item menu-open">
        <a
          href="#"
          className={`nav-link ${
            location.pathname.includes("Master") ? "active" : ""
          }`}
        >
          <i className="nav-icon fas fa-compress" />

          <p>
            Master
            <i className="right fas fa-angle-left" />
          </p>
        </a>
        <ul className="nav nav-treeview">
          <li className="nav-item">
            <a
              onClick={() => navigate("/Master/Gecko_item")}
              className={
                location.pathname === "/Master/Gecko_item"
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <i className="far fa-circle nav-icon" />
              <p>Gecko item</p>
            </a>
          </li>
          <li className="nav-item">
            <a
              onClick={() => navigate("/Master/connection")}
              className={
                location.pathname === "/Master/connection"
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <i className="far fa-circle nav-icon" />
              <p>Connection</p>
            </a>
          </li>
        </ul>
      </li>
    );
  };

  const menu_gecko_version = () => {
    return (
      <li className="nav-item menu-open">
        <a
          className={`nav-link ${
            location.pathname.includes("gecko_version") ? "active" : ""
          }`}
        >
          <i className="nav-icon fas fa-code-branch" />
          <p>
            Gecko
            <i className="right fas fa-angle-left" />
          </p>
        </a>
        <ul className="nav nav-treeview">
          <li className="nav-item">
            <a
              onClick={() => navigate("/gecko_version/snap")}
              className={
                location.pathname === "/gecko_version/snap"
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <i className="far fa-circle nav-icon" />
              <p>Snap</p>
            </a>
          </li>
          <li className="nav-item">
            <a
              onClick={() => navigate("/gecko_version/deploy")}
              className={
                location.pathname === "/gecko_version/deploy"
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <i className="far fa-circle nav-icon" />
              <p>Deploy</p>
            </a>
          </li>
        </ul>
      </li>
    );
  };

  const menu_migration = () => {
    return (
      <li className="nav-item menu-open">
        <a
          className={`nav-link ${
            location.pathname.includes("gecko_version") ? "active" : ""
          }`}
        >
          <i className="nav-icon fas fa-compress-alt" />
          <p>
            Migration
            <i className="right fas fa-angle-left" />
          </p>
        </a>
        <ul className="nav nav-treeview">
          <li className="nav-item">
            <a
              onClick={() => navigate("/Migration")}
              className={
                location.pathname === "/Migration"
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <i className="far fa-circle nav-icon" />
              <p>Migration</p>
            </a>
          </li>
        </ul>
      </li>
    );
  }

  const menu_storeProcedures_version = () => {
    return (
      <li className="nav-item menu-open">
        <a
          className={`nav-link ${
            location.pathname.includes("storeProcedures") ? "active" : ""
          }`}
        >
          <i className="nav-icon fas fa-warehouse" />
          <p>
            Store procedures
            <i className="right fas fa-angle-left" />
          </p>
        </a>
        <ul className="nav nav-treeview">
          <li className="nav-item">
            <a
              onClick={() => navigate("/storeProcedures/snap")}
              className={
                location.pathname === "/storeProcedures/snap"
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <i className="far fa-circle nav-icon" />
              <p>Snap</p>
            </a>
          </li>
          <li className="nav-item">
            <a
              onClick={() => navigate("/storeProcedures/deploy")}
              className={
                location.pathname === "/storeProcedures/deploy"
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <i className="far fa-circle nav-icon" />
              <p>Deploy</p>
            </a>
          </li>
        </ul>
      </li>
    );
  }

  

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <a
        onClick={() => {
          // navigate("/home");
          window.open(
            "/home", "_blank");
        }}
        className="brand-link"
        style={{ cursor: "pointer" }}
      >
        <img
          src="/src/images/spectrumPro-logo-white.png"
          alt="spectrumPro Logo"
          className="brand-image elevation-2 "
          style={{ opacity: "1" }}
        />
        <span
          className="brand-text font-weight-light"
          style={{ visibility: "hidden" }}
        >
          {"_"}
        </span>
      </a>
      <div className="sidebar os-host os-theme-light os-host-resize-disabled os-host-transition os-host-overflow os-host-overflow-y os-host-scrollbar-horizontal-hidden">
        <div className="os-resize-observer-host observed">
          <div
            className="os-resize-observer"
            style={{ left: 0, right: "auto" }}
          />
        </div>
        <div
          className="os-size-auto-observer observed"
          style={{ height: "calc(100% + 1px)", float: "left" }}
        >
          <div className="os-resize-observer" />
        </div>
        <div
          className="os-content-glue"
          style={{ margin: "0px -8px", width: 249, height: 462 }}
        />
        <div className="os-padding">
          <div
            className="os-viewport os-viewport-native-scrollbars-invisible"
            style={{ overflowY: "scroll" }}
          >
            <div
              className="os-content"
              style={{ padding: "0px 8px", height: "100%", width: "100%" }}
            >
              <nav className="mt-2">
                <ul
                  class="nav nav-pills nav-sidebar flex-column nav-child-indent nav-compact"
                  data-widget="treeview"
                  role="menu"
                  data-accordion="false"
                >
                  {menu_gecko_version()}
                  {menu_storeProcedures_version()}
                  {menu_migration()}
                  {menu_master_render()}
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <div className="os-scrollbar os-scrollbar-horizontal os-scrollbar-auto-hidden os-scrollbar-unusable">
          <div className="os-scrollbar-track">
            <div
              className="os-scrollbar-handle"
              style={{ width: "100%", transform: "translate(0px, 0px)" }}
            />
          </div>
        </div>
        <div className="os-scrollbar os-scrollbar-vertical os-scrollbar-auto-hidden">
          <div className="os-scrollbar-track">
            <div
              className="os-scrollbar-handle"
              style={{ height: "44.9525%", transform: "translate(0px, 0px)" }}
            />
          </div>
        </div>
        <div className="os-scrollbar-corner" />
      </div>
    </aside>
  );
};

export default Side_menu;
