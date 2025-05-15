import React from 'react'
import { Button, Form, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
const CreateUser = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // Lưu thông báo lỗi từ server
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(""); // Xóa thông báo lỗi trước đó
        if (!name) {
            setErrorMessage("Bạn phải nhập tên.");
            setLoading(false);
            return;
        }
        if (!email) {
            setErrorMessage("Bạn phải nhập email.");
            setLoading(false);
            return;
        }
        if (!password) {
            setErrorMessage("Bạn phải nhập mật khẩu.");
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            setErrorMessage("Mật khẩu phải dài ít nhất 6 ký tự.");
            setLoading(false);
            return;
        }

        axios
            .post("http://localhost:8080/api/auth/signup", {
                username: name,
                email: email,
                password: password,
            })
            .then((result) => {
                //localStorage.setItem("token", result.data.token);
                Swal.fire({
                    toast: true,
                    icon: 'success',
                    position: "top-end",
                    icon: 'success',
                    title: 'Thêm thành công !',
                    timer: 2000,
                    timerProgressBar: true
                });

                setLoading(false);
                //navigate('/admin/user');
            })
            .catch((err) => {
                setLoading(false);
                // Kiểm tra lỗi từ server
                if (err.response && err.response.status === 422) {

                } else {
                    setErrorMessage("Email này đã tồn tại. Vui lòng sử dụng email khác.");
                }
            });
    }

    function handleChange(e) {
        if (e.target.name === "name") setName(e.target.value);
        if (e.target.name === "email") setEmail(e.target.value);
        if (e.target.name === "password") setPassword(e.target.value);
    }
    return (
        <>

            <Form className="mt-5  auth" onSubmit={handleSubmit}>
                <div className="content-login">

                    <h4 className="text-center">Thêm Người dùng</h4>


                    {/* Hiển thị thông báo lỗi nếu có */}
                    {errorMessage && (
                        <div className="alert alert-danger text-center">
                            {errorMessage}
                        </div>
                    )}

                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Tên</Form.Label>
                        <Form.Control type="name" name="name" placeholder="Tên..." onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" placeholder="Email..." onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Mật khẩu</Form.Label>
                        <Form.Control type="password" name="password" placeholder="Mật khẩu..." onChange={handleChange} />
                    </Form.Group>

                </div>
                <div className="button p-3">
                    <Button className="signin form-control" type="submit" style={{ width: "150px" }} disabled={loading}>
                        {loading ? (
                            <div className="align-middle">
                                <Spinner
                                    as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                <span>Lưu...</span>
                            </div>
                        ) : (
                            <span>Lưu</span>
                        )}
                    </Button>
                </div>
            </Form>
        </>
    )
}

export default CreateUser