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

  const [isLoad, setisLoad] = useState(false);
  const [isLoadItem, setisLoadItem] = useState({});

  const [itemList, setitemList] = useState([
    "Dashboard",
    "Widget",
    "Filter",
    "Datasource",
  ]);
  const [itemData, setitemData] = useState({});
  const [linkByItem, setlinkByItem] = useState({
    Dashboard: apiName.gecko.tbDashboardVersion,
    Widget: apiName.gecko.tbWidgetVersion,
    Filter: apiName.gecko.tbFilterVersion,
    Datasource: apiName.gecko.tbDatasourceVersion,
  });

  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  useEffect(() => {
    doGetGeckoItem();
  }, []);

  const allSetisLoadItem = (value) => {
    let isLoadItem_ = isLoadItem;
    for (let index = 0; index < itemList.length; index++) {
      const item = itemList[index];
      isLoadItem_[item] = value;
    }
    setisLoadItem(isLoadItem_);
  };
  const setisloadByitem = (item, value) => {
    let isLoadItem_ = isLoadItem;
    isLoadItem_[item] = value;
    setisLoadItem(isLoadItem_);
    forceUpdate();
  };

  //snap
  const doSnapByType = async (type) => {
    setisloadByitem(type, true);
    if (version == null || version == ''){
      Swal.fire(
        'No version number!',
        'Please input version number ,example : 2.2.1.1b18',
        'error'
      ).then(() => {
        setisloadByitem(type, false);
      })
      return
    } 
    try {
      const itemNameList = _.filter(itemData[type], (e) => {
        return !e.isDeleted;
      });
      const nameList = _.map(itemNameList, "name");

      console.log(nameList.length);
      const searchperCycle = 20;
      const fetchCycle = Math.ceil(nameList.length / searchperCycle);

      for (let index = 0; index < fetchCycle; index++) {
        const name = arraySlice(
          nameList,
          index * searchperCycle,
          (index + 1) * searchperCycle
        );

        let config = {
          version,
          name,
        };

        const response = await httpClient.post(linkByItem[type], config);

        let itemData_ = itemData;
        let itemDataType = itemData_[type];
        for (let index = 0; index < itemDataType.length; index++) {
          const item = itemDataType[index];
          let status_result = _.find(response.data.snap_result, {
            name: item.name,
          });
          if (status_result != null) {
            itemDataType[index].status = status_result.status;
          }
        }
        itemData_[type] = itemDataType;
        setitemData(itemData_);
        forceUpdate();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisloadByitem(type, false);
    }
  };

  //remove
  const doRemoveByType = async (type) => {
    setisloadByitem(type, true);
    try {
      const config = {version}
      const response = await httpClient.delete(linkByItem[type], {data : config}); 
      if (response.data.api_result == OK){
        await doGetGeckoItemByItem(type)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisloadByitem(type, false);
    }
  };

  //get data
  const doGetGeckoItem = async () => {
    allSetisLoadItem(true);
    setisLoad(true);
    // forceUpdate()

    let itemData_ = {};
    for (let index = 0; index < itemList.length; index++) {
      const keyName = itemList[index];
      const response = await httpClient.get(
        apiName.gecko.tbGeckoItemNameList + "/type/" + keyName
      );

      if (response.data.api_result === OK) {
        const data = _.filter(response.data.result, (e) => {
          return !e.isDeleted;
        });
        itemData_[keyName] = data;
      }
    }

    await setitemData(itemData_);

    allSetisLoadItem(false);
    setisLoad(false);
  };
  const doGetGeckoItemByItem = async (type) => {
    let itemData_ = itemData;
    const response = await httpClient.get(
      apiName.gecko.tbGeckoItemNameList + "/type/" + type
    );
    if (response.data.api_result === OK) {
      const data = _.filter(response.data.result, (e) => {
        return !e.isDeleted;
      });
      itemData_[type] = data;
    }

    await setitemData(itemData_);
    return
  };

  //render table
  const renderGeckoItem = () => {
    const renderTableHeader = () => {
      return (
        <tr role="row">
          <th>Status</th>
          {/* <th>Type</th> */}
          <th>Name</th>
        </tr>
      );
    };

    const renderStatus = (status) => {
      switch (status) {
        case "success":
          return <button className="btn btn-success btn-sm">{status}</button>;

        case "failed":
          return <button className="btn btn-danger btn-sm">{status}</button>;

        default:
          return <button className="btn btn-dark btn-sm">{status}</button>;
      }
    };
    const renderTableRow = (data) => {
      if (data.length > 0) {
        return data.map((item, index) => (
          <tr>
            <td>
              {item.status != null ? (
                <>{renderStatus(item.status)}</>
              ) : (
                <button className="btn btn-default btn-sm">Pending</button>
              )}
            </td>
            {/* <td>{item.type}</td> */}
            <td>{item.name}</td>
          </tr>
        ));
      } else {
        return (
          <tr className="text-center">
            <td colSpan="3">Data not found</td>
          </tr>
        );
      }
    };

    const renderTable = () => {
      return itemList.map((item) => (
        <div className="col-6">
          <div className="card card-secondary">
            <div className="card-header">
              <div
                className="overlay-wrapper"
                style={{ visibility: isLoadItem[item] ? "visible" : "hidden" }}
              >
                <div className="overlay">
                  <i className="fas fa-3x fa-sync-alt fa-spin"></i>
                  <div style={{marginLeft: 10}} className="text-bold pt-2 animate__animated animate__shakeY animate__infinite animate__slow"> Loading...</div>
                </div>
              </div>
              <h3 className="card-title">{item}</h3>

              <div className="card-tools">
                <button
                  className="btn btn-primary btn-xs"
                  onClick={() => {
                    doSnapByType(item);
                  }}
                >
                  <i className="fas fa-pause" />
                  {" snap "}
                </button>
                <button
                  className="btn btn-danger btn-xs"
                  style={{ marginLeft: 10 }}
                  onClick={() => {
                    doRemoveByType(item);
                  }}
                >
                  <i className="fas fa-trash-alt" />
                  {" remove "}
                </button>
                <button
                  type="button"
                  className="btn btn-tool"
                  data-card-widget="collapse"
                >
                  <i className="fas fa-minus" />
                </button>
              </div>
            </div>
            <div
              className="card-body table-responsive p-0"
              style={{ maxHeight: "30em" }}
            >
              <table
                className="table table-head-fixed table-hover text-nowrap"
                role="grid"
              >
                <thead>{renderTableHeader()}</thead>
                <tbody>{renderTableRow(itemData[item])}</tbody>
              </table>
            </div>
          </div>
        </div>
      ));
    };
 
    return (
      <>
        {itemData[itemList[0]] ? renderTable() : <></>}
        {/* {renderTable()} */}
      </>
    );
  };

  //render version input
  const renderInputVersion = () => {
    return (
      <div className="card card-primary">
        <div className="card-header">
          <h3 className="card-title">Version</h3>
        </div>
        <div className="card-body">
          <div className="form-group">
            <label>Version : </label>
            <input
              onChange={(e) => {
                setversion(e.target.value);
              }}
              className="form-control"
              placeholder="Enter version"
            />
          </div>
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
              <h1 className="m-0">Gecko snap</h1>
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
                  <div style={{marginLeft: 10}} className="text-bold pt-2 animate__animated animate__shakeY animate__infinite animate__slow"> Loading...</div>
                </div>
              </div>
              {renderInputVersion()}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="card card-dark">
                <div className="card-header">
                  <h3 className="card-title">Gecko item list</h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="collapse"
                    >
                      <i className="fas fa-minus" />
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">{renderGeckoItem()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Snap;
