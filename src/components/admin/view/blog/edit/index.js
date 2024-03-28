import React, { useState, useEffect } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import AutoSelect from "../../../../common/autoselect";
import { GetLocationDetails, GetProductDetails } from "../../../../services";
import swal from "sweetalert";
import { v4 } from "uuid";
import RichTextEditor from "../../../../RichTextEditor";
import { toast } from "react-toastify";
import Axios from "axios"
import { apiCreateBlog, apiEditBlog } from "../../../../../api";
import { useHistory } from "react-router-dom";

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

const Edit = (props) => {
    const [changeImage, setChangeImage]= useState(false)
    const self = props.location.state.row;
    const history = useHistory()
    const [files, setFiles] = useState([]);
    const [type, setType] = useState(self.type)
    const [toggle, setToggle] = useState(true);
    const [name, setName] = useState(self.name);
    const [status, setStatus] = useState(1);
    const [image, setImage] = useState();
    const [content, setContent] = useState(self.content);
    const [price, setPrice] = useState(self.price);
    const [discountPer, setDiscountPer] = useState(self.discountPer);
    const [previewImage, setPreviewImage] = useState([]);
    const [listProvince, setListProvince] = useState([]);
    const [desc, setDesc] = useState(self.desc)
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
        event.preventDefault();
        if (changeImage) {
            var formData = new FormData();
            formData.append("file", image);
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
                id: self.id, name, status, price, discountPer, desc, content, type, image:  imageUrl.file_path, photo:  imageUrl.file_path
            }
            const result = await apiEditBlog({ ...data })
            swal("Thông báo", "Cập nhật thành công", "success")
                .then(() => history.goBack())
            console.log(result)
        }
        else {
            const data = {
                id: self.id, name, status, price, discountPer, desc, content, type, image: self.photo, photo: self.photo
            }
            const result = await apiEditBlog({ ...data })
            swal("Thông báo", "Cập nhật thành công", "success")
                .then(() => history.goBack())
            console.log(result)
        }
    };

    const onFileChange = (event) => {
        console.log(event.target)
        console.log(event.target.files[0])
        if(event.target.files[0]) {
            setChangeImage(true)
            setImage(event.target.files[0]);
        }
        else {
            setChangeImage(false)
        }
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
            <div className="row">
                <div className="col-lg-5 col-md-9 col-lg-6">
                    <h2 className="mt-30 page-title">Blogs</h2>
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
                    <a href="#">Blog</a>
                </li>
                <li className="breadcrumb-item active">Thêm Blog</li>
            </ol>
            <div className="row">
                <div className="col-lg-12 col-md-12">
                    <div className="card card-static-2 mb-30">
                        <div className="card-title-2">
                            <h4>Thêm blog</h4>
                        </div>
                        <div className="card-body-table">
                            <div className="news-content-right pd-20">
                                <div className="row">
                                    <div className="col-lg-2 col-md-2">
                                        <div className="form-group">
                                            <label className="form-label">Tiêu đề*</label>
                                            <input
                                                style={{ marginTop: 12 }}
                                                type="text"
                                                className="form-control"
                                                placeholder="Tiêu đề blog"
                                                name="name"
                                                value={name}
                                                onChange={(e) => handleChange(e)}
                                            />
                                        </div>
                                    </div>
                                    {/*  */}
                                    <div className="col-lg-2 col-md-2">
                                        <div className="form-group">
                                            <label className="form-label">Loại blog*</label>
                                            <Box sx={{ width: "100%" }}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-simple-select-label">Loại blog</InputLabel>
                                                    <Select
                                                        style={{ height: 32 }}
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={type}
                                                        // value={age}
                                                        onChange={(e) => setType(e.target.value)}
                                                    >
                                                        {/* eslint-disable-next-line */}
                                                        <MenuItem value={1}>Thị trường Logistics trong và ngoài nước</MenuItem>
                                                        <MenuItem value={2}>Thị trường xuất nhập khẩu toàn cầu</MenuItem>
                                                        <MenuItem value={3}>Tin tức</MenuItem>
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
                                            <label className="form-label">Ảnh đại diện blog*</label>
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
                                            <label className="form-label">Giá (nếu blog là vé tham quan)*</label>
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
                                            <label className="form-label">Mô tả ngắn về blog</label>
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
                                            <label className="form-label">Mô tả chi tiết blog*</label>
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
                                            Sửa
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

export default Edit;
