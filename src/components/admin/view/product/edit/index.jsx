import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  formatMs,
} from "@material-ui/core";
import { GetProductDetails, GetUserLogin } from "../../../../services";
import RichTextEditor from "../../../../RichTextEditor";
import Loader from "../../../../loader";
import { NotificationManager } from "react-notifications";
import swal from "sweetalert";
import Axios from "axios";
import { API_URL } from "../../../../../config1";
import AddSize from "../new-add/add_size";
import { Fragment } from "react";
import _ from "lodash";
import { v4 } from "uuid";
import { apiGetProvince, apiGetWard } from "../../../../../api";

const Edit = (props) => {
  const self = props.location.state.row;
  const [getList, setGetList] = useState([]);
  const [getsublist, setGetSubList] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [loading, setLoading] = useState(false);
  const [blockHide, setBlockHide] = useState(false);
  const [productId, setProductId] = useState(self.id);
  const [name, setName] = useState(self.name);
  const [slug, setSlug] = useState(self.slug);
  const [brand, setBrand] = useState(self.brand);
  const [status, setStatus] = useState(self.status === "active" ? 1 : 0);
  const [unit, setUnit] = useState(self.unitSize);
  const [image, setImage] = useState("");
  const [content, setContent] = useState(self.desc);
  const [buyerPrice, setBuyerPrice] = useState(self.buyerPrice);
  const [price, setPrice] = useState(self.price);
  const [qty, setQty] = useState(self.qty);
  const [discount, setDiscount] = useState(self.discount);
  const [discountPer, setDiscountPer] = useState(self.discountPer);
  const [total, setTotal] = useState(self.total);
  const [grand_total, setGrandTotal] = useState(self.netPrice);
  const [images, setImages] = useState([]);
  const [currentIdPhoto, setCurrentIdPhoto] = useState(0);
  const [size, setSize] = useState([]);
  const [photo, setPhoto] = useState(self.photo);
  const [photoTemp, setPhotoTemp] = useState("");
  const [newAddImage, setNewAddImage] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState(self.phoneNumber);
  const [typeRoom, setTypeRoom] = useState(self.typeRoom);
  const [interior, setInterior] = useState(self.interior);
  const [square, setSquare] = useState(self.square);
  const [endow, setEndow] = useState(self.endow);
  const [rating, setRating] = useState(self.rating);
  const [note, setNote] = useState(self.note);
  const [newAddImageUrl, setNewAddImageUrl] = useState([]);
  const [user, setUser] = useState(self.user_manager);
  const [rent, setRent] = useState(parseInt(self.rent === true ? 1 : 0));
  const [listUser, setListUser] = useState([]);
  const [listProvince, setListProvince] = useState([]);
  const [listDictrict, setListDitrict] = useState([]);
  const [listWard, setListWard] = useState([]);
  const [province, setProvince] = useState(self.province);
  const [district, setDistrict] = useState(self.district);
  const [ward, setWard] = useState(self.ward);
  const [provinceText, setProvinceText] = useState();
  const [districtText, setDistrictText] = useState();
  const [wardText, setWardText] = useState();
  const [provinceDetail, setProvinceDetail] = useState([]);
  const [author_phone, setAuthorPhone] = useState(self.author_phone);
  const [address, setAddress] = useState(self.address);

  const getCustomer = async () => {
    let list = await GetUserLogin.getAllUserList();
    if (list) {
      var tdata = list.data;
      setListUser(tdata);
    }
  };
  const handleBack = () => {
    props.history.goBack();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        setName(value);
        break;
      case "slug":
        setSlug(value);
        break;
      case "brand":
        setBrand(value);
        break;
      case "status":
        setStatus(value);
        break;
      case "unit":
        setUnit(value);
        break;
      case "buyerPrice":
        setBuyerPrice(value);
        break;
      case "price":
        setPrice(value);
        break;
      case "qty":
        setQty(value);
        break;
      case "discount":
        setDiscount(value);
        break;
      case "discountPer":
        setDiscountPer(value);
        break;
      case "phoneNumber":
        setPhoneNumber(value);
        break;
      case "typeRoom":
        setTypeRoom(value);
        break;

      case "interior":
        setInterior(value);
        break;
      case "square":
        setSquare(value);
        break;
      case "rating":
        setRating(value);
        break;
      case "note":
        setNote(value);
        break;
      case "user_manager":
        setUser(value);
        break;
      case "rent":
        setRent(parseInt(value));
        break;
      case "author_phone":
        setAuthorPhone(value);
        break;
        case "address":
          setAddress(value);
          break;
      default:
        break;
    }
  };

  const onFileChange = (event) => {
    setImage(event.target.files[0]);
    setPhotoTemp(URL.createObjectURL(event.target.files[0]));
  };

  const handleContentChange = (contentHtml) => {
    setContent(contentHtml);
  };

  const calculationTable = () => {
    const newPrice = parseFloat(price);
    const newQty = parseFloat(qty);
    const newDiscountPer = parseFloat(discountPer);

    if (newPrice > 0 && newQty > 0 && newDiscountPer >= 0) {
      const newDiscount = Math.round(
        (newPrice * newQty * newDiscountPer) / 100
      );
      const newTotal = Math.round(newPrice * newQty);
      const newGrandTotal = Math.round(newPrice * newQty - newDiscount);

      setTotal(newTotal);
      setGrandTotal(newGrandTotal);
      setDiscount(newDiscount);
    } else {
      NotificationManager.error(
        "Negative value & Zero Price not allowed",
        "Input Field"
      );
    }
  };

  const handleCheckPrice = () => {
    calculationTable();
    setToggle(!toggle);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("brand", brand);
    formData.append("status", status);
    formData.append("unitSize", unit);
    formData.append("desc", content);
    formData.append("photo", image);
    formData.append("buyerPrice", buyerPrice);
    formData.append("price", price);
    formData.append("qty", _.sumBy(size, "amount"));
    formData.append("discountPer", discountPer);
    formData.append("discount", discount);
    formData.append("total", total);
    formData.append("netPrice", grand_total);
    formData.append("images", JSON.stringify(images));
    formData.append("size", JSON.stringify(size));
    formData.append("phoneNumber", phoneNumber);
    formData.append("typeRoom", typeRoom);
    formData.append("interior", interior);
    formData.append("square", square);
    formData.append("endow", endow);
    formData.append("rating", rating);
    formData.append("note", note);
    formData.append("user_manager", user);
    formData.append("rent", rent);
    formData.append("province", province);
    formData.append("district", district);
    formData.append("ward", ward);
    formData.append("provinceText", provinceText);
    formData.append("districtText", districtText);
    formData.append("wardText", wardText);
    formData.append("author_phone", author_phone);
    formData.append("address", address);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    swal({
      title: "Bạn có chắc?",
      text: "Bạn có chắc muốn cập nhật sản phẩm này ?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (success) => {
      if (success) {
        const imgList = await uploadImages(newAddImage);
        formData.append("newaddimage", JSON.stringify(imgList));
        let list = await GetProductDetails.getUpdateProduct(formData, config);
        if (list) {
          setLoading(false);
          props.history.push("/admin/product/list");
        } else {
          NotificationManager.error("Please! Check input field", "Input Field");
        }
      }
    });
  };

  const fetchData = async () => {
    try {
      const response = await Axios({
        url: API_URL + "/api/product/photo",
        method: "get",
        params: {
          productId: productId,
        },
      });
      const result = response.data;
      setImages(result.data);
    } catch (error) {}
  };

  const fetchData2 = async () => {
    try {
      const response = await Axios({
        url: API_URL + "/api/product/size",
        method: "get",
        params: {
          productId: productId,
        },
      });
      const result = response.data;
      setSize(result.data);
    } catch (error) {}
  };

  const updateSize = (size) => {
    setSize(size);
  };
  const cloudinaryConfig = {
    cloud_name: "cockbook",
    upload_preset: "uem2kud5",
  };
  const uploadImageToCloudinary = async (imageObject) => {
    try {
      const { image } = imageObject;
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", cloudinaryConfig.upload_preset);

      const response = await Axios.post(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud_name}/image/upload`,
        formData
      );

      const imageUrl = response.data.secure_url;

      return {
        ...imageObject,
        imageUrl,
      };
    } catch (error) {
      console.error("Lỗi khi upload hình ảnh:", error);
      return imageObject;
    }
  };

  const uploadImages = async (imageObjects) => {
    const uploadedImages = await Promise.all(
      imageObjects.map((imageObject) => uploadImageToCloudinary(imageObject))
    );

    return uploadedImages;
  };

  useEffect(() => {
    fetchData();
    fetchData2();
  }, [productId]);

  useEffect(() => {
    getCustomer();
  }, []);

  const getprovince = async (code) => {
    const response = await apiGetProvince(code);
    setProvinceDetail(response.results);
  };

  const getdistrict = async (code) => {
    const response = await apiGetWard(code);
    setListWard(response.results);
  };

  const fetchDataFromApi = () => {
    Axios.get("https://vapi.vnappmob.com/api/province")
      .then((response) => {
        setListProvince(response.data.results);
      })
      .catch((error) => {
        setListProvince(null);
      });
  };

  useEffect(() => {
    fetchDataFromApi();
  }, []);

  useEffect(() => {
    if (province) getprovince(province);
    if (district) getdistrict(district);
  }, [province, district]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-5 col-md-9 col-lg-6">
          <h2 className="mt-30 page-title">Sản phẩm</h2>
        </div>
        <div className="col-lg-5 col-md-3 col-lg-6 back-btn">
          <Button variant="contained" onClick={(e) => handleBack()}>
            <i className="fas fa-arrow-left" /> Back
          </Button>
        </div>
      </div>
      <ol className="breadcrumb mb-30">
        <li className="breadcrumb-item">
          <a href="/">Dashboard</a>
        </li>
        <li className="breadcrumb-item">
          <a href="/admin/product/create">Products</a>
        </li>
        <li className="breadcrumb-item active">Update Product</li>
      </ol>
      <div className="row">
        <div className="col-lg-12 col-md-12">
          <div className="card card-static-2 mb-30">
            <div className="card-title-2">
              <h4>Update Product</h4>
            </div>
            <div className="card-body-table">
              {loading ? <Loader /> : ""}
              <div className="news-content-right pd-20">
                <div className="row">
                  <div className="col-lg-4 col-md-4">
                    <div className="form-group">
                      <label className="form-label">Product Name*</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Product Name"
                        name="name"
                        value={name}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>
                  {/* <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">Slug*</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Slug"
                        name="slug"
                        value={slug}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div> */}
                  {/* <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">Brand*</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Brand Name"
                        name="brand"
                        value={brand}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div> */}
                  {/* <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">Size*</label>
                      <input
                        readOnly
                        type="size"
                        className="form-control"
                        name="image"
                        value={size.map((item) => item.size)}
                        style={{ marginBottom: 12 }}
                      />
                      <AddSize isupdate={true} updateSize={updateSize} size={size} />
                    </div>
                  </div> */}
                  <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">Image label*</label>
                      <div>
                        {photoTemp.length > 0 ? (
                          <Fragment>
                            <img
                              src={photoTemp}
                              className={"mr-3 mb-3"}
                              style={{
                                width: 130,
                                height: 130,
                                borderRadius: 10,
                                objectFit: "cover",
                                marginBottom: 12,
                                marginTop: 12,
                              }}
                            />
                            <Button
                              onClick={() => setPhotoTemp("")}
                              style={{ marginTop: 12 }}
                              variant={"contained"}
                              color={"#f00"}
                            >
                              Delete
                            </Button>
                          </Fragment>
                        ) : (
                          <img
                            src={photo}
                            className={"mr-3 mb-3"}
                            style={{
                              width: 130,
                              height: 130,
                              borderRadius: 10,
                              objectFit: "cover",
                              marginBottom: 12,
                              marginTop: 12,
                            }}
                          />
                        )}
                      </div>
                      <input
                        type="file"
                        className="form-control"
                        name="image"
                        onChange={onFileChange}
                      />
                    </div>
                  </div>
                </div>
                {/*  */}
                <br />
                <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">Địa chỉ chi tiết*</label>
                      <input
                        style={{ marginTop: 12 }}
                        type="text"
                        className="form-control"
                        placeholder="Địa chỉ"
                        name="address"
                        value={address}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label className="form-label">Tỉnh / Thành phố*</label>
                    <Box sx={{ width: "100%" }}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Tỉnh / Thành phố
                        </InputLabel>
                        <Select
                          style={{ height: 32 }}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={province}
                          // value={age}
                          onChange={(e) => setProvince(e.target.value)}
                        >
                          {/* eslint-disable-next-line */}
                          {listProvince
                            .map((item) => ({
                              ...item,
                              value: item.province_id,
                              label: item.province_name,
                            }))
                            .map((item, key) => (
                              <MenuItem
                                onClick={() => setProvinceText(item.label)}
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
                </div>
                {/*  */}
                <br />
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label className="form-label">Quận / Huyện*</label>
                    <Box sx={{ width: "100%" }}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Quận / Huyện
                        </InputLabel>
                        <Select
                          style={{ height: 32 }}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={district}
                          // value={age}
                          onChange={(e) => setDistrict(e.target.value)}
                        >
                          {/* eslint-disable-next-line */}
                          {provinceDetail
                            .map((el) => ({
                              ...el,
                              value: el.district_id,
                              label: el.district_name,
                            }))
                            .map((item, key) => (
                              <MenuItem
                                onClick={() => setDistrictText(item.label)}
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
                </div>
                <br />
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label className="form-label">Xã / Phường*</label>
                    <Box sx={{ width: "100%" }}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Xã / Phường
                        </InputLabel>
                        <Select
                          style={{ height: 32 }}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={ward}
                          // value={age}
                          onChange={(e) => setWard(e.target.value)}
                        >
                          {/* eslint-disable-next-line */}
                          {listWard
                            .map((el) => ({
                              ...el,
                              value: el.ward_id,
                              label: el.ward_name,
                            }))
                            .map((item, key) => (
                              <MenuItem
                                onClick={() => setWardText(item.label)}
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
                </div>
                {/* new */}
                <div className="col-lg-12 col-md-12">
                  <div className="form-group w-100 mt-3">
                    <label className="form-label">Ảnh sản phẩm*</label>
                    <br />
                    <div
                      className={
                        "d-flex align-items-center g-10 mr-2 flex-wrap mb-3"
                      }
                    >
                      {images.length > 0 &&
                        images.map((item, key) => (
                          <div key={key} style={{ position: "relative" }}>
                            <img
                              key={key}
                              src={item.imgUrl}
                              className={"mr-3 mb-3"}
                              style={{
                                width: 130,
                                height: 130,
                                borderRadius: 10,
                                objectFit: "cover",
                              }}
                            />
                            <button
                              onClick={() => {
                                setImages(
                                  images.filter((item2) => item2.id !== item.id)
                                );
                              }}
                              style={{
                                position: "absolute",
                                right: 0,
                                top: 0,
                              }}
                            >
                              X
                            </button>
                          </div>
                        ))}
                      {newAddImage.map((item, key) => (
                        <div key={key} style={{ position: "relative" }}>
                          <img
                            src={item.previewUrl}
                            className={"mr-3 mb-3"}
                            style={{
                              width: 130,
                              height: 130,
                              borderRadius: 10,
                              objectFit: "cover",
                            }}
                          />
                          <button
                            onClick={() => {
                              setNewAddImage(
                                newAddImage.filter(
                                  (item2) => item2.id !== item.id
                                )
                              );
                            }}
                            style={{
                              position: "absolute",
                              right: 0,
                              top: 0,
                            }}
                          >
                            X
                          </button>
                        </div>
                      ))}
                      <div
                        className={"mr-3 mb-3"}
                        style={{
                          width: 130,
                          height: 130,
                          borderRadius: 10,
                          objectFit: "cover",
                          backgroundColor: "#f2f0f5",
                          marginLeft: 12,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          position: "relative",
                        }}
                      >
                        <input
                          style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            opacity: 0,
                          }}
                          type="file"
                          onChange={(e) => {
                            e.persist();
                            setNewAddImage((prev) => [
                              ...prev,
                              {
                                id: v4(),
                                previewUrl: URL.createObjectURL(
                                  e.target.files[0]
                                ),
                                image: e.target.files[0],
                              },
                            ]);
                          }}
                        />
                        Thêm ảnh
                      </div>
                    </div>
                  </div>
                </div>
                {/*  */}
                <div className="row" style={{ paddingTop: "2rem" }}>
                  <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">Trạng thái*</label>
                      <select
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
                      <label className="form-label">Cost*</label>
                      <input
                        type="number"
                        className="form-control"
                        name="buyerPrice"
                        value={buyerPrice}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div> */}
                  <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">Giá thuê*</label>
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={price}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">
                        Số điện thoại liên hệ*
                      </label>
                      <input
                        className="form-control"
                        name="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">Số sao*</label>
                      <input
                        style={{ marginTop: 12 }}
                        type="number"
                        className="form-control"
                        name="rating"
                        value={rating}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">Loại phòng*</label>
                      <select
                        id="typeRoom"
                        name="typeRoom"
                        className="form-control"
                        value={typeRoom}
                        onChange={(e) => handleChange(e)}
                      >
                        <option value={1}>1 phòng ngủ</option>
                        <option value={2}>2 phòng ngủ</option>
                        <option value={3}>3 phòng ngủ</option>
                        <option value={4}>4 phòng ngủ</option>
                        <option value={5}>5 phòng ngủ</option>
                        <option value={6}>5+ phòng ngủ</option>
                        <option value={7}>Nhà nguyên căn</option>
                        <option value={8}>Phòng trọ</option>
                        <option value={9}>Chung cư cao cấp</option>
                        <option value={10}>Penhouse</option>
                        <option value={11}>Studio</option>
                        <option value={12}>Deluxe</option>
                        <option value={13}>Suite Double</option>
                        <option value={14}>Classic Double</option>
                        <option value={15}>Premier Deluxe</option>
                        <option value={16}>Ocean Penthouse</option>
                        <option value={17}>Grand Suites</option>
                        <option value={18}>Superior</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">
                        Diện tích (m<sup>2</sup>)*
                      </label>
                      <input
                        className="form-control"
                        name="square"
                        value={square}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">Nội thất*</label>
                      <input
                        className="form-control"
                        name="interior"
                        value={interior}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-1 col-md-1">
                    <div className="form-group">
                      <label className="form-label">Giảm giá(%)*</label>
                      <input
                        type="number"
                        className="form-control"
                        name="discountPer"
                        value={discountPer}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>
                  {/*  */}
                  <div className="col-lg-1 col-md-1">
                    <div className="form-group">
                      <label className="form-label">Danh mục</label>
                      <select
                        id="status"
                        name="status"
                        className="form-control"
                        value={endow}
                        onChange={(e) => setEndow(e.target.value)}
                      >
                        <option value={0}>Không</option>
                        <option value={1}>Hot</option>
                        <option value={2}>Ưu đãi</option>
                        <option value={3}>Bán chạy</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4" style={{}}>
                  <div className="form-group">
                    <label className="form-label">Ghi chú (nếu có)</label>
                    <input
                      style={{ marginTop: 12 }}
                      type="text"
                      className="form-control"
                      name="note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-lg-4 col-md-4" style={{}}>
                  <div className="form-group">
                    <label className="form-label">Người quản lý</label>
                    <select
                      id="user_manager"
                      name="user_manager"
                      className="form-control"
                      value={user}
                      onChange={(e) => handleChange(e)}
                    >
                      {listUser.map((item, key) => (
                        <option
                          value={item.id}
                          key={key}
                        >
                          {item.firstName + " " + item.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-lg-2 col-md-2">
                  <div className="form-group">
                    <label className="form-label">Số điện thoại chủ nhà*</label>
                    <input
                      type="text"
                      className="form-control"
                      name="author_phone"
                      value={author_phone}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
                <div className="col-lg-4 col-md-4" style={{}}>
                  <div className="form-group">
                    <label className="form-label">Đã thuê</label>
                    <select
                      id="rent"
                      name="rent"
                      className="form-control"
                      value={rent}
                      onChange={(e) => handleChange(e)}
                    >
                      <option value={0}>Chưa thuê</option>
                      <option value={1}>Đã thuê</option>
                    </select>
                  </div>
                </div>

                <div className="row" style={{ paddingTop: "2rem" }}>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label className="form-label">Mô tả chi tiết*</label>
                      <RichTextEditor
                        content={content}
                        handleContentChange={handleContentChange}
                        placeholder="insert text here..."
                      />
                    </div>
                  </div>
                </div>
                <div className="button_price">
                  <div
                    className="form-group"
                    style={toggle ? { display: "block" } : { display: "none" }}
                  >
                    <button
                      className="save-btn hover-btn"
                      type="submit"
                      onClick={handleSubmit}
                    >
                      Update
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
