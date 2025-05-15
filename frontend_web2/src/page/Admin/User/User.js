import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import Swal from "sweetalert2";
import { ip } from "../../../api/Api";


const User = () => {
    const [users, setUsers] = useState([]);
    const [editModalShow, setEditModalShow] = useState(false);
    const [editUser, setEditUser] = useState({ id: "", username: "", email: "", password: "" });

    const getUser = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`http://localhost:8080/api/auth/users`, {

                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const user = response.data;

            setUsers(user)
        } catch (error) {
            console.error("Error ", error);
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    const deleteUser = async (id) => {
        const isConfirm = await Swal.fire({
            title: "Bạn có chắc không?",
            text: "Bạn sẽ không thể hoàn nguyên điều này!",
            icon: "Cảnh báo",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, xóa nó!",
        });

        if (!isConfirm.isConfirmed) {
            return;
        }
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        try {
            await axios.delete(`http://localhost:8080/api/auth/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire({
                toast: true,
                icon: 'success',
                position: "top-end",
                icon: 'success',
                title: 'Xóa thành công!',
            }).then(() => {
                getUser();
            });
        } catch (error) {
            console.error("Lỗi khi xóa", error);
            Swal.fire({
                text: "Lỗi khi xóa",
                icon: "error",
            });
        }
    };
    const openEditModal = async (id) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`http://localhost:8080/api/auth/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            //console.log("User Data:", response.data);
            setEditUser(response.data);
            setEditModalShow(true);
        } catch (error) {
            console.error("Error fetching user for edit", error);
            Swal.fire({ text: "Failed to fetch user for edit", icon: "error" });
        }
    };

    const handleUpdateUser = async () => {
        const token = localStorage.getItem("token");

        if (!editUser.id) {
            Swal.fire({ text: "User ID is required", icon: "error" });
            return;
        }

        try {
            // Tạo dữ liệu dạng form-url-encoded
            const formData = new URLSearchParams();

            if (editUser.username) formData.append("username", editUser.username);
            if (editUser.email) formData.append("email", editUser.email);
            if (editUser.password) formData.append("password", editUser.password);

            await axios.put(
                `http://localhost:8080/api/auth/users/${editUser.id}`,
                formData, // Gửi dưới dạng x-www-form-urlencoded
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );

            Swal.fire({
                toast: true,
                icon: 'success',
                position: "top-end",
                icon: 'success',
                title: 'Cập nhật thành công!',
            });
            await getUser();
            setEditModalShow(false);

        } catch (error) {
            console.error("Error updating user", error);
            Swal.fire({ text: "Failed to update user", icon: "error" });
        }
    };

    const closeEditModal = () => {
        setEditModalShow(false);

    };



    return (
        <div >


            <div className="container-fluid">
                <div className="card shadow mb-4">
                    <div className="card-header py-3 d-flex justify-content-between align-items-center">
                        <h6 className="m-0 font-weight-bold text-primary">Tất cả người dùng</h6>
                        <Link to={'/admin/UsersCreate'} className="btn btn-success my-2 me-2 ">Thêm người dùng</Link>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered" id="dataTable" cellSpacing="0" width="100%">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Tên</th>
                                        <th>Email</th>
                                        <th>Mật khẩu</th>

                                        <th style={{ width: "150px" }}>Chức năng</th>
                                    </tr>
                                </thead>
                                <tbody style={{ textAlign: "center" }}>
                                    {users && users.length > 0 ? ( // Kiểm tra nếu users tồn tại và có ít nhất 1 người dùng
                                        users.map((user) => ( // Sử dụng map để lặp qua từng người dùng
                                            <tr key={user.id}> {/* Sử dụng user.id làm key cho từng dòng */}
                                                <td>{user.id}</td>
                                                <td>{user.username}</td>
                                                <td>{user.email}</td>
                                                <td>{user.password ? "********" : ""}</td>



                                                <td>
                                                    <Button variant="success me-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" onClick={() => openEditModal(user.id)} width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                                        </svg>
                                                    </Button>
                                                    <Button variant="danger" onClick={() => deleteUser(user.id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                                        </svg>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5">Loading...</td> {/* Hiển thị thông báo loading trong một dòng */}
                                        </tr>
                                    )}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={editModalShow} onHide={() => setEditModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa người dùng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Tên</Form.Label>
                        <Form.Control
                            type="text"
                            value={editUser.username}
                            onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={editUser.email}
                            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Mật khẩu</Form.Label>
                        <Form.Control
                            type="password"
                            value={editUser.password }
                            onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setEditModalShow(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleUpdateUser}>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>


        </div>
    );
};

export default User;
