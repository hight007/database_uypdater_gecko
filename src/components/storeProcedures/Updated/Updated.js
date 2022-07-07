import React, { useEffect, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { apiName, OK } from "../../../constants";
import { textAreaToArray, arraySlice } from "../../../utils/shareFunction";
import { httpClient } from "../../../utils/httpClient";
import moment from "moment";
import Swal from "sweetalert2";
import _ from "lodash";
import DynamicTable from "../../../utils/dynamicTable";

const Updated = () => {
  const [version, setversion] = useState("");
  const [spName, setspName] = useState("");

  const [isLoad, setisLoad] = useState(false);

  const [sugressionsVersionList, setsugressionsVersionList] = useState([]);
  const [sugressionSpName, setsugressionSpName] = useState([]);

  const [spList, setspList] = useState([]);

  useEffect(() => {
    initialize();
    
  }, []);

  const initialize = async () => {
    try {
      setisLoad(true);
      doGetStoreProceduresUpdate(); 
      await doGetSugressionsVersionList();
      await doGetSugressionsUpdatedSpNameList();
    } catch (error) {
      console.log(error);
    } finally {
      setisLoad(false);
    }
  };

  const doGetSugressionsVersionList = async () => {
    try {
      const sugressionsVersionListResult = await httpClient.get(
        apiName.storeProcedures.versionList
      );
      setsugressionsVersionList(sugressionsVersionListResult.data.result);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const doGetSugressionsUpdatedSpNameList = async () => {
    try {
      const sugressionsUpdatedSpNameListResult = await httpClient.get(
        apiName.storeProcedures.updatedSpName
      );
      setsugressionSpName(
        sugressionsUpdatedSpNameListResult.data.updated_store_procedure
      );
      return;
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const renderInputVersion = () => {
    const renderSugressionsVersion = () => {
      return sugressionsVersionList.map((item) => <option value={item} />);
    };
    const renderSugressionsUpdatedSpName = () => {
      return sugressionSpName.map((item) => <option value={item} />);
    };

    return (
      <div className="card card-primary">
        <datalist id="sugressionVersion">{renderSugressionsVersion()}</datalist>
        <datalist id="sugressionUpdatedSpName">
          {renderSugressionsUpdatedSpName()}
        </datalist>

        <div className="card-header">
          <h3 className="card-title">Version</h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label>Version : </label>
                <input
                  list="sugressionVersion"
                  required
                  autoComplete="true"
                  onChange={(e) => {
                    setversion(e.target.value);
                  }}
                  className="form-control"
                  placeholder="Enter version"
                />
              </div>
            </div>
            <div className="col-sm-6">
              <div className="form-group">
                <label>Store procedures : </label>
                <input
                  list="sugressionUpdatedSpName"
                  value={spName}
                  required
                  autoComplete="true"
                  onChange={(e) => {
                    setspName(e.target.value);
                  }}
                  className="form-control"
                  placeholder="Enter updated store procedures"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer">
          <button className="btn btn-primary" type="submit">
            <i className="fas fa-check" />
            {" Submit "}
          </button>
        </div>
      </div>
    );
  };

  const doCreateStoreProceduresUpdate = async () => {
    if (version != null && version != "" && spName != null && spName != "") {
      try {
        setisLoad(true);
        const result = await httpClient.post(
          apiName.storeProcedures.storeProceduresUpdate,
          { name: spName, version }
        );

        if (result.data.api_result == OK) {
          doGetStoreProceduresUpdate();
          setspName("");
          Swal.fire({
            title: `Record storeProcedures ${spName} , version ${version} completed`,
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
            title: `Record storeProcedures ${spName} , version ${version} failed`,
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
        Swal.fire({
          title: `Record storeProcedures ${spName} , version ${version} failed`,
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
    } else {
      Swal.fire({
        title: "Please Input version and storeProcedures before Snap",
        icon: "error",
        showClass: {
          popup: "animate__animated animate__shakeX",
        },
        hideClass: {
          popup: "animate__animated animate__flipOutX",
        },
      });
    }
  };

  const doGetStoreProceduresUpdate = async () => {
    let result = [];
    if (version == null || version == "") {
      result = await httpClient.get(
        apiName.storeProcedures.storeProceduresUpdate
      );
    } else {
      result = await httpClient.get(
        apiName.storeProcedures.storeProceduresUpdate + "/" + version
      );
    }

    console.log(result.data.result);
    setspList(result.data.result);
  };

  const renderTable = () => {
    if (spList.length > 0) {
      console.log(spList);
      return (
        <div className="card card-success">
          <div className="card-header">
            <h3 className="card-title">Table</h3>
          </div>
          <div className="card-body">
            <div
              className="card-body table-responsive p-0"
              style={{ maxHeight: 500 }}
            >
              <DynamicTable headers={Object.keys(spList[0])} rows={spList} />
            </div>
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
              <h1 className="m-0">Store procedures update record</h1>
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
            <div className="col-md-12">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  doCreateStoreProceduresUpdate();
                }}
              >
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
                {renderInputVersion()}
              </form>
            </div>
            <div className="col-md-12">{renderTable()}</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Updated;
