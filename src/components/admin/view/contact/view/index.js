import React, { Fragment, useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { GetPaymentDetails } from "../../../../services";
import { NotificationManager } from "react-notifications";
import Loader from "../../../../loader";
import swal from "sweetalert";
import Axios from "axios";
import { API_URL } from "../../../../../config1";
import ReplyContact from "./reply_contact";
import delete_contact from "../../../../../api/delete_contact";
import ViewReply from "./view_replied_contact";
import ViewContentReply from "./ViewContentReply";

const View = () => {
  const history = useHistory();
  const [originList, setOriginList] = useState([]);
  const [getList, setGetList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [change, setChange] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Số lượng item trên mỗi trang
  const [selectType, setSelectType] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoaded(true);
      await getContact();
    };
    fetchData();
  }, [change]);

  const handleBack = () => {
    history.goBack();
  };

  const getContact = async () => {
    const res = await Axios({
      url: API_URL + "/api/contact",
      method: "get",
    });
    const result = await res.data;
    let list = result.data;
    if (list) {
      setOriginList(list);
      setGetList(list);
      setIsLoaded(false);
    }
  };

  const handlDeleteById = async (id) => {
    swal({
      title: "Bạn có chắc?",
      text: "You want to delete User from the List",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (success) => {
      if (success) {
        let value = await GetPaymentDetails.getDeleteUserList(id);
        if (value) {
          NotificationManager.success(value.msg, "Status");
          setTimeout(async function () {
            window.location.reload();
          }, 1000);
        }
      }
    });
  };

  const handleAddNewUser = () => {
    history.push({ pathname: `/admin/user/create` });
  };

  // Hàm để lấy danh sách item trên trang hiện tại
  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return getList.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Tính tổng số trang
  const totalPages = Math.ceil(getList.length / itemsPerPage);

  // Tạo mảng các trang trung tâm
  const centerPages = () => {
    const totalPageCount = Math.min(5, totalPages); // Hiển thị tối đa 5 trang trung tâm
    let centerPages = [];
    const startPage = Math.max(2, currentPage - Math.floor(totalPageCount / 2));
    for (let i = 0; i < totalPageCount; i++) {
      centerPages.push(startPage + i);
    }
    return centerPages;
  };

  // Xác định xem có hiển thị nút '...' bên trái
  const showLeftDots = () => {
    return centerPages()[0] > 2;
  };

  // Xác định xem có hiển thị nút '...' bên phải
  const showRightDots = () => {
    return centerPages()[centerPages().length - 1] < totalPages - 1;
  };

  // Xử lý chuyển đến trang trước
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Xử lý chuyển đến trang tiếp theo
  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  // Xử lý chuyển đến trang cụ thể
  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  const refreshProduct = () => {
    setGetList(originList);
    setSelectType();
  };

  useEffect(() => {
    if (selectType) {
      setGetList(originList.filter((item) => item.type == selectType));
    }
  }, [selectType]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-5 col-md-9 col-lg-6">
          <h2 className="mt-30 page-title">Danh sách liên hệ</h2>
        </div>
        <div className="col-lg-5 col-md-3 col-lg-6 back-btn">
          <Button variant="contained" onClick={handleBack}>
            <i className="fas fa-arrow-left" /> Back
          </Button>
        </div>
      </div>
      <ol className="breadcrumb mb-30">
        <li className="breadcrumb-item">Dashboard</li>
        <li className="breadcrumb-item active">voucher</li>
      </ol>
      <div className="col-lg-12 col-md-12">
        <Box sx={{ width: "100%" }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Loại liên hệ</InputLabel>
            <Select
              style={{ height: 32 }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectType}
              // value={age}
              onChange={(e) => setSelectType(e.target.value)}
            >
              {/* eslint-disable-next-line */}

              <MenuItem
                // onClick={() => set(item.label)}
                value={1}
              >
                {"Cá nhân"}
              </MenuItem>
              <MenuItem
                // onClick={() => set(item.label)}
                value={2}
              >
                {"Công ty"}
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>
      <div className="col-lg-12 col-md-12 mt-2">
        <Button onClick={refreshProduct} color={"primary"} variant="contained">
          Đặt lại
        </Button>
      </div>
      <div className="row justify-content-between">
        <div className="col-lg-12 col-md-12">
          {isLoaded ? <Loader /> : ""}
          <div className="card card-static-2 mt-30 mb-30">
            <div className="card-title-2">
              <h4>Tất cả liên hệ</h4>
            </div>
            <div className="card-body-table">
              <div className="table-responsive">
                <table className="table ucp-table table-hover">
                  <thead>
                    <tr>
                      {selectType === 1 && (
                        <Fragment>
                          <th style={{ width: 60 }}>ID</th>
                          <th>Mặt hàng</th>
                          <th>Hs code</th>
                          <th>Điểm đi </th>
                          <th>Điểm đến </th>
                          <th>Trọng lượng</th>
                          <th>Điều kiện giao hàng</th>
                          <th>Thời gian khởi hành từ</th>
                          <th>Thời gian khởi hành đến</th>
                          <th>Giá đề nghị cho cả lô hàng</th>
                          <th>Đơn vị</th>
                          <th>Chú thích thêm</th>
                          <th>Tên chủ hàng</th>
                          <th>Quốc gia</th>
                          <th>Tỉnh / TP</th>
                          <th>Địa chỉ</th>
                          <th>Email</th>
                          <th>Di động</th>
                          <th>File đính kèm</th>

                          {/* <th>Trạng thái</th> */}
                          <th>Hành động</th>
                        </Fragment>
                      )}
                      {selectType === 2 && (
                        <Fragment>
                          <th style={{ width: 60 }}>ID</th>
                          <th>Mặt hàng</th>
                          <th>Hs code</th>
                          <th>Điểm đi </th>
                          <th>Điểm đến </th>
                          <th>Trọng lượng</th>
                          <th>Điều kiện giao hàng</th>
                          <th>Thời gian khởi hành từ</th>
                          <th>Thời gian khởi hành đến</th>
                          <th>Giá đề nghị cho cả lô hàng</th>
                          <th>Đơn vị</th>
                          <th>Chú thích thêm</th>
                          <th>Tên công ty</th>
                          <th>Mã số thuế</th>
                          <th>Mã số thuế tỉnh / tp</th>
                          <th>Quốc gia</th>
                          <th>Tỉnh / TP</th>
                          <th>Địa chỉ</th>
                          <th>Email</th>
                          <th>Di động</th>
                          <th>File đính kèm</th>
                          {/* <th>Trạng thái</th> */}
                          <th>Hành động</th>
                        </Fragment>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Hiển thị danh sách item của trang hiện tại */}
                    <Fragment>
                      {selectType === 1 && (
                        <Fragment>
                          {getCurrentItems().map((row, index) => (
                            <tr key={index}>
                              <td>{++index}</td>
                              <td>{row.item}</td>
                              <td>{row.hscode}</td>
                              <td>{row.departure}</td>
                              <td>{row.destination}</td>
                              <td>{row.weight}</td>
                              <td>{row.condition_delivery}</td>
                              <td>{row.time_start}</td>
                              <td>{row.time_end}</td>
                              <td>{row.price}</td>
                              <td>{row.unit}</td>
                              <td>{row.note}</td>
                              <td>{row.owner}</td>
                              <td>{row.nation}</td>
                              <td>{row.city}</td>
                              <td>{row.address}</td>
                              <td>{row.email}</td>
                              <td>{row.phone}</td>
                              <td>
                                {row.file.length > 0 && 
                                  <p
                                    onClick={() => {
                                      console.log(row.file);
                                       window.location.href= row.file
                                    }}
                                    style={{ color: "#2e89ff", fontWeight: 600, cursor: "pointer" }}
                                  >
                                    Chi tiết
                                  </p>
                                }
                              </td>
                              {/* <td>{row.status}</td> */}
                              <td className="action-btns">
                                {row.status === "waiting for reply" ? (
                                  <ReplyContact
                                    {...row}
                                    setChange={setChange}
                                  />
                                ) : (
                                  <ViewReply {...row} />
                                )}
                                <Link
                                  title={"Delete"}
                                  className="edit-btn"
                                  onClick={() => {
                                    swal("Notice", "Bạn có muốn xóa không ?", {
                                      buttons: {
                                        ok: "OK",
                                        cancel: "Cancel",
                                      },
                                    })
                                      .then(async (value) => {
                                        if (value === "ok") {
                                          const result = await delete_contact(
                                            row.id
                                          );
                                          if (result.ok === true) {
                                            swal(
                                              "Notice",
                                              "Đã xóa thành công",
                                              "success"
                                            ).then(() =>
                                              setChange((prev) => !prev)
                                            );
                                          } else {
                                            swal(
                                              "Notice",
                                              "Xóa thất bại",
                                              "error"
                                            );
                                          }
                                        }
                                      })
                                      .catch(() => {
                                        swal("Notice", "Xóa thất bại", "error");
                                      });
                                  }}
                                >
                                  <i className="fas fa-trash" />
                                </Link>
                                <ViewContentReply content={row.content} />
                              </td>
                            </tr>
                          ))}
                        </Fragment>
                      )}
                    </Fragment>
                    {/*  */}
                    <Fragment>
                      {selectType === 2 && (
                        <Fragment>
                          {getCurrentItems().map((row, index) => (
                            <tr key={index}>
                              <td>{++index}</td>
                              <td>{row.item}</td>
                              <td>{row.hscode}</td>
                              <td>{row.departure}</td>
                              <td>{row.destination}</td>
                              <td>{row.weight}</td>
                              <td>{row.condition_delivery}</td>
                              <td>{row.time_start}</td>
                              <td>{row.time_end}</td>
                              <td>{row.price}</td>
                              <td>{row.unit}</td>
                              <td>{row.note}</td>
                              <td>{row.company}</td>
                              <td>{row.tax_code}</td>
                              <td>{row.tax_place}</td>
                              <td>{row.nation}</td>
                              <td>{row.city}</td>
                              <td>{row.address}</td>
                              <td>{row.email}</td>
                              <td>{row.phone}</td>
                              <td>
                                {row.file.length > 0 && 
                                  <p

                                    onClick={() => {
                                      console.log(row.file);
                                       window.location.href= row.file
                                    }}
                                    style={{ color: "#2e89ff", fontWeight: 600, cursor: "pointer" }}
                                  >
                                    Chi tiết
                                  </p>
                                }
                              </td>

                              {/* <td>{row.status}</td> */}
                              <td className="action-btns">
                                {row.status === "waiting for reply" ? (
                                  <ReplyContact
                                    {...row}
                                    setChange={setChange}
                                  />
                                ) : (
                                  <ViewReply {...row} />
                                )}
                                <Link
                                  title={"Delete"}
                                  className="edit-btn"
                                  onClick={() => {
                                    swal("Notice", "Bạn có muốn xóa không ?", {
                                      buttons: {
                                        ok: "OK",
                                        cancel: "Cancel",
                                      },
                                    })
                                      .then(async (value) => {
                                        if (value === "ok") {
                                          const result = await delete_contact(
                                            row.id
                                          );
                                          if (result.ok === true) {
                                            swal(
                                              "Notice",
                                              "Đã xóa thành công",
                                              "success"
                                            ).then(() =>
                                              setChange((prev) => !prev)
                                            );
                                          } else {
                                            swal(
                                              "Notice",
                                              "Xóa thất bại",
                                              "error"
                                            );
                                          }
                                        }
                                      })
                                      .catch(() => {
                                        swal("Notice", "Xóa thất bại", "error");
                                      });
                                  }}
                                >
                                  <i className="fas fa-trash" />
                                </Link>
                                <ViewContentReply content={row.content} />
                              </td>
                            </tr>
                          ))}
                        </Fragment>
                      )}
                    </Fragment>
                  </tbody>
                </table>
              </div>
            </div>
            {/* <div className="pagination">
              <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                Prev
              </Button>

              {currentPage >= 1 && (
                <Button onClick={() => goToPage(1)}>
                  1
                </Button>
              )}

              {showLeftDots() && (
                <Button disabled>...</Button>
              )}

              {centerPages().map((page) => (
                <Button key={page} onClick={() => goToPage(page)} disabled={currentPage === page}>
                  {page}
                </Button>
              ))}

              {showRightDots() && (
                <Button disabled>...</Button>
              )}

              {currentPage < totalPages && (
                <Button onClick={() => goToPage(totalPages)}>
                  {totalPages}
                </Button>
              )}

              <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
              </Button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
