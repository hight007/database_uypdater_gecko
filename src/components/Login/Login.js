import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { key } from "../../constants";
import { GoogleLogin } from "react-google-login";

const Login = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    doSetisLogined(false);

    // window.gapi.load("client:auth2", () => {
    //   window.gapi.client.init({
    //     clientId: "27144266591-b7ssse6ocv51stih8rreo81q0155il07.apps.googleusercontent.com",
    //     plugin_name: "chat",
    //   });
    // });
    var CLIENT_ID =
      "27144266591-b7ssse6ocv51stih8rreo81q0155il07.apps.googleusercontent.com";
    var API_KEY = "AIzaSyD7QYAx_MCejyOpEuW_y5xZf-I9gFea5YI";

    var DISCOVERY_DOCS = [
      "https://sheets.googleapis.com/$discovery/rest?version=v4",
    ];
    // var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
    var SCOPES = "https://www.googleapis.com/auth/plus.login";

    // window.gapi.auth2.init({
    //   apiKey: API_KEY,
    //   discoveryDocs: DISCOVERY_DOCS,
    //   clientId: CLIENT_ID,
    //   scope: SCOPES,
    // });
    window.gapi.load("auth2", function () {
      window.gapi.auth2.init({
        apiKey: API_KEY,
        // discoveryDocs: DISCOVERY_DOCS,
        clientId: CLIENT_ID,
        scope: SCOPES,
        plugin_name: "Mularkha",
      });
    });

    window.gapi.signin2.render("my-signin2", {
      // scope: "profile email",
      scope: SCOPES,
      width: 300,
      height: 50,
      longtitle: true,
      theme: "dark",
      plugin_name: "Mularkha",
      onsuccess: onSuccess,
      onfailure: onSuccess,
    });
  }, []);

  const doSetisLogined = async (value) => {
    await localStorage.setItem(key.isLogined, value);
    props.forceUpdate();
  };

  const doLogin = async () => {
    doSetisLogined(true);
    navigate("/home");
  };

  function onSuccess(googleUser) {
    // console.log(googleUser);
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log("Name: " + profile.getName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
  }

  return (
    <div className="login-page">
      <div className="login-box" style={{ minWidth: "30em" }}>
        <div className="card card-outline card-default">
          <div className="card-header text-center bg-dark">
            <img
              src="/src/images/spectrumPro-logo-white.png"
              alt="spectrumPro Logo"
            />
            <h2>
              <b>Vision </b>Deployment tools
            </h2>
          </div>
          <div className="card-body">
            <p className="login-box-msg">Sign in to start your session</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                doLogin();
              }}
            >
              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-envelope" />
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-8">
                  <div className="icheck-primary">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">Remember Me</label>
                  </div>
                </div>
                <div className="col-4">
                  <button type="submit" className="btn btn-primary btn-block">
                    Sign In
                  </button>
                </div>
              </div>
            </form>
            {/* <GoogleLogin
              className="btn btn-primary btn-block"
              clientId="27144266591-b7ssse6ocv51stih8rreo81q0155il07.apps.googleusercontent.com"
              buttonText="Login"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={"single_host_origin"}
            /> */}
            {/* <div className="g-signin2"></div> */}
            <div id="my-signin2"></div>
            <p className="mb-1">
              <NavLink to="/ForgotPassword">I forgot my password</NavLink>
            </p>
            <p className="mb-0">
              <NavLink to="/Register" className="text-center">
                Register a new membership
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
