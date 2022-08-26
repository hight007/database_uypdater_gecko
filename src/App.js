import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";

//Components
import Home from "./components/home";

import Header from "./components/structures/header";
import SideMenu from "./components/structures/side_menu";
import Footer from "./components/structures/footer";

//Gecko version
import Snap from "./components/geckoVersion/snap";
import Deploy from "./components/geckoVersion/deploy";

//storeProcedures
import SpSnap from "./components/storeProcedures/Snap";
import SpDeploy from "./components/storeProcedures/Deploy";
import SpUpdate from "./components/storeProcedures/Updated/";

//Master
import Gecko_item from "./components/master/Gecko_item";
import Connection from "./components/master/Connection";

//Authen
import Login from "./components/Login";

//Migration
import Migration from "./components/Migration";

//Report analytics
import EventLogRawData from "./components/ReportAnalytics/eventLogRawData";
import DurationAnalysis from "./components/ReportAnalytics/duration_analysis";

import "animate.css";
import { key } from "./constants";
import "./App.css";
import moment from "moment";
import Swal from "sweetalert2";

const App = () => {
  const [value, setValue] = useState(0); // integer state

  const doForceUpdate = () => {
    try {
      setValue(value + 1);
    } catch (error) {}
  };

  const showElement = (element) => {
    const isLogined = localStorage.getItem(key.isLogined);
    if (isLogined === "true") {
      return element;
    }
  };

  return (
    <BrowserRouter>
      {showElement(<Header />)}
      {showElement(<SideMenu />)}
      <Routes>
        {/* <Route path="/Home" element={<RequireAuth><Home />)} /> */}
        <Route
          path="/Home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route path="/Login" element={<Login forceUpdate={doForceUpdate} />} />

        {/* master */}
        <Route
          path="/Master/gecko_item"
          element={
            <RequireAuth>
              <Gecko_item />
            </RequireAuth>
          }
        />
        <Route
          path="/Master/Connection"
          element={
            <RequireAuth>
              <Connection />
            </RequireAuth>
          }
        />

        {/* Gecko version */}
        <Route
          path="/gecko_version/snap"
          element={
            <RequireAuth>
              <Snap />
            </RequireAuth>
          }
        />
        <Route
          path="/gecko_version/deploy"
          element={
            <RequireAuth>
              <Deploy />
            </RequireAuth>
          }
        />

        {/* Store procedures */}
        <Route
          path="/storeProcedures/snap"
          // element={<RequireAuth><SpSnap />)}
          element={
            <RequireAuth>
              <SpSnap />
            </RequireAuth>
          }
        />
        <Route
          path="/storeProcedures/deploy"
          element={
            <RequireAuth>
              <SpDeploy />
            </RequireAuth>
          }
        />
        <Route
          path="/storeProcedures/update"
          element={
            <RequireAuth>
              <SpUpdate />
            </RequireAuth>
          }
        />

        {/* Migration */}
        <Route
          path="/Migration/"
          element={
            <RequireAuth>
              <Migration />
            </RequireAuth>
          }
        />

        {/* Report Analytics */}
        <Route
          path="/ReportAnalytics/EventLogRawData"
          element={
            <RequireAuth>
              <EventLogRawData />
            </RequireAuth>
          }
        />
        <Route
          path="/ReportAnalytics/duration_analysis"
          element={
            <RequireAuth>
              <DurationAnalysis />
            </RequireAuth>
          }
        />

        <Route
          path="/"
          element={
            <RequireAuth>
              <Navigate to="/Login" />
            </RequireAuth>
          }
        />
        <Route
          path="*"
          element={
            <RequireAuth>
              <Navigate to="/Login" />
            </RequireAuth>
          }
        />
      </Routes>
      {showElement(<Footer />)}
    </BrowserRouter>
  );
};

export default App;

function RequireAuth(props) {
  // check permission
  if (localStorage.getItem(key.isLogined) !== "true") {
    return <Navigate to="/Login" />;
  }

  //check time to login
  const loginTime = moment(localStorage.getItem(key.loginTime)).format(
    "DD-MMM-yyyy HH:mm:ss"
  );
  if (moment().diff(moment(loginTime), "h") > 4) {
    localStorage.removeItem(key.isLogined);
    localStorage.removeItem(key.loginTime);
    Swal.fire({
      icon: "info",
      title: "Oops...",
      text: "Login time out , please login again",
    }).then(() => {
      return <Navigate to="/Login" />;
    });
  }
  return props.children;
}
