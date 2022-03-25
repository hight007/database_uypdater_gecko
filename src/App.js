import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

//Components
import Home from "./components/home";
import Login from "./components/Login";

import Header from "./components/structures/header";
import SideMenu from "./components/structures/side_menu";
import Footer from "./components/structures/footer";

//Master
import Gecko_item from './components/master/Gecko_item';

const App = () => {
  const hasPermission = (element) => {
    if (false) {
      console.log("Permission exists");
      return <Login />;
    }

    return element;
  };

  return (
    <BrowserRouter>
      <Header />
      <SideMenu />
      <Routes>
        <Route path="/Home" element={hasPermission(<Home />)} />
        <Route path="/Master/gecko_item" element={hasPermission(<Gecko_item />)} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
