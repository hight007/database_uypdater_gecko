import React, { useEffect, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { apiName, OK } from "../../../constants";
import { textAreaToArray } from "../../../utils/shareFunction";
import { httpClient } from "../../../utils/httpClient";
import moment from "moment";
import Swal from "sweetalert2";

const Gecko_item = () => {
  const [isLoad, setisLoad] = useState(false);
  const [isLoadItem, setisLoadItem] = useState({});

  const [itemCategory, setitemCategory] = useState("");
  const [itemName, setitemName] = useState("");

  const [itemList, setitemList] = useState([
    "Dashboard",
    "Widget",
    "Filter",
    "Datasource",
  ]);
  const [itemData, setitemData] = useState({});

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
  };

  //create
  const doCreateGeckoItem = async () => {
    if (itemName == "" || itemCategory == "") {
      Swal.fire(
        "Please select",
        "Please select item Category and item Name",
        "error"
      );
      return;
    }
    allSetisLoadItem(true);
    setisLoad(true);

    const itemNameList = textAreaToArray(itemName);
    const type = itemCategory;
    for (let index = 0; index < itemNameList.length; index++) {
      const item = itemNameList[index];
      const body = { type, name: item };
      await httpClient.post(apiName.gecko.tbGeckoItemNameList, body);
    }
    await doGetGeckoItemByItem(type);
    allSetisLoadItem(false);
    setisLoad(false);
  };
  const renderCreateNewGeckoItem = () => {
    const renderItemOption = () => {
      return itemList.map((item) => <option value={item}>{item}</option>);
    };
    return (
      <div className="col-12">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            doCreateGeckoItem();
          }}
        >
          <div className="card card-dark">
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
            <div className="card-header">
              <h3 className="card-title">Create new Gecko item</h3>
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

            <div className="card-body" style={{ display: "block" }}>
              <div className="form-group">
                <label>item Category :</label>
                <select
                  class="custom-select form-control-border border-width-2"
                  value={itemCategory}
                  onChange={(e) => {
                    setitemCategory(e.target.value);
                  }}
                >
                  <option value="">---Select item---</option>
                  {renderItemOption()}
                </select>
              </div>
              <div className="form-group">
                <label>item name :</label>
                <textArea
                  className="form-control"
                  placeholder="list item name"
                  rows="5"
                  value={itemName}
                  onChange={(e) => {
                    setitemName(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="card-footer">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
              <button
                type="reset"
                onClick={() => {
                  setitemName("");
                  setitemCategory("");
                }}
                className="btn btn-default float-right"
              >
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  };

  //get
  const doGetGeckoItem = async () => {
    allSetisLoadItem(true);
    setisLoad(true);

    let itemData_ = {};
    for (let index = 0; index < itemList.length; index++) {
      const keyName = itemList[index];
      const response = await httpClient.get(
        apiName.gecko.tbGeckoItemNameList + "/type/" + keyName
      );
      if (response.data.api_result === OK) {
        itemData_[keyName] = response.data.result;
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
      itemData_[type] = response.data.result;
    }

    await setitemData(itemData_);
  };

  //update
  const doChangeStatusGecokItem = async (name, type, isDeleted) => {
    Swal.fire({
      title: "Are you sure?",
      text: `${isDeleted ? "Deactivate" : "Activate"} ${type} : ${name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Deactivate it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const body = {
          name,
          type,
          isDeleted,
        };
        const response = await httpClient.put(
          apiName.gecko.tbGeckoItemNameList,
          body
        );
        if (response.data.api_result === OK) {
          doGetGeckoItemByItem(type);

          Swal.fire(
            isDeleted ? "Deactivated!" : "Activated!",
            `${type} : ${name} has been ${
              isDeleted ? "deactivated" : "activated"
            }.`,
            "success"
          ).then(() => {
            setisloadByitem(type, false);
            forceUpdate();
          });
        } else {
          Swal.fire(
            "Error",
            `${type} : ${name} has not been deactivated.`,
            "error"
          ).then(() => {
            setisloadByitem(type, false);
            forceUpdate();
          });
        }
      } else {
        setisloadByitem(type, false);
        forceUpdate();
      }
    });
  };

  //delete
  const doDeleteGeckoItem = async (name, type) => {
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
        setisloadByitem(type, true)
        forceUpdate();
        const response = await httpClient.delete(
          apiName.gecko.tbGeckoItemNameList,
          {
            data: { name, type },
          }
        );
        console.log(response.data);
        if (response.data.api_result === OK) {
          await doGetGeckoItemByItem(type);
          forceUpdate();
          Swal.fire("Deleted!", "Your item (" + name + ") has been deleted.", "success");
        } else {
          Swal.fire("error!", "Your item  (" + name + ") is not delete.", "error");
        }
        setisloadByitem(type, false)
        forceUpdate();
      }
    });
  };

  //render
  const renderGeckoItem = () => {
    const renderTableHeader = () => {
      return (
        <tr role="row">
          <th>Status</th>
          {/* <th>Type</th> */}
          <th>Name</th>
          <th>Delete</th>
        </tr>
      );
    };

    const renderTableRow = (data) => {
      if (data.length > 0) {
        return data.map((item, index) => (
          <tr>
            <td>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  onChange={() => {
                    setisloadByitem(item.type, true);
                    forceUpdate();

                    doChangeStatusGecokItem(
                      item.name,
                      item.type,
                      !item.isDeleted
                    );
                  }}
                  checked={!item.isDeleted}
                />
                <label className="form-check-label">
                  {item.isDeleted ? "InActive" : "Active"}
                </label>
              </div>
            </td>
            {/* <td>{item.type}</td> */}
            <td>{item.name}</td>
            <td>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => {
                  doDeleteGeckoItem(item.name, item.type);
                }}
              >
                Delete
              </button>
            </td>
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
          <div
            className="overlay-wrapper"
            style={{ visibility: isLoadItem[item] ? "visible" : "hidden" }}
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
          <div className="card card-secondary">
            <div className="card-header">
              <h3 className="card-title">{item}</h3>
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
 
  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Gecko item</h1>
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
          <div className="row">{renderCreateNewGeckoItem()}</div>
          <div className="row">{renderGeckoItem()}</div>
        </div>
      </section>
    </div>
  );
};

export default Gecko_item;
