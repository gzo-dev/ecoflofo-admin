import React, { Fragment } from "react";
import { getCookie } from "../../../function";
import { Link } from "react-router-dom";
import LogoNoTextImage from "../../../assets/logonotext.png"
import { GetUserLogin } from "../../services";

const Sidebar = () => {
  const role = getCookie("role");

  const isActive = (url) => {
    return window.location.pathname === url ? "nav-link active" : "nav-link";
  };

  return (
    <div id="layoutSidenav_nav">
      <nav
        className="sb-sidenav accordion sb-sidenav-dark"
        id="sidenavAccordion"
      >
        <div className="sb-sidenav-menu">
          <div className="w-100 d-flex justify-content-center align-items-center pb-3 pt-1 mb-3" style={{borderBottom: "1px solid #999999"}}>
            <img src={LogoNoTextImage} alt="" style={{width: 200}} />
          </div>
          <div className="nav">
            <Link className="nav-link active" to="/">
              <div className="sb-nav-link-icon">
                <i className="fas fa-tachometer-alt" />
              </div>
              Bảng điều khiển
            </Link>
            {(role === "admin" || role === "fulltime") && <Fragment>
            </Fragment>}
            <Link
              className={role === "admin" ? isActive("/admin/user/list") : "d-none"}
              to="/admin/user/list"
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-users" />
              </div>
              Quản lý người dùng hệ thống
            </Link>
            {/*  */}
            <Link
              className="nav-link collapsed"
              to="/admin/area/list"
              data-toggle="collapse"
              data-target="#collapseBlogs"
              aria-expanded="false"
              aria-controls="collapseBlogs"
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-map-marked-alt" />
              </div>
              Blog
              <div className="sb-sidenav-collapse-arrow">
                <i className="fas fa-angle-down" />
              </div>
            </Link>
            <div
              className="collapse"
              id="collapseBlogs"
              aria-labelledby="headingTwo"
              data-parent="#sidenavAccordion"
            >
              <nav className="sb-sidenav-menu-nested nav">
                <Link className="nav-link sub_nav_link" to="/admin/blog/list">
                  Quản lý blog
                </Link>
                <Link
                  className="nav-link sub_nav_link"
                  to="/admin/blog/create"
                >
                  Thêm blog
                </Link>
              </nav>
            </div>
            {(role === "admin" || role === "fulltime") &&
              <Link className={isActive("/admin/contact/list")} to="/admin/contact/list">
                <div className="sb-nav-link-icon">
                  <i className="fas fa-gift" />
                </div>
                Liên hệ
              </Link>
            }
            <Link
              className="nav-link collapsed"
              onClick={(e) => {
                e.preventDefault()
                GetUserLogin.logout()
              }}
              to="/admin"
              data-toggle="collapse"
              data-target="#collapseBlogs"
              aria-expanded="false"
              aria-controls="collapseBlogs"
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-map-marked-alt" />
              </div>
              Đăng xuất
             
            </Link>
            {/*  */}
            {/* <Link className={isActive("/admin/customer/list")} to="/admin/customer/list">
              <div className="sb-nav-link-icon">
                <i className="fas fa-users" />
              </div>
              Quản lý người dùng
            </Link> */}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
