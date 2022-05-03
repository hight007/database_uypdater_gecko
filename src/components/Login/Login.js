import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { key } from "../../constants";

const Login = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    doSetisLogined(false);
  }, []);

  const doSetisLogined = async (value) => {
    await localStorage.setItem(key.isLogined, value);
    props.forceUpdate();
  };

  const doLogin = async () => {
    doSetisLogined(true);
    navigate("/home");
  };

  return (
    <div className="login-page">
      <div className="login-box" style={{minWidth: '30em'}}>
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
