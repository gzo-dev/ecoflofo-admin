import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import { GetCategoryDetails, GetProductDetails } from "../../../../services";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import swal from "sweetalert";
import numberWithCommas from "../../../../../util/number_thousand_separator";
import axios from "axios";
import * as XLSX from "xlsx";
import { apiGetChildCategory } from "../../../../../api";
import { getCookie } from "../../../../../function";

const Arrays = (data, fieldName, fieldValue) => {
  let arrayItem = [];
  if (data && Array.isArray(data)) {
    data.map((item, key) => {
      arrayItem.push({
        label: ++key + "--" + item[fieldName],
        value: item[fieldValue],
      });
      return null;
    });
  }
  return arrayItem;
};

const List = () => {
  const [originList, setOriginList] = useState([]);
  const [getList, setGetList] = useState([]);
  const [listSearch, setListSearch] = useState([]);
  const [searchText, setSearchText] = useState("");
  const isSearching = searchText.length > 0 ? true : false;
  const [isloaded, setIsLoaded] = useState(false);
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [perPage, setPerPage] = useState(30);
  const [orgtableData, setOrgtableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectCategory, setSelectCategory] = useState();
  const [selectSubCategory, setSelectSubCategory] = useState();
  const [listCategory, setListCategory] = useState([]);
  const [listSubCategory, setListSubCategory] = useState([]);

  const handleBack = () => {
    // your code here
    // For example:
    // props.history.goBack();
  };

  const getListCategory = async () => {
    const list = await GetCategoryDetails.getCategoryList();
    setListCategory(list.data);
  };

  const getListChildCategory = async () => {
    const list = await apiGetChildCategory({ categoryId: selectCategory });
    setListSubCategory(list.data);
  };

  const formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
  };

  const getProductList = async () => {
    setIsLoaded(false);
    let list = await GetProductDetails.getAllProductList();
    if (list) {
      var tdata = list.product;
      var slice = tdata.slice(offset, offset + perPage);
      setGetList(slice);
      setOriginList(slice);
      setOrgtableData(tdata);
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    getProductList();
  }, []);

  useEffect(() => {
    getListCategory();
  }, []);

  useEffect(() => {
    getListChildCategory();
  }, [selectCategory]);

  useEffect(() => {
    if (selectCategory && selectSubCategory) {
      setGetList(
        originList.filter(
          (item) =>
            item.categoryId == selectCategory &&
            item.subCategoryId == selectSubCategory
        )
      );
    } else if (selectCategory) {
      setGetList(
        originList.filter((item) => item.categoryId == selectCategory)
      );
    } else if (selectSubCategory) {
    }

    // setGetList(originList?.filter(item))
  }, [selectCategory, selectSubCategory]);

  const handleSearchInputChange = (event) => {
    setSearchText(event.target.value);
    if (event.target.value.length <= 0) {
    }
    if (!searchText) {
      setGetList(orgtableData); // Hiển thị toàn bộ danh sách nếu không có từ khóa tìm kiếm
      return;
    }

    const filteredList = orgtableData.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );

    setListSearch(filteredList);
  };

  const handleSearch = () => {
    if (!searchText) {
      setGetList(orgtableData); // Hiển thị toàn bộ danh sách nếu không có từ khóa tìm kiếm
      return;
    }

    const filteredList = orgtableData.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );

    setListSearch(filteredList);
  };

  const handlDeleteById = async (id) => {
    swal({
      title: "Bạn có chắc?",
      text: "You want to delete Category from the List",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (success) => {
      if (success) {
        let value = await GetProductDetails.getDeleteProduct(id);
        if (value) {
          getProductList();
        }
      }
    });
  };

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    const newOffset = selectedPage * perPage;

    setCurrentPage(selectedPage);
    setOffset(newOffset);
    loadMoreData();
  };

  const loadMoreData = () => {
    const data = orgtableData;
    const slice = data.slice(offset, offset + perPage);
    setGetList(slice);
  };

  const exportToExcel = (e) => {
    e.preventDefault();
    const headers = ["Tên sản phẩm", "Thể loại", "Giá", "Giảm gias"];

    // Thêm tiêu đề cột vào mảng dữ liệu

    const worksheet = XLSX.utils.json_to_sheet(
      getList.map((product) => [
        product.name,
        product.SubCategory
          ? `${product.SubCategory.category.name} | ${product.SubCategory.sub_name}`
          : "..",
        product.price,
        product.discountPer,
      ])
    );
    getList.unshift(headers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách sản phẩm");
    XLSX.writeFile(workbook, "product.xlsx");
  };

  const refreshProduct = () => {
    setGetList(originList);
    setSelectCategory();
    setSelectSubCategory();
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-5 col-md-9 col-lg-6">
          <h2 className="mt-30 page-title">Sản phẩm</h2>
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
        <li className="breadcrumb-item active">Products</li>
      </ol>
      <div className="row justify-content-between mt-3">
        <div className="col-lg-12">
          <a href="/admin/product/create" className="add-btn hover-btn">
            Thêm mới
          </a>
        </div>
        {getCookie("role") === "admin" && (
          <div
            onClick={exportToExcel}
            className="col-lg-12 mt-3"
            style={{ cursor: "pointer" }}
          >
            <a style={{ color: "#fff" }} className="add-btn hover-btn">
              Xuất file excel
            </a>
          </div>
        )}

        <div className="col-lg-12">
          <div className="row">
            <div className="col-lg-8 col-md-8">
              <br />
              <input
                style={{
                  width: "100%",
                  height: "42px",
                  border: "1px solid #e7e7e7",
                  borderRadius: 10,
                  padding: 10,
                }}
                type="text"
                value={searchText}
                onChange={handleSearchInputChange}
                placeholder="Tìm tên sản phẩm..."
              />
            </div>
            <div className="col-lg-2 col-md-2">
              <button className="save-btn hover-btn" onClick={handleSearch}>
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
        <div className="col-lg-12 col-md-12 mt-2">
          <Box sx={{ width: "100%" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Thể loại</InputLabel>
              <Select
                style={{ height: 32 }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectCategory}
                // value={age}
                onChange={(e) => setSelectCategory(e.target.value)}
              >
                {/* eslint-disable-next-line */}
                {listCategory
                  .map((item) => ({
                    ...item,
                    value: item.id,
                    label: item.name,
                  }))
                  .map((item, key) => (
                    <MenuItem
                      // onClick={() => set(item.label)}
                      value={item.value}
                      key={key}
                    >
                      {item.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </div>
        {/*  */}
        <br />
        <br />
        {/*  */}
        <div className="col-lg-12 col-md-12">
          <Box sx={{ width: "100%" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Thể loại con
              </InputLabel>
              <Select
                style={{ height: 32 }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectSubCategory}
                // value={age}
                onChange={(e) => setSelectSubCategory(e.target.value)}
              >
                {/* eslint-disable-next-line */}
                {listSubCategory
                  .map((item) => ({
                    ...item,
                    value: item.id,
                    label: item.sub_name,
                  }))
                  .map((item, key) => (
                    <MenuItem
                      // onClick={() => set(item.label)}
                      value={item.value}
                      key={key}
                    >
                      {item.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </div>
        <br />
        <br />
        <div className="col-lg-12 col-md-12 mt-2">
          <Button
            onClick={refreshProduct}
            color={"primary"}
            variant="contained"
          >
            Đặt lại
          </Button>
        </div>
        {/*  */}
        <div className="col-lg-12 col-md-12">
          <div className="card card-static-2 mt-30 mb-30">
            <div className="card-title-2">
              <h4>Tất cả sản phẩm</h4>
            </div>
            <div className="card-body-table">
              <div className="table-responsive">
                <table className="table ucp-table table-hover">
                  <thead>
                    <tr>
                      <th style={{ width: 60 }}>Id</th>
                      <th style={{ width: 100 }}>Hình ảnh</th>
                      <th>Tên sản phảm</th>
                      <th style={{whiteSpace: "nowrap"}}>Người quản lý</th>
                      <th style={{whiteSpace: "nowrap"}}>SĐT liên hệ</th>
                      <th style={{whiteSpace: "nowrap"}}>SĐT chủ nhà</th>
                      <th style={{whiteSpace: "nowrap"}}>Địa chỉ</th>
                      <th style={{whiteSpace: "nowrap"}}>Ghi chú</th>
                      <th>Thể loại</th>
                      <th>Giá</th>
                      <th>Giảm giá(%)</th>
                      <th>Trạng thái</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!isSearching &&
                      getList.map((row, index) => (
                        <tr key={index}>
                          <td>{row.id}</td>
                          <td>
                            <div className="cate-img-5">
                              <img src={row.photo} alt="product-name" />
                            </div>
                          </td>
                          <td>{row.name}</td>
                          <td>{row.user && (row.user.firstName + " " + row.user.lastName)}</td>
                          <td>{row.phoneNumber}</td>
                          <td>{row.author_phone}</td>
                          <td>{row.wardText + " " + row.districtText + " " + row.provinceText}</td>
                          <td>{row.note}</td>
                          <td>
                            {row.SubCategory
                              ? `${row.SubCategory.category.name} | ${row.SubCategory.sub_name}`
                              : ".."}
                          </td>
                          {/* <td>{row.brand}</td> */}
                          {/* <td>{row.unitSize}</td> */}
                          {/* <td>VND{numberWithCommas(row.buyerPrice)}</td> */}
                          <td>VND{numberWithCommas(Math.ceil(row.price * (100 - parseInt(row.discountPer || 0)) / 100))}</td>
                          <td>{row.discountPer}%</td>
                          <td>
                            {row.status === "active" ? (
                              <span className="badge-item badge-status-success">
                                {row.status}
                              </span>
                            ) : (
                              <span className="badge-item badge-status">
                                {row.status}
                              </span>
                            )}
                          </td>
                          <td className="action-btns">
                            <Link
                              to={{
                                pathname: `/admin/product/edit`,
                                state: { row },
                              }}
                            >
                              <Typography className="edit-btn">
                                <i className="fas fa-edit" />
                              </Typography>
                            </Link>
                            <Typography
                              className="delete-btn"
                              onClick={() => handlDeleteById(row.id)}
                            >
                              <i className="fas fa-trash-alt" />
                            </Typography>
                          </td>
                        </tr>
                      ))}
                    {isSearching &&
                      listSearch.map((row, index) => (
                        <tr key={index}>
                          <td>{row.id}</td>
                          <td>
                            <div className="cate-img-5">
                              <img src={row.photo} alt="product-name" />
                            </div>
                          </td>
                          <td>{row.name}</td>
                          <td>{row.user && (row.user.firstName + " " + row.user.lastName)}</td>
                          <td>{row.phoneNumber}</td>
                          <td>{row.author_phone}</td>
                          <td>{row.wardText + " " + row.districtText + " " + row.provinceText}</td>
                          <td>{row.note}</td>
                          <td>
                            {row.SubCategory
                              ? `${row.SubCategory.category.name} | ${row.SubCategory.sub_name}`
                              : ".."}
                          </td>
                          {/* <td>{row.brand}</td> */}
                          {/* <td>{row.unitSize}</td> */}
                          {/* <td>VND{numberWithCommas(row.buyerPrice)}</td> */}
                          <td>VND{numberWithCommas(Math.ceil(row.price * (100 - parseInt(row.discountPer || 0)) / 100))}</td>
                          <td>{row.discountPer}%</td>
                          <td>
                            {row.status === "active" ? (
                              <span className="badge-item badge-status-success">
                                {row.status}
                              </span>
                            ) : (
                              <span className="badge-item badge-status">
                                {row.status}
                              </span>
                            )}
                          </td>
                          <td className="action-btns">
                            <Link
                              to={{
                                pathname: `/admin/product/edit`,
                                state: { row },
                              }}
                            >
                              <Typography className="edit-btn">
                                <i className="fas fa-edit" />
                              </Typography>
                            </Link>
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
              </div>
              <ReactPaginate
                previousLabel={"prev"}
                nextLabel={"next"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={Math.ceil(orgtableData.length / perPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
