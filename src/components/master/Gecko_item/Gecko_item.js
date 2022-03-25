import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { textAreaToArray } from "../../../utils/shareFunction";

const Gecko_item = () => {
  const [itemCategory, setitemCategory] = useState("");
  const [itemName, setitemName] = useState("");

  const doCreateGeckoItem = () => {
    const itemNameList = textAreaToArray(itemName);
    console.log(itemNameList);
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
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-dark">
                <div className="card-header"></div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    doCreateGeckoItem();
                  }}
                >
                  <div className="card-body">
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
                        <option value="Dashboard">Dashboard</option>
                        <option value="Widget">Widget</option>
                        <option value="Filter">Filter</option>
                        <option value="Datasource">Datasource</option>
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
                      className="btn btn-default float-right"
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gecko_item;
