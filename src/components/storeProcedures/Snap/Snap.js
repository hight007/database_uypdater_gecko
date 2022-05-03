import React, { useEffect, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { apiName, OK } from "../../../constants";
import { textAreaToArray, arraySlice } from "../../../utils/shareFunction";
import { httpClient } from "../../../utils/httpClient";
import moment from "moment";
import Swal from "sweetalert2";
import _ from "lodash";

const Snap = () => {
  const [version, setversion] = useState("");
  const [sugressionsVersionList, setsugressionsVersionList] = useState([]);

  const [isLoad, setisLoad] = useState(false);
  const [snapResult, setsnapResult] = useState(null);

  useEffect(() => {
    doGetSugressionsVersionList();
  }, []);

  const doSnap = async () => {
    if (version != null && version != "") {
      try {
        setisLoad(true);
        const result = await httpClient.post(
          apiName.storeProcedures.storeProcedures,
          { version }
        );
        if (result.data.api_result == OK) {
          setsnapResult(result.data);
          Swal.fire({
            title: `Snap storeProcedures version ${version} completed`,
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
            title: `Snap storeProcedures version ${version} failed`,
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
          title: `Snap storeProcedures version ${version} failed`,
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
        title: "Please Input version before Snap",
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

  const doRemoveStoreProcedures = () => {
    if (version != null && version != "") {
      Swal.fire({
        title: "Do you want to save the changes?",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Remove",
        showClass: {
          popup: "animate__animated animate__flipInX",
        },
        hideClass: {
          popup: "animate__animated animate__flipOutX",
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          setisLoad(true);
          const remove_result = await httpClient.delete(
            apiName.storeProcedures.storeProcedures,
            { data: { version } }
          );

          if (remove_result.data.api_result == OK) {
            setsnapResult(null);
            Swal.fire({
              title: `Remove storeProcedures version ${version} completed`,
              text: `Remove ${remove_result.data.result} items`,
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
              title: `Remove storeProcedures version ${version} failed`,
              icon: "error",
              showClass: {
                popup: "animate__animated animate__shakeX",
              },
              hideClass: {
                popup: "animate__animated animate__flipOutX",
              },
            });
          }
          setisLoad(false);
        }
      });
    } else {
      Swal.fire({
        title: "Please Input version before Remove",
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

  const renderSnapResult = () => {
    const renderLi = (data) => {
      return data.map((item) => <li>{item}</li>);
    };
    if (snapResult) {
      return (
        <div className="row">
          <div className="col-sm-6">
            <div className="card card-success">
              <div className="card-header">
                <h3 className="card-title">Success list</h3>
              </div>
              <div
                className="card-body"
                style={{ maxHeight: "15em", overflow: "auto" }}
              >
                <ol style={{ listStyle: "decimal" }}>
                  {renderLi(snapResult.success_list)}
                </ol>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card card-danger">
              <div className="card-header">
                <h3 className="card-title">Error list</h3>
              </div>
              <div
                className="card-body"
                style={{ maxHeight: "15em", overflow: "auto" }}
              >
                <ol style={{ listStyle: "decimal" }}>
                  {renderLi(snapResult.error_list)}
                </ol>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  const doGetSugressionsVersionList = async () => {
    try {
      setisLoad(true);
      const sugressionsVersionListResult = await httpClient.get(
        apiName.storeProcedures.versionList
      );
      setsugressionsVersionList(sugressionsVersionListResult.data.result);
    } catch (error) {
      console.log(error);
    } finally {
      setisLoad(false);
    }
  };

  const renderInputVersion = () => {
    const renderSugressionsVersion = () => {
      return sugressionsVersionList.map((item) => <option value={item} />);
    };
    return (
      <div className="card card-primary">
        <datalist id="sugressionVersion">{renderSugressionsVersion()}</datalist>
        <div className="card-header">
          <h3 className="card-title">Version</h3>
        </div>
        <div className="card-body">
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
        <div className="card-footer">
          <button className="btn btn-primary" type="submit">
            <i className="fas fa-pause" />
            {" Snap "}
          </button>
          <button
            className="btn btn-danger float-right"
            type="button"
            onClick={() => {
              doRemoveStoreProcedures();
            }}
          >
            <i className="fas fa-trash-alt" />
            {" remove "}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Store procedures snap</h1>
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
                  doSnap();
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
            <div className="col-md-12">{renderSnapResult()}</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Snap;
