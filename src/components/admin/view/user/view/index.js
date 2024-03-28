import React, { useState, useEffect } from "react";
import { Typography, Button } from "@material-ui/core";
import { GetUserLogin } from "../../../../services";
import { NotificationManager } from "react-notifications";
import swal from "sweetalert";
import Loader from "../../../../loader";
import Pagination from "./Pagination";
import "./View.css";

const View = ({ history }) => {
  const [listSearch, setListSearch] = useState([])
  const [getList, setGetList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("")
  const [orgtableData, setOrgtableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoaded(true);
      await getCustomer();
    };
    fetchData();
  }, []);

  const getCustomer = async () => {
    let list = await GetUserLogin.getAllUserList();
    if (list) {
      var tdata = list.data;
      setGetList(list.data);
      setOrgtableData(tdata);
      setIsLoaded(false);
    }
  };
  const handleSearchInputChange = (event) => {
    setSearchText(event.target.value);
    if (event.target.value.length <= 0) {
      setGetList(orgtableData);
    }
    if (!searchText) {
      setGetList(orgtableData); // Hiển thị toàn bộ danh sách nếu không có từ khóa tìm kiếm
      return;
    }

    const filteredList = orgtableData.filter((item) =>
      ((item.firstName + " " + item.lastName).toLowerCase().includes(searchText.toLowerCase()))
    );
    console.log(filteredList)

    setListSearch(filteredList);
  };

  const handleSearch = () => {
    if (!searchText) {
      setGetList(orgtableData); // Hiển thị toàn bộ danh sách nếu không có từ khóa tìm kiếm
      return;
    }

    const filteredList = orgtableData.filter((item) =>
      ((item.firstName + " " + item.lastName).toLowerCase().includes(searchText.toLowerCase()))
    );
    console.log(filteredList)
    setListSearch(filteredList);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleBack = () => {
    history.goBack();
  };

  const handlDeleteById = (id) => {
    swal({
      title: "Bạn có chắc?",
      text: "You want to delete User from the List",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (success) => {
      if (success) {
        let value = await GetUserLogin.getDeleteUserList(id);
        if (value) {
          NotificationManager.success(value.msg, "Status");
          setTimeout(async function () {
            window.location.reload();
          }, 1000);
        }
      }
    });
  };

  const handlEditRow = (row) => {
    history.push({
      pathname: `/admin/user/edit/${row.id}`,
      state: row,
    });
  };

  const handleAddNewUser = () => {
    history.push({ pathname: `/admin/user/create` });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = getList.slice(indexOfFirstItem, indexOfLastItem);

  const handleClick = () => {
    history.push({ pathname: "/admin/user/create" })
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-5 col-md-9 col-lg-6">
          <h2 className="mt-30 page-title">Quản lý người dùng hệ thống</h2>
        </div>
        <div className="col-lg-5 col-md-3 col-lg-6 back-btn">
          <Button variant="contained" onClick={handleBack}>
            <i className="fas fa-arrow-left" /> Back
          </Button>
        </div>
      </div>
      <ol className="breadcrumb mb-30">
        <li className="breadcrumb-item">Dashboard</li>
        <li className="breadcrumb-item active">Người dùng</li>
      </ol>
      <div className="row justify-content-between">
        <div className="col-lg-12 col-md-12">
          {isLoaded ? <Loader /> : ""}
          <div className="card card-static-2 mt-30 mb-30">
            <div className="card-title-2">
              <h4>Tất cả người dùng</h4>
            </div>
            <div className="card-title-2">
              <Button onClick={handleClick} variant="contained">Thêm người dùng</Button>
            </div>
            <div className="col-lg-12 mb-3">
              <div className="row">
                <div className="col-lg-8 col-md-8">
                  <br />
                  <input
                    style={{ width: "100%", height: "42px", border: "1px solid #e7e7e7", borderRadius: 10, padding: 10 }}
                    type="text"
                    value={searchText}
                    onChange={handleSearchInputChange}
                    placeholder="Tìm tên người dùng..."
                  />
                </div>
                <div className="col-lg-2 col-md-2">
                  <button
                    className="save-btn hover-btn"
                    onClick={handleSearch}
                  >
                    Tìm kiếm
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body-table">
              <div className="table-responsive">
                {
                  searchText.length <= 0 &&
                  <table className="table ucp-table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Họ</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Chức vụ</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((row, index) => (
                        <tr key={index}>
                          <td>{++index}</td>
                          <td>{row.firstName}</td>
                          <td>{row.lastName}</td>
                          <td>{row.email}</td>
                          <td>{row.role}</td>
                          <td>
                            {row.verify ? (
                              <span className="text-success">Verified</span>
                            ) : (
                              <span className="text-danger">Pending</span>
                            )}
                          </td>
                          <td className="action-btns">
                            <a onClick={() => handlEditRow(row)}>
                              <i className="fas fas fa-edit" />
                            </a>
                            <Typography
                              className="delete-btn"
                              onClick={() => handlDeleteById(row.id)}
                            >
                              <i className="fas fa-trash-alt" />
                            </Typography>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                }
                {
                  searchText.length > 0 &&
                  <table className="table ucp-table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Họ</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Chức vụ</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listSearch.map((row, index) => (
                        <tr key={index}>
                          <td>{++index}</td>
                          <td>{row.firstName}</td>
                          <td>{row.lastName}</td>
                          <td>{row.email}</td>
                          <td>{row.role}</td>
                          <td>
                            {row.verify ? (
                              <span className="text-success">Verified</span>
                            ) : (
                              <span className="text-danger">Pending</span>
                            )}
                          </td>
                          <td className="action-btns">
                            <a onClick={() => handlEditRow(row)}>
                              <i className="fas fas fa-edit" />
                            </a>
                            <Typography
                              className="delete-btn"
                              onClick={() => handlDeleteById(row.id)}
                            >
                              <i className="fas fa-trash-alt" />
                            </Typography>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                
                }
              </div>
            </div>
          </div>
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={getList.length}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default View;
