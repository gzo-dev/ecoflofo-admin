import React, { useState, useEffect } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import AutoSelect from "../../../../common/autoselect";
import { GetLocationDetails, GetProductDetails } from "../../../../services";
import swal from "sweetalert";
import { v4 } from "uuid";
import RichTextEditor from "../../../../RichTextEditor";
import { toast } from "react-toastify";
import Axios from "axios"
import { apiCreateTour } from "../../../../../api";
import { useHistory } from "react-router-dom";
import Loading2 from "../../../../loader/loading2";

const Arrays = (data, fieldName, fieldValue) => {
  let arrayItem = [];
  if (data && Array.isArray(data)) {
    data.map((item, key) => {
      arrayItem.push({ label: item[fieldName], value: item[fieldValue] });
      return null;
    });
  }
  return arrayItem;
};

const Create = () => {
  const history= useHistory()
  const [loading, setLoading]= useState()
  const [files, setFiles] = useState([]);
  const [type, setType]= useState()
  const [kindof, setKindof]= useState()
  const [departure, setDeparture] = useState()
  const [departureText, setDepartureText] = useState()
  const [destination, setDestination] = useState()
  const [destinationText, setDestinationText] = useState()
  const [toggle, setToggle] = useState(true);
  const [name, setName] = useState("");
  const [status, setStatus] = useState(1);
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [price, setPrice] = useState(0);
  const [discountPer, setDiscountPer] = useState(0);
  const [previewImage, setPreviewImage] = useState([]);
  const [listProvince, setListProvince] = useState([]);
  const [desc, setDesc]= useState()
  // const [photo, setPhoto]= useState()

  const handleBack = () => {
    // Logic to handle going back
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") setName(value)
    if (name === "status") setStatus(value)
    if (name === "price") setPrice(value)
    if (name === "discountPer") setDiscountPer(value)
  };


  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      var formData = new FormData();
      formData.append("file", image);
      setLoading(true)
      const res = await Axios.post(
        "https://api.gzomedia.net/upload.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const imageUrl = await res.data;
      // console.log(imageUrl)
      const data = {
        name, status, price, discountPer, desc, departure, departureText, destination, destinationText, content, type, image: imageUrl.file_path, kindof
      }
      const result= await apiCreateTour({...data})
      setLoading(false)
      swal("Thông báo", "Thêm thành công", "success")
              .then(()=> history.goBack())
      console.log(result)
      
    } catch (error) {
      setLoading(false)
    }
    finally {
      setLoading(false)
    }
  };

  const onFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleContentChange = (contentHtml) => {
    setContent(contentHtml);
  };

  const fileSelectedHandler = (e) => {
    setFiles(e.target.files);
    const arr = [];
    Object.values(e.target.files).map((item) => console.log(item));

    Object.values(e.target.files).map((item) =>
      arr.push({ preview: URL.createObjectURL(item), id: item.lastModified })
    );
    setPreviewImage(arr);
  };

  const fetchDataFromApi = () => {
    Axios.get('https://vapi.vnappmob.com/api/province')
      .then(response => {
        setListProvince(response.data.results);
      })
      .catch(error => {
        setListProvince(null);
      });
  };

  useEffect(() => {
    fetchDataFromApi();
  }, []);

  return (
    <div className="container-fluid">
      <Loading2 open={loading} setOpen={setLoading} />
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
        <li className="breadcrumb-item">
          <a href="#">Tour</a>
        </li>
        <li className="breadcrumb-item active">Thêm Tour</li>
      </ol>
      <div className="row">
        <div className="col-lg-12 col-md-12">
          <div className="card card-static-2 mb-30">
            <div className="card-title-2">
              <h4>Thêm tour</h4>
            </div>
            <div className="card-body-table">
              <div className="news-content-right pd-20">
                <div className="row">
                  <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">Tiêu đề tour*</label>
                      <input
                        style={{ marginTop: 12 }}
                        type="text"
                        className="form-control"
                        placeholder="Tiêu đề tour"
                        name="name"
                        value={name}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">Điểm đi*</label>
                      <Box sx={{ width: "100%" }}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">Điểm đi</InputLabel>
                          <Select
                            style={{ height: 32 }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={departure}
                            // value={age}
                            onChange={(e) => setDeparture(e.target.value)}
                          >
                            {/* eslint-disable-next-line */}
                            {listProvince.map((item) => ({
                              ...item,
                              value: item.province_id,
                              label: item.province_name,
                            })).map((item, key) => <MenuItem onClick={() => setDepartureText(item.label)} value={item.value} key={key}>{item.label}</MenuItem>)}
                          </Select>
                        </FormControl>
                      </Box>
                    </div>
                  </div>
                  {/*  */}
                  <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">Điểm đến*</label>
                      <Box sx={{ width: "100%" }}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">Điểm đến</InputLabel>
                          <Select
                            style={{ height: 32 }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={destination}
                            // value={age}
                            onChange={(e) => setDestination(e.target.value)}
                          >
                            {/* eslint-disable-next-line */}
                            {listProvince.map((item) => ({
                              ...item,
                              value: item.province_id,
                              label: item.province_name,
                            })).map((item, key) => <MenuItem onClick={() => setDestinationText(item.label)} value={item.value} key={key}>{item.label}</MenuItem>)}
                          </Select>
                        </FormControl>
                      </Box>
                    </div>
                  </div>
                  {/*  */}
                  <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">Loại tour*</label>
                      <Box sx={{ width: "100%" }}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">Loại tour</InputLabel>
                          <Select
                            style={{ height: 32 }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={type}
                            // value={age}
                            onChange={(e) => setType(e.target.value)}
                          >
                            {/* eslint-disable-next-line */}
                            <MenuItem value={1}>Tour daily</MenuItem>
                            <MenuItem value={2}>Tour du lịch</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </div>
                    {/*  */}
                    <div className="form-group">
                      <label className="form-label">Loại tour du lịch*</label>
                      <Box sx={{ width: "100%" }}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">Loại tour du lịch</InputLabel>
                          <Select
                            style={{ height: 32 }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={kindof}
                            // value={age}
                            onChange={(e) => setKindof(e.target.value)}
                          >
                            {/* eslint-disable-next-line */}
                            <MenuItem value={1}>Tour trong nước</MenuItem>
                            <MenuItem value={2}>Tour ngoài nước</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </div>
                  </div>
                  {/* 
                  <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">Brand*</label>
                      <input
                        style={{ marginTop: 12 }}
                        type="text"
                        className="form-control"
                        placeholder="Brand Name"
                        name="brand"
                        value={brand}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div> */}

                  <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">Ảnh đại diện tour*</label>
                      <input
                        style={{ marginTop: 12 }}
                        type="file"
                        className="form-control"
                        name="image"
                        onChange={onFileChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row" style={{ paddingTop: "2rem" }}>
                  <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">Trạng thái*</label>
                      <select
                        style={{ marginTop: 12 }}
                        id="status"
                        name="status"
                        className="form-control"
                        value={status}
                        onChange={(e) => handleChange(e)}
                      >
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                    </div>
                  </div>
                  {/* <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">Số điện thoại liên hệ*</label>
                      <input
                        style={{ marginTop: 12 }}
                        type="number"
                        className="form-control"
                        name="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div> */}
                  <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">Giá tour*</label>
                      <input
                        style={{ marginTop: 12 }}
                        type="number"
                        className="form-control"
                        name="price"
                        value={price}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>

                  <div
                    className="col-lg-1 col-md-1"
                    style={{}}
                  >
                    <div className="form-group">
                      <label className="form-label">Giảm giá(%)*</label>
                      <input
                        style={{ marginTop: 12 }}
                        type="number"
                        className="form-control"
                        name="discountPer"
                        value={discountPer}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">Mô tả các điểm dừng (Hà Nội - Đà Nẵng - ...)</label>
                      <input
                        style={{ marginTop: 12 }}
                        type="text"
                        className="form-control"
                        name="desc"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* <div
                    className="col-lg-1 col-md-1"
                    style={{}}
                  >
                    <div className="form-group">
                      <label className="form-label">Diện tích (nếu có)</label>
                      <input
                        style={{ marginTop: 12 }}
                        type="text"
                        className="form-control"
                        name="square"
                        value={square}
                        onChange={(e) => setSquare(e.target.value)}
                      />
                    </div>
                  </div> */}
                </div>

                <div className="row" style={{ paddingTop: "2rem" }}>
                  {/* <div className="form-group" style={{ opacity: 0 }}>
                    <label className="form-label">Sort Description*</label>
                    <textarea
                      style={{ marginTop: 12 }}
                      rows="4"
                      cols="100"
                      className="form-control"
                      name="sortDesc"
                      value={sortDesc}
                      onChange={(e) => handleChange(e)}
                    />
                  </div> */}
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label className="form-label">Mô tả chi tiết tour*</label>
                      <RichTextEditor
                        content={content}
                        handleContentChange={handleContentChange}
                        placeholder="insert text here..."
                      />
                    </div>
                  </div>
                </div>
                <div className="button_price">
                  {/* <div className="form-group">
                      <Button
                        className="checkprice"
                        variant="contained"
                        onClick={() => handleCheckPrice()}
                      >
                        Preview
                      </Button>
                    </div> */}
                  <div
                    className="form-group"
                    style={
                      toggle
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    <button
                      className="save-btn hover-btn"
                      type="submit"
                      onClick={async (e) => {
                        handleSubmit(e);
                      }}
                    >
                      Thêm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
