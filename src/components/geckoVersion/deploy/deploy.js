import React, { useEffect, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { apiName, OK } from "../../../constants";
import { textAreaToArray } from "../../../utils/shareFunction";
import { httpClient } from "../../../utils/httpClient";
import moment from "moment";
import Swal from "sweetalert2";
import _ from "lodash";

const Deploy = () => {
  const [isLoad, setisLoad] = useState(false);
  const [isLoadItem, setisLoadItem] = useState({});
  const [versionList, setversionList] = useState([]);
  const [connectionList, setconnectionList] = useState([]);
  const [connectionListDropDown, setconnectionListDropDown] = useState([]);

  const [version, setversion] = useState("");
  const [connection, setconnection] = useState("");
  const [database, setdatabase] = useState("");
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");

  const [itemCategory, setitemCategory] = useState("");
  const [itemList, setitemList] = useState([
    "Dashboard",
    "Widget",
    "Filter",
    "Datasource",
  ]);
  const [linkByItem, setlinkByItem] = useState({
    Dashboard: apiName.gecko.tbDashboard,
    Widget: apiName.gecko.tbWidget,
    Filter: apiName.gecko.tbFilter,
    Datasource: apiName.gecko.tbDatasource,
  });
  const [deployResult, setdeployResult] = useState(null);

  useEffect(() => {
    getVersionList();
    doGetConnectionList();
  }, []);

  const getVersionList = async () => {
    setisLoad(true);
    const response = await httpClient.get(apiName.gecko.version);

    setversionList(response.data.version);
    setisLoad(false);
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

    const renderItemOption = () => {
      return itemList.map((item) => <option value={item}>{item}</option>);
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
                      console.log(e.target.value);
                      setversion(e.target.value);
                    }}
                  >
                    <option value="">---Select Version---</option>
                    {renderVersion()}
                  </select>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>item Category :</label>
                  <select
                    class="form-control"
                    value={itemCategory}
                    onChange={(e) => {
                      setitemCategory(e.target.value);
                      doSetconnectionListDropDown(e.target.value);
                      document.getElementById("dropDownConnection").value = "";
                    }}
                  >
                    <option value="">---Select item---</option>
                    {renderItemOption()}
                  </select>
                </div>
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

  const doReset = () => {
    setversion("");
    setconnection("");
    setdatabase("");
    setusername("");
    setpassword("");
  };

  //deploy
  const doDeploy = async () => {
    setisLoad(true);
    try {
      if (itemCategory == "") {
        Swal.fire({
          title: "Please select item Category",
          icon: "error",
          showClass: {
            popup: "animate__animated animate__shakeX",
          },
          hideClass: {
            popup: "animate__animated animate__flipOutX",
          },
        });
      }
      let config = {
        version,
        connection,
        database,
        username,
        password,
      };

      const url = linkByItem[itemCategory];

      let response = await httpClient.patch(url, config);

      if (response.data.api_result == OK) {
        Swal.fire({
          title: "Deploy success",
          icon: "success",
          showClass: {
            popup: "animate__animated animate__shakeX",
          },
          hideClass: {
            popup: "animate__animated animate__flipOutX",
          },
        });
        setdeployResult(response.data);
      } else {
        Swal.fire({
          title: "Deploy error please try again",
          icon: "error",
          showClass: {
            popup: "animate__animated animate__shakeX",
          },
          hideClass: {
            popup: "animate__animated animate__flipOutX",
          },
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisLoad(false);
    }
  };

  //result
  const renderDeployResult = () => {
    if (deployResult != null) {
      const renderCreateList = () => {
        return deployResult.create_list.map((item) => <tr>{item}</tr>);
      };
      const renderUpdateList = () => {
        return deployResult.update_list.map((item) => <tr>{item}</tr>);
      };
      const renderErrorList = () => {
        return deployResult.error_list.map((item) => <tr>{item}</tr>);
      };
      return (
        <div className="card card-dark ">
          <div className="card-header">
            <h3 className="card-title">Deploy result</h3>
          </div>
          <div className="card-body row">
            <div className="col-sm-4">
              <div className="card card-success">
                <div className="card-header">
                  <h3 className="card-title">Create list</h3>
                </div>
                <div
                  className="card-body"
                  style={{ maxHeight: 200, overflow: "auto" }}
                >
                  {renderCreateList()}
                </div>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="card card-warning">
                <div className="card-header">
                  <h3 className="card-title">Update list</h3>
                </div>
                <div
                  className="card-body"
                  style={{ maxHeight: 200, overflow: "auto" }}
                >
                  {renderUpdateList()}
                </div>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="card card-danger">
                <div className="card-header">
                  <h3 className="card-title">Error list</h3>
                </div>
                <div
                  className="card-body"
                  style={{ maxHeight: 200, overflow: "auto" }}
                >
                  {renderErrorList()}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
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
    if (item === "Datasource") {
      listDropDown = _.filter(connectionList, function (item) {
        return item.connection_type == "mantis";
      });
    } else {
      listDropDown = _.filter(connectionList, function (item) {
        return item.connection_type == "vision";
      });
    }
    setconnection("");
    setdatabase("");
    setusername("");
    setpassword("");
    setconnectionListDropDown(listDropDown);
  };
  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Gecko Deploy</h1>
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
            <div className="col-sm-12">{renderDeployResult()}</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Deploy;
