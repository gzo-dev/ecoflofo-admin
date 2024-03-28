import React, { useState, useEffect } from "react";
import { GetLocationDetails } from "../../../../services";
import { Typography, Button } from "@material-ui/core";
import Edit from "../../tours/edit";
import swal from "sweetalert";
import { apiDeleteTour, apiGetListTour } from "../../../../../api";
import moment from "moment"
import {Link } from "react-router-dom"

const List = ({ history }) => {
  const [getList, setGetList] = useState([]);

  const handleBack = () => {
    history.goBack();
  };

  const getData = async () => {
    try {
      const list = await apiGetListTour();
      setGetList(list.data);
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const handlDeleteById = async (id) => {
    try {
      const success = await swal({
        title: "Bạn có chắc?",
        text: "Bạn có chắc muốn xoá khỏi danh sách",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
      if (success) {
        const value = await apiDeleteTour({tour_id: id});
        if (value) {
          getData();
        }
      }
    } catch (error) {
      console.error("Error deleting area:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-5 col-md-9 col-lg-6">
          <h2 className="mt-30 page-title">Tours</h2>
        </div>
        <div className="col-lg-5 col-md-3 col-lg-6 back-btn">
          <Button variant="contained" onClick={handleBack}>
            <i className="fas fa-arrow-left" /> Back
          </Button>
        </div>
      </div>
      <ol className="breadcrumb mb-30">
        <li className="breadcrumb-item">
          <a href="index.html">Dashboard</a>
        </li>
        <li className="breadcrumb-item active">Tours</li>
      </ol>
      <div className="row justify-content-between">
        <div className="col-lg-12">
          <a href="/admin/tour/create" className="add-btn hover-btn">
            Thêm mới
          </a>
        </div>
        <div className="col-lg-12 col-md-12">
          <div className="card card-static-2 mt-30 mb-30">
            <div className="card-title-2">
              <h4>Tất cả tour</h4>
            </div>
            <div className="card-body-table">
              <div className="table-responsive">
                <table className="table ucp-table table-hover">
                  <thead>
                    <tr>
                      <th>Mã tour</th>
                      <th>Tên tour</th>
                      <th>Điểm đi</th>
                      <th>Điểm đến</th>
                      <th>Thời gian tạo</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getList.map((row, index) => (
                      <tr key={index}>
                        <td>{row.tour_id}</td>
                        <td>{row.name}</td>
                        <td>{row.departureText || ""}</td>
                        <td>{row.destinationText || ""}</td>
                        <td>{moment(row.time_created).format("DD-MM-YYYY HH:MM:ss") || ""}</td>
                        <td className="action-btns">
                          <Link
                                to={{
                                  pathname: `/admin/tour/edit`,
                                  state: { row },
                                }}
                              >
                                <Typography className="edit-btn">
                                  <i className="fas fa-edit" />
                                </Typography>
                              </Link>
                          <Typography
                            className="delete-btn"
                            onClick={(e) => handlDeleteById(row.tour_id)}
                          >
                            <i className="fas fa-trash-alt" />
                          </Typography>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
