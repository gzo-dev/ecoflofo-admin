import React, { useState } from 'react';
import { Button, Paper } from "@material-ui/core";
import { GetUserLogin } from '../../../../services';
import { NotificationManager } from 'react-notifications';
import Loader from '../../../../loader';

const Create = ({ history }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        email: null,
        firstName: null,
        lastName: null,
        address: null,
        phone: '',
        password: null,
        confirmPassword: null,
        status: 0,
        role: null
    });

    const handleChange = (e) => {
        console.log(e.target.name)
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleBack = () => {
        history.goBack();
    }

    const handleSubmit = async () => {
        try {
            setIsLoaded(true);
            const { password, confirmPassword, ...data } = formData;
            if (password !== confirmPassword) {
                alert("Mật khẩu không khớp");
                setIsLoaded(false);
            } else {
                const user = await GetUserLogin.getUserRegister(formData);
                if (user) {
                    setIsLoaded(false);
                    history.goBack();
                    NotificationManager.success("Tạo người dùng thành công", 'Message');
                } else {
                    NotificationManager.error("Có lỗi xảy ra!", 'Input');
                    setIsLoaded(false);
                }
            }
        } catch (error) {
            console.log(error);
            NotificationManager.error("Email đã tồn tại trên hệ thống!", 'Input');
            setIsLoaded(false);
        }
    }

    const { firstName, lastName, email, role, confirmPassword, password, status, address, phone } = formData;

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-5 col-md-9 col-lg-6">
                    <h2 className="mt-30 page-title">Tạo người dùng mới</h2>
                </div>
                <div className="col-lg-5 col-md-3 col-lg-6 back-btn">
                    <Button variant="contained" onClick={handleBack}><i className="fas fa-arrow-left" /> Back</Button>
                </div>
            </div>
            <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">Dashboard</li>
                <li className="breadcrumb-item">Nguời dùng</li>
            </ol>
            <Paper className="user-management" style={{ padding: "1rem" }}>
                {isLoaded ? <Loader /> : null}
                <div className="row">
                    <div className="col-md-6 form-group">
                        <label>Họ</label>
                        <input type="text" className="form-control" name="firstName" value={firstName} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 form-group">
                        <label>Tên</label>
                        <input type="text" className="form-control" name="lastName" value={lastName} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 form-group">
                        <label>Số điện thoại</label>
                        <input type="number" className="form-control" name="phone" value={phone} onChange={handleChange} maxLength="10" />
                    </div>
                    <div className="col-md-6 form-group">
                        <label>Email</label>
                        <input type="text" className="form-control" name="email" value={email} onChange={handleChange} />
                    </div>
                    <div className="col-md-12 form-group">
                        <label>Địa chỉ</label>
                        <input type="text" className="form-control" name="address" value={address} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 form-group">
                        <label>Trạng thái</label>
                        <select className="form-control" name="status" value={status} onChange={handleChange}>
                            <option>Chọn trạng thái</option>
                            <option value="1">Active</option>
                            <option value="0">inActive</option>
                        </select>
                    </div>
                    <div className="col-md-6 form-group">
                        <label>Chức vụ</label>
                        <select className="form-control" name="role" value={role} onChange={handleChange}>
                            <option >Chọn chức vụ</option>
                            <option value="fulltime">Fulltime</option>
                            <option value="parttime">Part time</option>

                        </select>
                    </div>
                    <div className="col-md-12 form-group">
                        <label>Mật khẩu</label>
                        <input type="password" className="form-control" name="password" value={password} onChange={handleChange} />
                    </div>
                    <div className="col-md-12 form-group">
                        <label>Xác nhận mật khẩu</label>
                        <input type="password" className="form-control" name="confirmPassword" value={confirmPassword} onChange={handleChange} />
                    </div>
                </div>
                <button className="btn btn-success col-sm-3 mt-3 py-2" onClick={handleSubmit}>Lưu</button>
            </Paper>
        </div>
    );
}

export default Create;
