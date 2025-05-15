    import { Button, Form, Modal, Spinner } from "react-bootstrap";
    import { Link, useNavigate } from "react-router-dom";
    import ComeBack from "../Components/ComeBack";
    import { useState } from "react";
    import axios from "axios";
    import Swal from "sweetalert2";
    import { ip } from "../api/Api";

    const Login = () => {
        const [email, setEmail] = useState("")
        const [password, setPassword] = useState("")
        const [loading, setLoading] = useState(false);
        const [errorMessage, setErrorMessage] = useState("");
        const navigate = useNavigate();
        const [editModalShow, setEditModalShow] = useState(false);
        const [forgotEmail, setForgotEmail] = useState("");


        function handleSubmit(e) {
            e.preventDefault();
            setLoading(true);
            setErrorMessage(""); // Xóa lỗi trước đó

            axios
                .post("http://localhost:8080/api/auth/signin", {
                    email: email,
                    password: password,
                })
                .then((result) => {
                    console.log("Kết quả API:", result.data); // Debug API Response

                    if (result.data.accessToken) {
                        localStorage.setItem("token", result.data.accessToken); // Lưu token chính xác
                        localStorage.setItem("user", JSON.stringify(result.data)); // Lưu token chính xác

                        Swal.fire({
                            icon: "success",
                            title: "Đăng nhập thành công!",
                            confirmButtonText: "OK",
                        }).then(() => {
                            navigate("/"); // Chuyển hướng trang
                            window.location.reload();
                        });
                        console.log(result.data.accessToken);
                    } else {
                        setErrorMessage("Không tìm thấy token. Vui lòng thử lại!");
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    if (err.response) {
                        console.error("Lỗi API:", err.response.data); // Debug lỗi API
                        if (err.response.status === 400 || err.response.status === 422) {
                            setErrorMessage("Email hoặc mật khẩu không chính xác.");
                        } else {
                            setErrorMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
                        }
                    } else {
                        setErrorMessage("Không thể kết nối đến máy chủ. Kiểm tra kết nối mạng.");
                    }
                });
        }
        function handleChange(e) {
            if (e.target.name === "email") setEmail(e.target.value);
            if (e.target.name === "password") setPassword(e.target.value);

        }
        const closeEditModal = () => {
            setEditModalShow(false);

        };
        const openEditModal = () => {
            setEditModalShow(true);
        };
        


        return (
            <>
                <ComeBack />
                <Form className="mt-5 Login" onSubmit={handleSubmit}>
                    <div className="content-login">
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img
                                className="img-header"
                                src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/logo.png?1719291840576"
                                style={{ width: "200px", marginBottom: "10px" }}
                                alt="Logo"
                            />
                        </div>

                        <h4 className="text-center">Đăng nhập</h4>
                        {/* Hiển thị thông báo lỗi nếu có */}
                        {errorMessage && (
                            <div className="alert alert-danger text-center">
                                {errorMessage}
                            </div>
                        )}
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" placeholder="Email..." onChange={handleChange} />

                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Mật khẩu</Form.Label>
                            <Form.Control type="password" name="password" placeholder="Mật khẩu..." onChange={handleChange} />
                        </Form.Group>
                        <Link className="forgot text-primary" >Quên mật khẩu?</Link>
                        <Link to="/register" className="register text-primary">Đăng kí tại đây</Link>

                    </div>
                    <div className="button p-3">
                        <Button className="signin form-control" type="submit">
                            {loading ? (
                                <div className="align-middle">
                                    <Spinner
                                        as="span"
                                        animation="grow"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    <span>Đăng nhập...</span>
                                </div>
                            ) : (
                                <span>Đăng nhập</span>
                            )}
                        </Button>
                    
                        

                    </div>

                </Form>
                {/* Modal ra ngoài Form chính */}
                
            </>



        );
    }
    export default Login;