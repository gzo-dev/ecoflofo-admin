import React, { useState, useEffect } from "react";
import { Redirect } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import Loader from '../../loader';
import { GetUserLogin } from '../../services';
import LogoImage from "../../../assets/logo.png"
import { MdOutlinePhone } from "react-icons/md";
import { CiLock } from "react-icons/ci";

const Signin = () => {
    const deviceCode= localStorage.getItem("deviceCode") ? localStorage.getItem("deviceCode") : ""
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [redirectToReferrer, setRedirectToReferrer] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const rememberedEmail = localStorage.getItem("rememberedEmail");
        const rememberedPassword = localStorage.getItem("rememberedPassword");
        if (rememberedEmail && rememberedPassword) {
            setEmail(rememberedEmail);
            setPassword(rememberedPassword);
            setRememberMe(true);
        }
    }, []);

    const handleChangeUser = (e) => {
        if (e.target.name === 'email') {
            setEmail(e.target.value);
        } else if (e.target.name === 'password') {
            setPassword(e.target.value);
        }
    }

    const handleRememberMeChange = (e) => {
        setRememberMe(e.target.checked);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoaded(true);
        let data = { email: email, password: password, deviceCode };
        let user = await GetUserLogin.getUserLogin(data);
        if (user) {
            if (rememberMe) {
                localStorage.setItem("rememberedEmail", email);
                localStorage.setItem("rememberedPassword", password);
            }
            GetUserLogin.authenticate(user, () => {
                setRedirectToReferrer(true);
                setIsLoaded(false);
                window.location.reload();
            });
        } else {
            setIsLoaded(false);
            NotificationManager.error("Please! Check Username & Password", "Input Field");
        }
    }

    if (redirectToReferrer || localStorage.getItem('token')) {
        return (<Redirect to={'/admin'} />)
    }

    return (
        <div className="bg-sign">
            <div id="layoutAuthentication">
                <div id="layoutAuthentication_content">
                    <main>
                        <div className="container">
                            {isLoaded ? <Loader /> : ''}
                            <div className="row justify-content-center">
                                <div className="col-lg-5">
                                    <div className="card shadow-lg border-0 rounded-lg mt-5">
                                        <div className="card-header card-sign-header" style={{backgroundColor: "white"}}>
                                            <h3 className="text-center font-weight-light my-4">
                                                <img src={LogoImage} alt="" style={{width: "200px"}} />
                                            </h3>
                                            <div className="text-center" style={{fontSize: 14, color: '#7C7C7C'}}>Dịch vụ tư vấn vận chuyển & kết nối thương mại</div>
                                            <div className="mt-2 text-center " style={{fontSize: 25, color :"#F37335", fontWeight: 500}}>Admin Login</div>
                                        </div>
                                        <div className="card-body">
                                            <form>
                                                <div className="form-group position-relative">
                                                    {/* <label className="form-label" htmlFor="inputEmailAddress">Số điện thoại</label> */}
                                                    <MdOutlinePhone className="position-absolute" style={{top: "50%", transform: "translate(0, -50%)"}} />
                                                    <input className="form-control py-3 cus-inp-txt pl-4" style={{border: "none", borderBottom: "1px solid #7C7C7C"}} id="inputEmailAddress" type="email" placeholder="Số điện thoại" name="email" value={email} onChange={handleChangeUser} />
                                                </div>
                                                <div className="form-group position-relative">
                                                    {/* <label className="form-label" htmlFor="inputPassword">Password*</label> */}
                                                    <CiLock className="position-absolute" style={{top: "50%", transform: "translate(0, -50%)"}} />
                                                    <input className="form-control cus-inp-txt py-3 pl-4" id="inputPassword" type="password" placeholder="Mật khẩu" name="password" value={password} onChange={handleChangeUser} />
                                                </div>
                                                <div className="form-group">
                                                    <div className="custom-control custom-checkbox">
                                                        <input
                                                            className="custom-control-input"
                                                            id="rememberPasswordCheck"
                                                            type="checkbox"
                                                            checked={rememberMe}
                                                            onChange={handleRememberMeChange}
                                                        />
                                                        <label className="custom-control-label" style={{fontSize: 14}} htmlFor="rememberPasswordCheck">
                                                            Nhớ mật khẩu
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="form-group d-flex align-items-center justify-content-between mt-4 mb-0" onClick={handleSubmit}>
                                                    <a className="btn btn-sign hover-btn">Login</a>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Signin;
