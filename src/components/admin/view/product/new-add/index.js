import React, { useState, useEffect } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import MainCategorylist from "../../../../common/category/main-category";
import { GetCategoryDetails, GetProductDetails, GetUserLogin } from "../../../../services";
import SubCategorylist from "../../../../common/category/sub-category";
import Loader from "../../../../loader";
import { NotificationManager } from "react-notifications";
import swal from "sweetalert";
import { toast } from "react-toastify";
import TextField from '@material-ui/core/TextField';
import AddSize from "./add_size";
import _ from "lodash";
import Axios from "axios";
import { v4 } from "uuid";
import RichTextEditor from "../../../../RichTextEditor";
import { apiGetProvince, apiGetWard } from "../../../../../api";

const NewProduct = (props) => {
  const [files, setFiles] = useState([]);
  const [amount, setAmount] = useState([])
  const [getList, setGetList] = useState([]);
  const [getsublist, setGetSublist] = useState([{ name: "" }]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedChildCategory, setSelectedChildCategory] = useState("");
  const [blockhide, setBlockhide] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState(1);
  const [unit, setUnit] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [sortDesc, setSortDesc] = useState(null);
  const [buyerPrice, setBuyerPrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [qty, setQty] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [discountPer, setDiscountPer] = useState(0);
  const [total, setTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [previewImage, setPreviewImage] = useState([]);
  const [typeUnit, setTypeUnit] = useState(0);
  const [size, setSize] = useState([]);
  const [newAddImage, setNewAddImage] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState([]);
  const [listProvince, setListProvince] = useState([]);
  const [listDictrict, setListDitrict] = useState([])
  const [listWard, setListWard] = useState([])
  const [province, setProvince] = useState()
  const [district, setDistrict] = useState()
  const [provinceText, setProvinceText] = useState()
  const [districtText, setDistrictText] = useState()
  const [wardText, setWardText] = useState()
  const [provinceDetail, setProvinceDetail] = useState([]);
  const [ward, setWard] = useState()
  const [square, setSquare] = useState()
  const [interior, setInterior] = useState()
  const [typeRoom, setTypeRoom] = useState()
  const [address, setAddress]= useState()
  const [rating, setRating] = useState()
  const [note, setNote] = useState()
  const [user, setUser] = useState();
  const [listUser, setListUser] = useState([]);
  const [author_phone, setAuthorPhone] = useState();

  const getCustomer = async () => {
    let list = await GetUserLogin.getAllUserList();
    if (list) {
      var tdata = list.data;
      setListUser(tdata);
    }
  };
  useEffect(() => {
    fetchDataFromApi();
  }, []);

  const getprovince = async (code) => {
    const response = await apiGetProvince(code);
    setProvinceDetail(response.results);
  };

  const getdistrict = async (code) => {
    const response = await apiGetWard(code)
    setListWard(response.results)
  }

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
    if (province) getprovince(province);
    if (district) getdistrict(district)

  }, [province, district]);

  const handleBack = () => {
    props.history.goBack();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setSlug(value.toLowerCase().replaceAll(" ", "-"));
    }
    if (name === "content") {
      setSortDesc(value);
    }
    switch (name) {
      case "name":
        setName(value);
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
      case "discountPer":
        setDiscountPer(value);
        break;
      case "phoneNumber":
        setPhoneNumber(value);
        break;
      case "square":
        setSquare(value);
        break;
      case "rating":
        setRating(value);
        break;
      case "user_manager":
        setUser(value);
        break;
        case "author_phone":
          setAuthorPhone(value);
          break;
      default:
        break;
    }
  };

  const onFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleContentChange = (contentHtml) => {
    setContent(contentHtml);
  };

  const handleCategory = async (value) => {
    setSelectedCategory(value);
    let categoryId = value;
    let list = await GetCategoryDetails.getSelectSubCategory(categoryId);
    setGetList(list.data);
  };

  const handleSubCategory = async (value) => {
    setSelectedSubCategory(value);
    let list = await GetCategoryDetails.getAllSubChildCategory(value);
    setGetSublist(list.data);
    setBlockhide(true);
  };

  const handleChildCategory = async (value) => {
    setSelectedChildCategory(value);
  };

  const caculationTable = () => {
    let price = price;
    let qty = qty;
    let discountPer = discountPer;
    if (price > 0 && qty > 0 && discountPer >= 0) {
      let discount = Math.round((price * qty * discountPer) / 100);
      let total = Math.round(price * qty);
      let grand_total = Math.round(price * qty - discount);

      setTotal(total);
      setGrandTotal(grand_total);
      setDiscount(discount);
    } else {
      NotificationManager.error(
        "Negative value & Zero Price not allowed",
        "Input Field"
      );
    }
  };

  const handleCheckPrice = () => {
    caculationTable();
    setToggle(!toggle);
  };

  const handleSubmit = async (event, listImage) => {
    event.preventDefault();
    setIsLoaded(true);
    const formData = new FormData();
    formData.append("categoryId", selectedCategory);
    formData.append("subCategoryId", selectedSubCategory);
    formData.append("childCategoryId", selectedChildCategory);
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("brand", brand);
    formData.append("status", status);
    formData.append("unitSize", unit);
    formData.append("desc", content);
    formData.append("sortDesc", sortDesc);
    formData.append("photo", image);
    formData.append("buyerPrice", buyerPrice);
    formData.append("price", price);
    formData.append("qty", _.sumBy(size, "amount"));
    formData.append("amount", _.sumBy(size, "amount"));
    formData.append("discountPer", discountPer);
    formData.append("discount", discount);
    formData.append("total", total);
    formData.append("netPrice", grandTotal);
    formData.append("image", JSON.stringify(listImage));
    formData.append("size", JSON.stringify(size));
    formData.append("province", province)
    formData.append("district", district)
    formData.append("ward", ward)
    formData.append("phoneNumber", phoneNumber)
    formData.append("provinceText", provinceText)
    formData.append("districtText", districtText)
    formData.append("wardText", wardText)
    formData.append("typeRoom", typeRoom)
    formData.append("interior", interior)
    formData.append("square", square)
    formData.append("rating", rating)
    formData.append("note", note)
    formData.append("user_manager", user);
    formData.append("author_phone", author_phone);
    formData.append("address", address);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    swal({
      title: "Bạn có chắc?",
      text: "Bạn có muốn tạo sản phẩm này không",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (success) => {
      if (success) {
        const imgList = await uploadImages(newAddImage);
        formData.append("newaddimage", JSON.stringify(imgList));
        let list = await GetProductDetails.addProductList(formData, config);
        if (list) {
          setIsLoaded(false);
          props.history.push("/admin/product/list");
        } else {
          NotificationManager.error("Please! Check input field", "Input Field");
        }
      }
    }).catch(() => NotificationManager.error("Please! Check input field", "Input Field"));
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

  const uploadImageToCloudinary = async (imageObject) => {
    const cloudinaryConfig = {
      cloud_name: "cockbook",
      upload_preset: "uem2kud5",
    };
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
      console.error("Error uploading image:", error);
      return imageObject;
    }
  };

  const uploadImages = async (imageObjects) => {
    const uploadedImages = await Promise.all(
      imageObjects.map((imageObject) => uploadImageToCloudinary(imageObject))
    );

    return uploadedImages;
  };

  const handleSubmitMoreImage = async (event) => {
    setIsLoaded(true);
    const formData = new FormData();
    formData.append("productId", "-1");
    for (const file of files) {
      formData.append("file", file);
    }
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    const imgList = await uploadImages(newAddImage);
    formData.append("newaddimage", JSON.stringify(imgList));
    let list = await GetProductDetails.getUploadProductImage(formData, config);
    if (list) {
      setIsLoaded(false);
      toast.success("Thêm thành công");
      return list;
    } else {
      toast.error("error");
      return [];
    }
  };

  const updateSize = (size, amount) => {
    setSize(size);
    setAmount(amount);
  };

  useEffect(() => {
    getCustomer();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-5 col-md-9 col-lg-6">
          <h2 className="mt-30 page-title">Sản phẩm</h2>
        </div>
        <div className="col-lg-5 col-md-3 col-lg-6 back-btn mb-3">
          <Button variant="contained" onClick={(e) => handleBack(e)}>
            <i className="fas fa-arrow-left" /> Back
          </Button>
        </div>
        <br />
      </div>
      <ol className="breadcrumb mb-30">
        <li className="breadcrumb-item">
          <a href="/">Dashboard</a>
        </li>
        <li className="breadcrumb-item">
          <a href="/admin/product/create">Products</a>
        </li>
        <li className="breadcrumb-item active">Add Product</li>
      </ol>

      <div className="row">
        <div className="col-lg-6 col-md-6">
          <div className="card card-static-2 mb-30">
            <div className="card-body-table">
              <div className="news-content-right pd-20">
                <div className="form-group">
                  <label className="form-label">Thể loại*</label>
                  <MainCategorylist onSelectCategory={handleCategory} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-6">
          <div className="card card-static-2 mb-30">
            <div className="card-body-table">
              <div className="news-content-right pd-20">
                <div className="form-group">
                  <label className="form-label">Thể loại con*</label>
                  <SubCategorylist
                    state={getList}
                    onSelectSubCategory={handleSubCategory}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="row"
        style={
          blockhide ? { display: "block" } : { display: "none" }
        }
      >
        {isLoaded ? <Loader /> : ""}
        <div className="col-lg-12 col-md-12">
          <div className="card card-static-2 mb-30">
            <div className="card-title-2">
              <h4>Thêm sản phẩm</h4>
            </div>
            <div className="card-body-table">
              <div className="news-content-right pd-20">
                <div className="row">
                  <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">Tên sản phẩm*</label>
                      <input
                        style={{ marginTop: 12 }}
                        type="text"
                        className="form-control"
                        placeholder="Tên sản phẩm"
                        name="name"
                        value={name}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>
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
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">Tỉnh / Thành phố*</label>
                      <Box sx={{ width: "100%" }}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">Tỉnh / Thành phố</InputLabel>
                          <Select
                            style={{ height: 32 }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={province}
                            // value={age}
                            onChange={(e) => setProvince(e.target.value)}
                          >
                            {/* eslint-disable-next-line */}
                            {listProvince.map((item) => ({
                              ...item,
                              value: item.province_id,
                              label: item.province_name,
                            })).map((item, key) => <MenuItem onClick={() => setProvinceText(item.label)} value={item.value} key={key}>{item.label}</MenuItem>)}
                          </Select>
                        </FormControl>
                      </Box>
                    </div>
                  </div>
                  {/*  */}

                  <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">Quận / Huyện*</label>
                      <Box sx={{ width: "100%" }}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">Quận / Huyện</InputLabel>
                          <Select
                            style={{ height: 32 }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={district}
                            // value={age}
                            onChange={(e) => setDistrict(e.target.value)}
                          >
                            {/* eslint-disable-next-line */}
                            {provinceDetail.map((el) => ({
                              ...el,
                              value: el.district_id,
                              label: el.district_name,
                            })).map((item, key) => <MenuItem onClick={() => setDistrictText(item.label)} value={item.value} key={key}>{item.label}</MenuItem>)}
                          </Select>
                        </FormControl>
                      </Box>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">Xã / Phường*</label>
                      <Box sx={{ width: "100%" }}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">Xã / Phường</InputLabel>
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
                              })).map((item, key) => <MenuItem onClick={() => setWardText(item.label)} value={item.value} key={key}>{item.label}</MenuItem>)}
                          </Select>
                        </FormControl>
                      </Box>
                    </div>
                  </div>
                  {/*  */}
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
                      <label className="form-label">Ảnh đại diện*</label>
                      <input
                        style={{ marginTop: 12 }}
                        type="file"
                        className="form-control"
                        name="image"
                        onChange={onFileChange}
                      />
                    </div>
                  </div>
                  {/* new */}
                  <div className="col-lg-12 col-md-12 mt-3">
                    <div className="form-group">
                      <label className="form-label">Ảnh sản phẩm*</label>
                      <input
                        style={{ marginTop: 12 }}
                        className="form-control"
                        type="file"
                        multiple
                        name="files"
                        onChange={fileSelectedHandler}
                      />
                      <br />
                      <div
                        className={
                          "d-flex align-items-center g-10 mr-2 flex-wrap mb-3"
                        }
                      >
                        {previewImage.length > 0 &&
                          previewImage.map((item, key) => (
                            <div style={{ position: "relative" }}>
                              <img
                                key={key}
                                src={item.preview}
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
                                  setPreviewImage(
                                    previewImage.filter(
                                      (item2) => item2.id != item.id
                                    ),
                                  );
                                  setFiles(
                                    [...files].filter(
                                      (item2) => item2.lastModified != item.id
                                    ),
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

                        {newAddImage.map((item, key) => <div key={key} style={{ position: "relative" }}>
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
                              setNewAddImage(newAddImage.filter((item2) => item2.id !== item.id));
                            }}
                            style={{
                              position: "absolute",
                              right: 0,
                              top: 0,
                            }}
                          >
                            X
                          </button>
                        </div>)
                        }
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
                            position: "relative"
                          }}
                        >
                          <input style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, opacity: 0 }} type="file" onChange={(e) => {
                            e.persist()
                            setNewAddImage(prev => ([...prev, { id: v4(), previewUrl: URL.createObjectURL(e.target.files[0]), image: e.target.files[0] }]))
                          }} />
                          Thêm ảnh
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*  */}
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
                  <div className="col-lg-2 col-md-2">
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
                  {/*  */}
                  <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">Nội thất*</label>
                      <input
                        style={{ marginTop: 12 }}
                        type="text"
                        className="form-control"
                        placeholder="Nội thất"
                        name="interior"
                        value={interior}
                        onChange={(e) => setInterior(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">Loại phòng*</label>
                      <select
                        style={{marginTop: 12}}
                        id="typeRoom"
                        name="typeRoom"
                        className="form-control"
                        value={typeRoom}
                        onChange={(e) => setTypeRoom(e.target.value)}
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
                  {/*  */}
                  <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">Diện tích (m<sup>2</sup>)*</label>
                      <input
                      style={{marginTop: 12}}
                        className="form-control"
                        name="square"
                        value={square}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>
                  {/*  */}
                  <div className="col-lg-2 col-md-2">
                    <div className="form-group">
                      <label className="form-label">Giá (VND)*</label>
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
                  <div
                    className="col-lg-4 col-md-4"
                    style={{}}
                  >
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
                        style={{ marginTop: 12 }}
                        id="user_manager"
                        name="user_manager"
                        className="form-control"
                        value={user}
                        onChange={(e) => handleChange(e)}
                      >
                        {listUser.map((item, key) => <option value={item.firstName + " " + item.lastName} key={key}>
                          {item.firstName + " " + item.lastName}
                        </option>)}
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
                </div>

                <div className="row" style={{ paddingTop: "2rem" }}>
                  <div className="form-group" style={{ opacity: 0 }}>
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
                  </div>
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
                        const result = await handleSubmitMoreImage(e);
                        setTimeout(() => {
                          handleSubmit(e, result.data);
                        }, 5000);
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

export default NewProduct;
