import React, { useEffect, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { apiName, apiUrl, OK, secretKey } from "../../../constants";
import { httpClient } from "../../../utils/httpClient";
import Swal from "sweetalert2";
import _ from "lodash";
import { JSONTree } from "react-json-tree";
import SelectSearch from "react-select-search";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Fuse from "fuse.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import MaterialReactTable from "material-react-table";
import CryptoJS from "crypto-js";

const animatedComponents = makeAnimated();

const EventLogRawData = () => {
  const [isLoad, setisLoad] = useState(false);
  const [connectionListDropDown, setconnectionListDropDown] = useState([]);
  const [
    visionConnectionListDropDown,
    setvisionConnectionListDropDown,
  ] = useState([]);
  const [connectionVisionSelect, setconnectionVisionSelect] = useState("");

  const [visionConnection, setvisionConnection] = useState("");
  const [visionDatabase, setvisionDatabase] = useState("");
  const [visionUsername, setvisionUsername] = useState("");
  const [visionPassword, setvisionPassword] = useState("");

  //search criteria data
  const [buList, setbuList] = useState([]);

  const [bu, setbu] = useState([]);
  const [startDate, setStartDate] = useState(
    moment()
      .startOf("day")
      .toDate()
  );
  const [endDate, setEndDate] = useState(moment().toDate());
  const [apiDuration, setapiDuration] = useState(100);
  const [connection, setconnection] = useState(null);

  const [searchResult, setsearchResult] = useState([]);

  useEffect(() => {
    doGetConnectionList();
  }, []);

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

  const doSelectConnectionVision = (connection) => {
    connection = JSON.parse(connection);
    for (let index = 0; index < connectionListDropDown.length; index++) {
      const item = connectionListDropDown[index];
      if (
        connection.connection_name === item.connection_name &&
        connection.connection_type === item.connection_type
      ) {
        const bytes = CryptoJS.AES.decrypt(
          item.connection_string_encrypt.password,
          secretKey
        );
        const password = bytes.toString(CryptoJS.enc.Utf8);
        setvisionConnection(item.connection_string_encrypt.connection_name);
        setvisionDatabase(item.connection_string_encrypt.database_name);
        setvisionUsername(item.connection_string_encrypt.username);
        setvisionPassword(password);

        doGetBu({
          connection: item.connection_string_encrypt.connection_name,
          database: item.connection_string_encrypt.database_name,
          username: item.connection_string_encrypt.username,
          password: password,
        });

        setconnection({
          connection: item.connection_string_encrypt.connection_name,
          database: item.connection_string_encrypt.database_name,
          username: item.connection_string_encrypt.username,
          password: password,
        });
        return;
      }
    }
  };

  const renderInputTargetServerCriteria = () => {
    return (
      <div className="col-sm-12">
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
      </div>
    );
  };

  const doGetConnectionList = async () => {
    setisLoad(true);
    try {
      const connection_data = await httpClient.get(
        apiName.storeConnection.connection
      );
      if (connection_data.data.api_result == OK) {
        setconnectionListDropDown(connection_data.data.result);

        const visionDropdown = _.filter(connection_data.data.result, function(
          item
        ) {
          return item.connection_type == "vision";
        });

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
    } catch (error) {
    } finally {
      setisLoad(false);
    }
  };

  const doGetBu = async (connection) => {
    try {
      setisLoad(true);
      const connection_data = await httpClient.post(apiName.analytics.bu, {
        connection,
      });
      let dropDownBu = [];
      for (let index = 0; index < connection_data.data.bu.length; index++) {
        const bu_ = connection_data.data.bu[index];
        dropDownBu.push({ label: bu_, value: bu_ });
      }
      setbuList(dropDownBu);
    } catch (error) {
      console.log(error);
    } finally {
      setisLoad(false);
    }
  };

  const doReset = () => {
    setStartDate(
      moment()
        .startOf("day")
        .toDate()
    );
    setEndDate(moment().toDate());
    setapiDuration(100);
    setbu([]);
  };

  const doSearch = async () => {
    try {
      setisLoad(true);
      const ciphertext = CryptoJS.AES.encrypt(
        JSON.stringify(connection),
        secretKey
      ).toString();
      const body = {
        bu: _.map(bu, (m) => {
          return m.value;
        }),
        startDate: moment(startDate).format("DD-MMM-yyyy HH:mm:ss"),
        endDate: moment(endDate).format("DD-MMM-yyyy HH:mm:ss"),
        apiDuration,
        connection: ciphertext,
      };
      const response = await httpClient.post(
        apiName.analytics.eventLogRawData,
        body
      );
      if (response.data.api_result == OK) {
        setsearchResult(response.data.result);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisLoad(false);
    }
  };

  const renderSearchCriteria = () => {
    if (
      visionConnection != "" &&
      visionDatabase != "" &&
      visionUsername != "" &&
      visionPassword != ""
    ) {
      return (
        <>
          <div className="col-sm-12">
            <div className="card card-dark">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  doSearch();
                }}
              >
                <div className="card-header">
                  <h3 className="card-title">Search criteria </h3>
                </div>
                <div className="card-body row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>BU : </label>
                      <Select
                        options={buList}
                        isMulti
                        value={bu}
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        onChange={(value) => {
                          console.log(value);
                          setbu(value);
                        }}
                        placeholder="All"
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <label>Api Duration more than : </label>
                    <input
                      required
                      value={apiDuration}
                      onChange={(e) => {
                        setapiDuration(e.target.value);
                      }}
                      className="form-control"
                      placeholder="db Connection name"
                      step="1"
                      type="number"
                    />
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Start Date time : </label>
                      <DatePicker
                        required
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        timeInputLabel="Time:"
                        dateFormat="dd-MMM-yyyy hh:mm aa"
                        showTimeInput
                        withPortal
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>End Date time : </label>
                      <DatePicker
                        required
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        timeInputLabel="Time:"
                        dateFormat="dd-MMM-yyyy hh:mm aa"
                        showTimeInput
                        withPortal
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <button type="submit" className="btn btn-primary">
                    <i
                      className="nav-icon fas fa-search"
                      style={{ marginRight: 5 }}
                    />
                    Search
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
              </form>
            </div>
          </div>
          <div className="col-sm-12">
            <div className="card card-success">
              <div className="card-header">
                <h3 className="card-title">Result </h3>
              </div>
              <div className="card-body table-responsive p-0">
                {/* {renderResult()} */}
                {renderTable()}
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  const renderTable = () => {
    const columns = [
      { accessorKey: "bu", header: "BU" },

      {
        accessorKey: "apiDuration",
        header: "Api Duration",
        Cell: ({ cell, row }) =>
          moment.utc(cell.getValue() * 1000).format("HH:mm:ss") +
          " (" +
          parseInt(cell.getValue()) +
          ")",
      },
      { accessorKey: "storedProcedureName", header: "StoredProcedure Name" },
      {
        accessorKey: "apiName",
        header: "Api Name",
      },
      {
        accessorKey: "apiStartTime",
        header: "Api Start Time",
        Cell: ({ cell, row }) =>
          moment(cell.getValue()).format("DD-MMM-yyyy HH:mm:ss"),
      },
      {
        accessorKey: "apiEndTime",
        header: "Api End Time",
        Cell: ({ cell, row }) =>
          moment(cell.getValue()).format("DD-MMM-yyyy HH:mm:ss"),
      },
      { accessorKey: "logType", header: "Log type" },
      { accessorKey: "logDetail", header: "Log detail" },
      {
        accessorKey: "parameter",
        header: "Parameter",
        size: 400,
        Cell: ({ cell, row }) => (
          <div class="card card-defalut collapsed-card">
            <div className="card-header">
              <h3 className="card-title">
                <button
                  type="button"
                  className="btn btn-tool"
                  data-card-widget="collapse"
                >
                  <i className="fas fa-plus" style={{ marginLeft: 10 }} />
                </button>
              </h3>
              <div className="card-tools"></div>
            </div>

            <div className="card-body" style={{ display: "none" }}>
              <JSONTree data={JSON.parse(cell.getValue())} hideroot={true} />
            </div>
          </div>
        ),
      },
    ];
    return (
      <MaterialReactTable
        columns={columns}
        data={searchResult}
        // enableRowSelection //enable some features
        enableColumnOrdering
        enableGlobalFilter={false} //turn off a feature
      />
    );
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Event log Rawdata</h1>
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
              {renderSearchCriteria()}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventLogRawData;
