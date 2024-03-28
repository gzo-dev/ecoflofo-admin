import React, { useState } from 'react';
import { Button, Paper, Typography } from "@material-ui/core";
import { GetUserLogin } from '../../../../services';
import { NotificationManager } from 'react-notifications';
import Loader from '../../../../loader';

const Edit = (props) => {
    const [userData, setUserData] = useState(props.location.state);
    const [isLoaded, setIsLoaded] = useState(false);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleBack = () => {
        props.history.goBack();
    };

    const handleSubmit = async () => {
        setIsLoaded(true);

        // Perform all necessary validations
        if (password !== confirmPassword) {
            alert("Mật khẩu không khớp");
            setIsLoaded(false);
        } else {
            const data = { ...userData, password: password };
            // Make API call
            const user = await GetUserLogin.getUserUpdate(data);
            if (user) {
                setIsLoaded(false);
                props.history.goBack();
                NotificationManager.success("Update success", 'Message');
            } else {
                NotificationManager.error("Check field", 'Input');
            }
        }
    };

    const { firstName, lastName, email, role, address, phone, status } = userData;

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-5 col-md-9 col-lg-6">
                    <Typography variant="h4" className="mt-30 page-title">Cập nhật người dùng</Typography>
                </div>
                <div className="col-lg-5 col-md-3 col-lg-6 back-btn">
                    <Button variant="contained" onClick={handleBack}><i className="fas fa-arrow-left" /> Back</Button>
                </div>
            </div>
            <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">Dashboard</li>
                <li className="breadcrumb-item">User</li>
            </ol>
            <Paper className="user-management" style={{ padding: "1rem" }}>
                {isLoaded ? <Loader /> : null}
                <div className="row">
                    <div className="col-md-6 form-group">
                        <label>First Name</label>
                        <input type="text" className="form-control" name="firstName" value={firstName} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 form-group">
                        <label>Last Name</label>
                        <input type="text" className="form-control" name="lastName" value={lastName} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 form-group">
                        <label>Address</label>
                        <input type="text" className="form-control" name="address" value={address} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 form-group">
                        <label>Status</label>
                        <select className="form-control" name="status" value={status} onChange={handleChange}>
                            <option value="0">Inactive</option>
                            <option value="1">Active</option>
                        </select>
                    </div>
                    <div className="col-md-6 form-group">
                        <label>Email</label>
                        <input type="text" className="form-control" name="email" value={email} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 form-group">
                        <label>Phone</label>
                        <input type="text" className="form-control" name="phone" value={phone} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 form-group">
                        <label>Chức vụ</label>
                        <select className="form-control" name="role" value={role} onChange={handleChange}>
                            <option value="fulltime">Fulltime</option>
                            <option value="parttime">Part time</option>
                        </select>
                    </div>
                    <div className="col-md-12 form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="col-md-12 form-group">
                        <label>Confirm Password</label>
                        <input type="password" className="form-control" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                </div>
                <Button variant="contained" color="primary" className="mt-3" onClick={handleSubmit}>Update</Button>
            </Paper>
        </div>
    );
};

export default Edit;
