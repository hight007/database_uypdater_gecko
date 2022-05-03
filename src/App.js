import React, { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

//Components
import Home from "./components/home";

import Header from "./components/structures/header";
import SideMenu from "./components/structures/side_menu";
import Footer from "./components/structures/footer";

//Gecko version
import Snap from "./components/geckoVersion/snap";
import Deploy from "./components/geckoVersion/deploy";

//Gecko version
import SpSnap from "./components/storeProcedures/Snap";
import SpDeploy from "./components/storeProcedures/Deploy";

//Master
import Gecko_item from "./components/master/Gecko_item";
import Connection from "./components/master/Connection";

//Authen
import Login from "./components/Login";

import "animate.css";
import { key } from "./constants";
const App = () => {
  const [value, setValue] = useState(0); // integer state

  const doForceUpdate = () => {
    try {
      console.log(value);
      setValue(value + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const hasPermission = (element) => {
    if (!localStorage.getItem(key.isLogined)) {
      console.log("Permission exists");
      return <Login />;
    }

    return element;
  };

  const showElement = (element) => {
    console.log(localStorage.getItem(key.isLogined));
    const isLogined = localStorage.getItem(key.isLogined);
    if (isLogined === "true") {
      console.log("ok");
      return element;
    }
  };

  return (
    <BrowserRouter>
      {showElement(<Header />)}
      {showElement(<SideMenu />)}
      <Routes>
        <Route path="/Home" element={hasPermission(<Home />)} />
        <Route path="/Login" element={hasPermission(<Login forceUpdate={doForceUpdate} />)} />

        {/* master */}
        <Route
          path="/Master/gecko_item"
          element={hasPermission(<Gecko_item />)}
        />
        <Route
          path="/Master/Connection"
          element={hasPermission(<Connection />)}
        />

        {/* Gecko version */}
        <Route path="/gecko_version/snap" element={hasPermission(<Snap />)} />
        <Route
          path="/gecko_version/deploy"
          element={hasPermission(<Deploy />)}
        />

        {/* Store procedures */}
        <Route
          path="/storeProcedures/snap"
          element={hasPermission(<SpSnap />)}
        />
        <Route
          path="/storeProcedures/deploy"
          element={hasPermission(<SpDeploy />)}
        />

        <Route path="/" element={hasPermission(<Navigate to="/Login" />)} />
        <Route path="*" element={hasPermission(<Navigate to="/Login" />)} />
      </Routes>
      {showElement(<Footer />)}
    </BrowserRouter>
  );
};

export default App;
