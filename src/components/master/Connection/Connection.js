import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { httpClient } from "../../../utils/httpClient";
import moment from "moment";
import Swal from "sweetalert2";
import { apiName, OK } from "../../../constants";

const Connection = () => {
  const [isLoad, setisLoad] = useState(false);

  const [name, setname] = useState("");
  const [connection_type, setconnection_type] = useState("");
  const [connection_name, setconnection_name] = useState("");
  const [database_name, setdatabase_name] = useState("");
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");

  const [connectionList, setconnectionList] = useState([]);

  useEffect(() => {
    doGetConnectionList();
  }, []);

  const doCreateConnectmaster = async () => {
    setisLoad(true);
    const data = {
      connection_name: name,
      connection_type,
      connection_string: {
        connection_name,
        database_name,
        username,
        password,
      },
    };
    const response = await httpClient.post(
      apiName.storeConnection.connection,
      data
    );
    if (response.data.api_result == OK) {
      doGetConnectionList();
      Swal.fire({
        title: "Create connection completed",
        icon: "success",
        showClass: {
          popup: "animate__animated animate__bounce",
        },
        hideClass: {
          popup: "animate__animated animate__flipOutX",
        },
      });
    } else {
      Swal.fire({
        title: "Create connection error",
        icon: "error",
        showClass: {
          popup: "animate__animated animate__shakeX",
        },
        hideClass: {
          popup: "animate__animated animate__flipOutX",
        },
      });
    }
    try {
    } catch (error) {
    } finally {
      setisLoad(false);
    }
  };

  const renderCreateConnection = () => {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          doCreateConnectmaster();
        }}
        className="col-sm-12"
      >
        <div className="card card-dark">
          <div className="card-header"></div>
          <div className="card-body">
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
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Name :</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => {
                      setname(e.target.value);
                    }}
                    className="form-control"
                    placeholder="name"
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Connection type</label>
                  <input
                    required
                    value={connection_type}
                    onChange={(e) => {
                      setconnection_type(e.target.value);
                    }}
                    className="form-control"
                    placeholder="Connection type"
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Connection name (Connection string) :</label>
                  <input
                    required
                    value={connection_name}
                    onChange={(e) => {
                      setconnection_name(e.target.value);
                    }}
                    className="form-control"
                    placeholder="Connection name"
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Database name :</label>
                  <input
                    required
                    value={database_name}
                    onChange={(e) => {
                      setdatabase_name(e.target.value);
                    }}
                    className="form-control"
                    placeholder="Database name"
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
          <div className="card-footer">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <button
              type="reset"
              onClick={() => {
                setname("");
                setconnection_type("");
                setconnection_name("");
                setdatabase_name("");
                setusername("");
                setpassword("");
              }}
              className="btn btn-default float-right"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    );
  };

  const doGetConnectionList = async () => {
    const connection_data = await httpClient.get(
      apiName.storeConnection.connection
    );
    if (connection_data.data.api_result == OK) {
      setconnectionList(connection_data.data.result);
    }
  };

  const doDeleteConnection = async (connection_name, connection_type) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await httpClient.delete(
          apiName.storeConnection.connection,
          {
            data: { connection_name, connection_type },
          }
        );

        if (response.data.api_result == OK) {
          doGetConnectionList();
          Swal.fire("Deleted!", "Your Connection has been deleted.", "success");
        } else {
          Swal.fire(
            "Failed!",
            "Your Connection has been failed to delete.",
            "error"
          );
        }
      }
    });
  };

  const renderConnection = () => {
    const renderTable = (itemData) => {
      return (
        <table
          className="table table-head-fixed table-hover text-nowrap"
          role="grid"
        >
          <thead>{renderTableHeader()}</thead>
          <tbody>{renderTableRow()}</tbody>
        </table>
      );
    };

    const renderTableHeader = () => {
      return (
        <tr role="row">
          <th>Connection Name</th>
          <th>Connection Type</th>
          {/* <th>Update by</th> */}
          <th>Create At</th>
          <th>Update At</th>
          <th>Action</th>
        </tr>
      );
    };

    const renderTableRow = () => {
      return connectionList.map((item, index) => (
        <tr>
          <td>{item.connection_name}</td>
          {/* <td>{item.type}</td> */}
          <td>{item.connection_type}</td>
          {/* <td>{item.updateBy}</td> */}
          <td>{moment(item.createdAt).format("DD-MMM-YY HH:MM:ss")}</td>
          <td>{moment(item.updatedAt).format("DD-MMM-YY HH:MM:ss")}</td>
          <td>
            <button
              className={"btn btn-danger"}
              onClick={(e) => {
                e.preventDefault();
                doDeleteConnection(item.connection_name, item.connection_type);
              }}
            >
              Delete
            </button>
          </td>
        </tr>
      ));
    };

    if (connectionList.length > 0) {
      return (
        <div className="col-sm-12">
          <div className="card card-primary">
            {/* <div className="card-header"></div> */}
            <div className="card-body">{renderTable()}</div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Connection master</h1>
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
            {renderCreateConnection()}
            {renderConnection()}
          </div>
          {/* <div className="row">{renderGeckoItem()}</div> */}
        </div>
      </section>
    </div>
  );
};

export default Connection;
