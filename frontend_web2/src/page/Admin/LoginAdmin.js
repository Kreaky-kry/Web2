import axios from "axios";
import { useState } from "react";
import { Button, Spinner, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const LoginAdmin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        if (!email) {
            setErrorMessage("Vui lòng nhập email!");
            setLoading(false);
            return;
        }
        if (!password) {
            setErrorMessage("Vui lòng nhập mật khẩu!");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8080/api/auth/signin`, {
                email,
                password,
            });

            const userData = {
                id: response.data.id,
                username: response.data.username,
                email: response.data.email,
                roles: response.data.roles, // Lưu role
                accessToken: response.data.accessToken,
            };

            localStorage.setItem("user", JSON.stringify(userData)); // Lưu vào localStorage

            if (userData.roles.includes("ROLE_ADMIN")) {
                Swal.fire({
                    icon: "success",
                    title: "Đăng nhập thành công!",
                    confirmButtonText: "OK",
                }).then(() => {
                    navigate("/admin");
                    window.location.reload();
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Bạn không có quyền truy cập trang admin!",
                    confirmButtonText: "OK",
                }).then(() => {
                    navigate("/");
                });
            }
        } catch (err) {
            setLoading(false);
            if (err.response) {
                if (err.response.status === 422) {
                    setErrorMessage("Dữ liệu không hợp lệ. Vui lòng kiểm tra email và mật khẩu.");
                } else if (err.response.status === 400) {
                    setErrorMessage("Email hoặc mật khẩu không đúng.");
                } else {
                    setErrorMessage("Có lỗi xảy ra. Vui lòng thử lại!");
                }
            } else {
                setErrorMessage("Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.");
            }
        }
    };

    return (
        <Form onSubmit={handleSubmit} style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
            <div className="form-control" style={{ width: "300px", height: "100%" }}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px", marginBottom: "10px" }}>
                    <img
                        className="img-header"
                        src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/logo.png?1719291840576"
                        style={{ width: "200px", marginBottom: "10px" }}
                        alt="Logo"
                    />
                </div>
                {errorMessage && <div className="alert alert-danger text-center">{errorMessage}</div>}
                <div>
                    <label>Nhập email</label>
                    <input className="form-control mb-3" type="email" name="email" placeholder="Nhập email..." onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Nhập mật khẩu</label>
                    <input className="form-control" type="password" name="password" placeholder="Nhập mật khẩu..." onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Link className="forgot">Quên mật khẩu</Link>
                <div className="button p-3">
                    <Button className="signin form-control" type="submit" disabled={loading}>
                        {loading ? (
                            <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                        ) : (
                            "Đăng nhập"
                        )}
                    </Button>
                </div>
            </div>
        </Form>
    );
};

export default LoginAdmin;
