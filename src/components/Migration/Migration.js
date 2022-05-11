import React, { useEffect, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { apiName, apiUrl, OK } from "../../constants";
import { httpClient } from "../../utils/httpClient";
import Swal from "sweetalert2";
import _ from "lodash";
import { JSONTree } from "react-json-tree";
import DynamicTable from "../../utils/dynamicTable";
import SelectSearch from "react-select-search";
import Fuse from "fuse.js";

const Migration = () => {
  const [isLoad, setisLoad] = useState(false);

  const [connectionListDropDown, setconnectionListDropDown] = useState([])
  const [mantisConnectionListDropDown, setmantisConnectionListDropDown] =
    useState([]);
  const [visionConnectionListDropDown, setvisionConnectionListDropDown] =
    useState([]);

    
  const [connectionVisionSelect, setconnectionVisionSelect] = useState("");
  const [connectionMantisSelect, setconnectionMantisSelect] = useState("");

  const [mantisConnection, setmantisConnection] = useState("");
  const [mantisDatabase, setmantisDatabase] = useState("");
  const [mantisUsername, setmantisUsername] = useState("");
  const [mantisPassword, setmantisPassword] = useState("");

  const [visionConnection, setvisionConnection] = useState("");
  const [visionDatabase, setvisionDatabase] = useState("");
  const [visionUsername, setvisionUsername] = useState("");
  const [visionPassword, setvisionPassword] = useState("");

  const [isForceCreateTable, setisForceCreateTable] = useState(false);

  const [tbExternalConnectionsResult, settbExternalConnectionsResult] =
    useState(null);
  const [tbDatasourceResult, settbDatasourceResult] = useState(null);

  useEffect(() => {
    doGetConnectionList();
  }, []);

  const doMigration = async () => {
    try {
      Swal.fire({
        title: "Are you sure to Migration?",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Do it now!",
        showClass: {
          popup: "animate__animated animate__shakeX",
        },
        hideClass: {
          popup: "animate__animated animate__flipOutX",
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          setisLoad(true);

          const config = {
            forceCreateTable: isForceCreateTable,
            mantis_connection: {
              connection: mantisConnection,
              database: mantisDatabase,
              username: mantisUsername,
              password: mantisPassword,
            },
            vision_connection: {
              connection: visionConnection,
              database: visionDatabase,
              username: visionUsername,
              password: visionPassword,
            },
          };
          try {
            const response_tbExternalConnections = await httpClient.patch(
              apiName.migration.tbExternalConnections,
              config
            );
            const response_tbDatasource = await httpClient.patch(
              apiName.migration.tbDatasource,
              config
            );

            settbExternalConnectionsResult(response_tbExternalConnections.data);
            settbDatasourceResult(response_tbDatasource.data);

            if (
              response_tbExternalConnections.data.api_result == OK &&
              response_tbDatasource.data.api_result == OK
            ) {
              Swal.fire({
                title: "Migration success",
                icon: "success",
                showClass: {
                  popup: "animate__animated animate__rubberBand",
                },
                hideClass: {
                  popup: "animate__animated animate__flipOutX",
                },
              });
            } else {
              Swal.fire({
                title: "Migration failed (1)",
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
            Swal.fire({
              title: "Migration failed (2)",
              icon: "error",
              showClass: {
                popup: "animate__animated animate__shakeX",
              },
              hideClass: {
                popup: "animate__animated animate__flipOutX",
              },
            });
          } finally {
            setisLoad(false);
          }
        }
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Migration failed",
        icon: "error",
        showClass: {
          popup: "animate__animated animate__shakeX",
        },
        hideClass: {
          popup: "animate__animated animate__flipOutX",
        },
      });
    } finally {
      setisLoad(false);
    }
  };

  const doSelectConnectionMantis = (connection) => {
    connection = JSON.parse(connection);

    for (let index = 0; index < connectionListDropDown.length; index++) {
      const item = connectionListDropDown[index];
      if (
        connection.connection_name === item.connection_name &&
        connection.connection_type === item.connection_type
      ) {
        setmantisConnection(item.connection_string_encrypt.connection_name);
        setmantisDatabase(item.connection_string_encrypt.database_name);
        setmantisUsername(item.connection_string_encrypt.username);
        setmantisPassword(item.connection_string_encrypt.password);
        return;
      }
    }
  };
  const doSelectConnectionVision = (connection) => {
    connection = JSON.parse(connection);
    console.log(connection);
    for (let index = 0; index < connectionListDropDown.length; index++) {
      const item = connectionListDropDown[index];
      if (
        connection.connection_name === item.connection_name &&
        connection.connection_type === item.connection_type
      ) {
        setvisionConnection(item.connection_string_encrypt.connection_name);
        setvisionDatabase(item.connection_string_encrypt.database_name);
        setvisionUsername(item.connection_string_encrypt.username);
        setvisionPassword(item.connection_string_encrypt.password);
        return;
      }
    }
  };

  const fuzzySearch = (options) => {
    const fuse = new Fuse(options, {
      keys: ["name", "groupName", "items.name"],
      threshold: 0.3,
    });
    return (value) => {
      if (!value.length) {
        return options;
      }
      return fuse.search(value).map(({ item }) => item);
    };
  };

  const renderInputTargetServerCriteria = () => {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          doMigration();
        }}
      >
        <div className="card card-dark">
          <div className="card-header">
            <h3 className="card-title">Server criteria</h3>
            <div class="card-tools">
              <button
                type="button"
                class="btn btn-tool"
                data-card-widget="collapse"
              >
                <i class="fas fa-minus"></i>
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-12">
                <div className="card card-warning">
                  <div className="card-header">
                    <h3 className="card-title">Mantis's server </h3>
                  </div>
                  <div className="card-body row" style={{ borderRadius: 10 }}>
                    <div className="col-sm-12">
                      <div className="form-group">
                        <label>Connection : </label>
                        <SelectSearch
                          options={mantisConnectionListDropDown}
                          search
                          filterOptions={fuzzySearch}
                          value={connectionMantisSelect}
                          onChange={(value) => {
                            setconnectionMantisSelect(value);
                            doSelectConnectionMantis(value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Connection name :</label>
                        <input
                          required
                          value={mantisConnection}
                          onChange={(e) => {
                            setmantisConnection(e.target.value);
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
                          value={mantisDatabase}
                          onChange={(e) => {
                            setmantisDatabase(e.target.value);
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
                          value={mantisUsername}
                          onChange={(e) => {
                            setmantisUsername(e.target.value);
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
                          value={mantisPassword}
                          onChange={(e) => {
                            setmantisPassword(e.target.value);
                          }}
                          className="form-control"
                          placeholder="database password"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card card-primary">
                  <div className="card-header">
                    <h3 className="card-title">vision's server </h3>
                  </div>
                  <div className="card-body row" style={{ borderRadius: 10 }}>
                    <div className="col-sm-12">
                      <div className="form-group">
                        <label>Connection : </label>
                        <SelectSearch
                          options={visionConnectionListDropDown}
                          search
                          filterOptions={fuzzySearch}
                          value={connectionVisionSelect}
                          onChange={(value) => {
                            setconnectionVisionSelect(value);
                            doSelectConnectionVision(value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label>Connection name :</label>
                        <input
                          required
                          value={visionConnection}
                          onChange={(e) => {
                            setvisionConnection(e.target.value);
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
                          value={visionDatabase}
                          onChange={(e) => {
                            setvisionDatabase(e.target.value);
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
                          value={visionUsername}
                          onChange={(e) => {
                            setvisionUsername(e.target.value);
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
                          value={visionPassword}
                          onChange={(e) => {
                            setvisionPassword(e.target.value);
                          }}
                          className="form-control"
                          placeholder="database password"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="forceCreateTable"
                    onChange={(e) => {
                      setisForceCreateTable(e.target.checked);
                    }}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="forceCreateTable"
                  >
                    Force create table
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button type="submit" className="btn btn-primary">
              <i
                className="nav-icon fas fa-compress-alt"
                style={{ marginRight: 5 }}
              />
              Migrate
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

  const renderConnection = (connectionListDropDown) => {
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
  const doGetConnectionList = async () => {
    const connection_data = await httpClient.get(
      apiName.storeConnection.connection
    );
    if (connection_data.data.api_result == OK) {
      setconnectionListDropDown(connection_data.data.result);


      const mantisDropdown = _.filter(
        connection_data.data.result,
        function (item) {
          return item.connection_type == "mantis";
        }
      );
      let newMantisDropdown = [];
      for (let index = 0; index < mantisDropdown.length; index++) {
        const item = mantisDropdown[index];

        newMantisDropdown.push({
          name: item.connection_name + "(" + item.connection_type + ")",
          value: JSON.stringify({
            connection_name: item.connection_name,
            connection_type: item.connection_type,
          }),
        });
      }
      setmantisConnectionListDropDown(newMantisDropdown);


      const visionDropdown = _.filter(
        connection_data.data.result,
        function (item) {
          return item.connection_type == "vision";
        }
      );
      let newVisionDropdown = [];
      for (let index = 0; index < visionDropdown.length; index++) {
        const item = visionDropdown[index];

        newVisionDropdown.push({
          name: item.connection_name + "(" + item.connection_type + ")",
          value: JSON.stringify({
            connection_name: item.connection_name,
            connection_type: item.connection_type,
          }),
        });
      }
      setvisionConnectionListDropDown(newVisionDropdown);
    }
  };

  const doReset = () => {
    setmantisConnection("");
    setmantisDatabase("");
    setmantisUsername("");
    setmantisPassword("");

    setvisionConnection("");
    setvisionDatabase("");
    setvisionUsername("");
    setvisionPassword("");

    setconnectionMantisSelect("")
    setconnectionVisionSelect("")
  };

  const renderMigrationResult = () => {
    if (tbExternalConnectionsResult && tbDatasourceResult) {
      const renderOriginal_success_data_tbExternalConnectionsResult = () => {
        if (tbExternalConnectionsResult.original_success_data.length > 0) {
          return (
            <div className="card card-dark">
              <div className="card-header">
                <h3 className="card-title">Mantis data</h3>
              </div>
              <div
                className="card-body table-responsive p-0"
                style={{ maxHeight: 500 }}
              >
                <DynamicTable
                  headers={Object.keys(
                    tbExternalConnectionsResult.original_success_data[0]
                  )}
                  rows={tbExternalConnectionsResult.original_success_data}
                />
              </div>
            </div>
          );
        }
      };

      const renderDataToVision_success_tbExternalConnectionsResult = () => {
        if (tbExternalConnectionsResult.dataToVision_success.length > 0) {
          return (
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">Vision data</h3>
              </div>
              <div
                className="card-body table-responsive p-0"
                style={{ maxHeight: 500 }}
              >
                <DynamicTable
                  headers={Object.keys(
                    tbExternalConnectionsResult.dataToVision_success[0]
                  )}
                  rows={tbExternalConnectionsResult.dataToVision_success}
                />
              </div>
            </div>
          );
        }
      };

      const renderDataToVision_failed_tbExternalConnectionsResult = () => {
        if (tbExternalConnectionsResult.dataToVision_failed.length > 0) {
          let data = [];
          for (
            let index = 0;
            index < tbExternalConnectionsResult.dataToVision_failed.length;
            index++
          ) {
            const item = tbExternalConnectionsResult.dataToVision_failed[index];
            data.push({
              error: <JSONTree data={item.error.errors} />,
              ...item.item,
            });
          }
          return (
            <div className="card card-danger">
              <div className="card-header">
                <h3 className="card-title">Failed data</h3>
              </div>
              <div
                className="card-body table-responsive p-0"
                style={{ maxHeight: 500 }}
              >
                <DynamicTable headers={Object.keys(data[0])} rows={data} />
              </div>
            </div>
          );
        }
      };

      const renderOriginal_success_data_tbDatasourceResult = () => {
        if (tbDatasourceResult.original_success_data.length > 0) {
          return (
            <div className="card card-dark">
              <div className="card-header">
                <h3 className="card-title">Mantis data</h3>
              </div>
              <div
                className="card-body table-responsive p-0"
                style={{ maxHeight: 500 }}
              >
                <DynamicTable
                  headers={Object.keys(
                    tbDatasourceResult.original_success_data[0]
                  )}
                  rows={tbDatasourceResult.original_success_data}
                />
              </div>
            </div>
          );
        }
      };

      const renderDataToVision_success_tbDatasourceResult = () => {
        if (tbDatasourceResult.dataToVision_success.length > 0) {
          return (
            <div className="card card-primary">
              <div className="card-header">
                <h3 className="card-title">Vision data</h3>
              </div>
              <div
                className="card-body table-responsive p-0"
                style={{ maxHeight: 500 }}
              >
                <DynamicTable
                  headers={Object.keys(
                    tbDatasourceResult.dataToVision_success[0]
                  )}
                  rows={tbDatasourceResult.dataToVision_success}
                />
              </div>
            </div>
          );
        }
      };

      const renderDataToVision_failed_tbDatasourceResult = () => {
        if (tbDatasourceResult.dataToVision_failed.length > 0) {
          let data = [];
          for (
            let index = 0;
            index < tbDatasourceResult.dataToVision_failed.length;
            index++
          ) {
            const item = tbDatasourceResult.dataToVision_failed[index];
            data.push({
              error: <JSONTree data={item.error.errors} />,
              ...item.item,
            });
          }
          return (
            <div className="card card-danger">
              <div className="card-header">
                <h3 className="card-title">Failed data</h3>
              </div>
              <div
                className="card-body table-responsive p-0"
                style={{ maxHeight: 500 }}
              >
                <DynamicTable headers={Object.keys(data[0])} rows={data} />
              </div>
            </div>
          );
        }
      };

      return (
        <>
          <div className="card card-success">
            <div className="card-header">
              <h3 className="card-title">tbExternalConnections</h3>
              <div class="card-tools">
                <button
                  type="button"
                  class="btn btn-tool"
                  data-card-widget="collapse"
                >
                  <i class="fas fa-minus"></i>
                </button>
              </div>
            </div>
            <div className="card-body">
              <JSONTree data={tbExternalConnectionsResult} />
              <div className="row">
                <div className="col-sm-6">
                  {renderOriginal_success_data_tbExternalConnectionsResult()}
                </div>
                <div className="col-sm-6">
                  {renderDataToVision_success_tbExternalConnectionsResult()}
                </div>
                <div className="col-sm-12">
                  {renderDataToVision_failed_tbExternalConnectionsResult()}
                </div>
              </div>
            </div>
          </div>
          <div className="card card-success">
            <div className="card-header">
              <h3 className="card-title">tbDatasourceResult</h3>
              <div class="card-tools">
                <button
                  type="button"
                  class="btn btn-tool"
                  data-card-widget="collapse"
                >
                  <i class="fas fa-minus"></i>
                </button>
              </div>
            </div>
            <div className="card-body">
              <JSONTree data={tbDatasourceResult} />
              <div className="row">
                <div className="col-sm-6">
                  {renderOriginal_success_data_tbDatasourceResult()}
                </div>
                <div className="col-sm-6">
                  {renderDataToVision_success_tbDatasourceResult()}
                </div>
                <div className="col-sm-12">
                  {renderDataToVision_failed_tbDatasourceResult()}
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Migration</h1>
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
              {renderMigrationResult()}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Migration;
