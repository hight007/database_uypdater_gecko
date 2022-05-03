import React, { useEffect, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { apiName, apiUrl, OK } from "../../../constants";
import { textAreaToArray } from "../../../utils/shareFunction";
import { httpClient } from "../../../utils/httpClient";
import moment from "moment";
import Swal from "sweetalert2";
import _ from "lodash";
import join from "url-join";

const Deploy = () => {
  const [isLoad, setisLoad] = useState(false);
  const [versionList, setversionList] = useState([]);

  const [connectionList, setconnectionList] = useState([]);
  const [connectionListDropDown, setconnectionListDropDown] = useState([]);

  const [version, setversion] = useState("");
  const [connection, setconnection] = useState("");
  const [database, setdatabase] = useState("");
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");

  const [deployResult, setdeployResult] = useState(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      setisLoad(true);
      await doGetConnectionList();
      await doGetSugressionsVersionList();
    } catch (error) {
      console.log(error);
    } finally {
      setisLoad(false);
    }
  };

  const downloadRawQuery = () => {
    if (version && version != "") {
      window.open(
        join(apiUrl, apiName.storeProcedures.query, `/version=${version}`)
      );
    } else {
      Swal.fire({
        title: "Please select version",
        icon: "warning",
        showClass: {
          popup: "animate__animated animate__shakeX",
        },
        hideClass: {
          popup: "animate__animated animate__flipOutX",
        },
      });
    }
  };

  const renderInputTargetServerCriteria = () => {
    const renderVersion = () => {
      if (versionList) {
        if (versionList.length > 0) {
          return versionList.map((item) => (
            <option value={item}>{item}</option>
          ));
        }
      }
    };

    const renderConnection = () => {
      if (connectionListDropDown.length > 0) {
        return connectionListDropDown.map((item) => (
          <option
            value={JSON.stringify({
              connection_name: item.connection_name,
              connection_type: item.connection_type,
            })}
          >
            {item.connection_name + "(" + item.connection_type + ")"}
          </option>
        ));
      }
    };

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          doDeploy();
        }}
      >
        <div className="card card-dark">
          <div className="card-header"></div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Version : </label>
                  <select
                    class="form-control"
                    required
                    onChange={(e) => {
                      setversion(e.target.value);
                      doSetconnectionListDropDown();
                    }}
                  >
                    <option value="">---Select Version---</option>
                    {renderVersion()}
                  </select>
                </div>
              </div>
              <div className="col-sm-6">
                <label>Downlaod SQL</label>
                <br></br>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    downloadRawQuery();
                  }}
                >
                  <i class="fas fa-cloud-download-alt"></i> Download
                </button>
              </div>
              <div className="col-sm-12">
                <div className="card card-default">
                  <div
                    className="card-body row bg-primary"
                    style={{ borderRadius: 10 }}
                  >
                    <div className="col-sm-12">
                      <div className="form-group">
                        <label>Connection : </label>
                        <select
                          id="dropDownConnection"
                          className="form-control"
                          onChange={(e) => {
                            doSelectConnection(e.target.value);
                          }}
                        >
                          <option value="">---Select Connection---</option>
                          {renderConnection()}
                        </select>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Connection name :</label>
                        <input
                          required
                          value={connection}
                          onChange={(e) => {
                            setconnection(e.target.value);
                          }}
                          className="form-control"
                          placeholder="db Connection name"
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Database name :</label>
                        <input
                          required
                          value={database}
                          onChange={(e) => {
                            setdatabase(e.target.value);
                          }}
                          className="form-control"
                          placeholder="Vision database name"
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Db user name :</label>
                        <input
                          required
                          value={username}
                          onChange={(e) => {
                            setusername(e.target.value);
                          }}
                          className="form-control"
                          placeholder="database username"
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Db password :</label>
                        <input
                          required
                          type="password"
                          value={password}
                          onChange={(e) => {
                            setpassword(e.target.value);
                          }}
                          className="form-control"
                          placeholder="database password"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button type="submit" className="btn btn-primary">
              Deploy
            </button>
            <button
              className="btn btn-default float-right"
              type="reset"
              onClick={() => {
                doReset();
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </form>
    );
  };

  const doDeploy = () => {};

  const doReset = () => {
    setversion("");
    setconnection("");
    setdatabase("");
    setusername("");
    setpassword("");
  };

  //get connection list
  const doGetConnectionList = async () => {
    const connection_data = await httpClient.get(
      apiName.storeConnection.connection
    );
    if (connection_data.data.api_result == OK) {
      setconnectionList(connection_data.data.result);
    }
  };
  const doSelectConnection = (connection) => {
    if (connection === "") {
      doReset();
    }
    connection = JSON.parse(connection);
    for (let index = 0; index < connectionList.length; index++) {
      const item = connectionList[index];
      if (
        connection.connection_name === item.connection_name &&
        connection.connection_type === item.connection_type
      ) {
        console.log(item);
        setconnection(item.connection_string_encrypt.connection_name);
        setdatabase(item.connection_string_encrypt.database_name);
        setusername(item.connection_string_encrypt.username);
        setpassword(item.connection_string_encrypt.password);
        return;
      }
    }
  };
  const doSetconnectionListDropDown = (item) => {
    var listDropDown = [];

    listDropDown = _.filter(connectionList, function (item) {
      return item.connection_type == "core";
    });

    setconnection("");
    setdatabase("");
    setusername("");
    setpassword("");
    setconnectionListDropDown(listDropDown);
    document.getElementById("dropDownConnection").value = "";
  };

  //version
  const doGetSugressionsVersionList = async () => {
    const sugressionsVersionListResult = await httpClient.get(
      apiName.storeProcedures.versionList
    );
    setversionList(sugressionsVersionListResult.data.result);
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Store procedures deploy</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <NavLink to="/Home">Home</NavLink>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <section className="content">
        <div className="content-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div
                className="overlay-wrapper"
                style={{ visibility: isLoad ? "visible" : "hidden" }}
              >
                <div className="overlay">
                  <i className="fas fa-3x fa-sync-alt fa-spin"></i>
                  <div
                    style={{ marginLeft: 10 }}
                    className="text-bold pt-2 animate__animated animate__shakeY animate__infinite animate__slow"
                  >
                    {" "}
                    Loading...
                  </div>
                </div>
              </div>
              {renderInputTargetServerCriteria()}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Deploy;
