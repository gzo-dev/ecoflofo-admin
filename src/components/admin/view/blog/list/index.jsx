import React, { useState, useEffect } from "react";
import { GetLocationDetails } from "../../../../services";
import { Typography, Button } from "@material-ui/core";
import Edit from "../../tours/edit";
import swal from "sweetalert";
import { apiDeleteBlog, apiDeleteTour, apiGetListBlog } from "../../../../../api";
import moment from "moment"
import {Link } from "react-router-dom"

const List = ({ history }) => {
  const [getList, setGetList] = useState([]);

  const handleBack = () => {
    history.goBack();
  };

  const getData = async () => {
    try {
      const list = await apiGetListBlog();
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
        const value = await apiDeleteBlog({id});
        if (value) {
          getData();
        }
      }
    } catch (error) {
      console.error("Error deleting area:", error);
    }
  };

  const summarizeContent = (content) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    let summarizedText = "";
    let lineCount = 0;

    const extractText = (node) => {
      if (lineCount >= 3) {
        return; // Stop extracting text if we have reached 3 lines
      }

      if (node.nodeType === Node.TEXT_NODE) {
        const lines = node.textContent.trim().split("\n");
        for (const line of lines) {
          if (lineCount < 3) {
            summarizedText += line + "\n";
            lineCount++;
          } else {
            break;
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.nodeName === "BR") {
          summarizedText += "\n";
          lineCount++;
        } else {
          node.childNodes.forEach((childNode) => extractText(childNode));
        }
      }
    };

    doc.body.childNodes.forEach((node) => extractText(node));

    if (lineCount >= 3) {
      summarizedText += "..."; // Add ellipsis if there are more than 3 lines
    }

    return summarizedText.trim();
  };

  const renderTypeBlog= (type)=> {
    switch(type) {
      case 1:
        return "Thị trường logistics trong và ngoài nước"
      case 2:
        return "Thị trường xuất nhập khẩu toàn cầu"
      case 3:
        return "Tin tức"
      case 4: 
        return "Khác"
      default:
        break
    }
  }


  useEffect(() => {
    getData();
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
        <li className="breadcrumb-item active">Blogs</li>
      </ol>
      <div className="row justify-content-between">
        <div className="col-lg-12">
          <a href="/admin/blog/create" className="add-btn hover-btn">
            Thêm mới
          </a>
        </div>
        <div className="col-lg-12 col-md-12">
          <div className="card card-static-2 mt-30 mb-30">
            <div className="card-title-2">
              <h4>Tất cả blog</h4>
            </div>
            <div className="card-body-table">
              <div className="table-responsive">
                <table className="table ucp-table table-hover">
                  <thead>
                    <tr>
                      <th style={{whiteSpace: "nowrap"}}>Mã blog</th>
                      <th>Tên blog</th>
                      <th style={{whiteSpace: "nowrap"}}>Loại blog</th>
                      <th>Mô tả</th>
                      <th>Nội dung</th>
                      <th style={{whiteSpace: "nowrap"}}>Người đăng</th>
                      <th style={{whiteSpace: "nowrap"}}>Thời gian tạo</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getList.map((row, index) => (
                      <tr key={index}>
                        <td>{row.id}</td>
                        <td>{row.name}</td>
                        <td>
                          {renderTypeBlog(row.type)}
                        </td>
                        <td>{row.desc || ""}</td>
                        <td>
                          <div className="tr-2l" dangerouslySetInnerHTML={{__html: summarizeContent(row.content)}}></div>
                        </td>
                        <td>{row.author}</td>
                        <td>{moment(row.time_created).format("DD-MM-YYYY HH:MM:ss") || ""}</td>
                        <td className="action-btns">
                          <Link
                                to={{
                                  pathname: `/admin/blog/edit`,
                                  state: { row },
                                }}
                              >
                                <Typography className="edit-btn">
                                  <i className="fas fa-edit" />
                                </Typography>
                              </Link>
                          <Typography
                            className="delete-btn"
                            onClick={(e) => handlDeleteById(row.id)}
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
