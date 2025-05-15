import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import Swal from "sweetalert2";
import { ip } from "../../../api/Api";

const Category = () => {
    const { id } = useParams();
    const [brands, setBrands] = useState([]);
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const [editModalShow, setEditModalShow] = useState(false);
    const [editcategoryId, setEditcategoryId] = useState(null);
    const [editcategoryName, setEditCategoryName] = useState("");
    const [success, setSuccess] = useState(false);
    const [file, setFile] = useState(null); // State lưu tệp được chọn
    const [message, setMessage] = useState(""); // State để lưu thông báo
    const changeHandler = (event) => {
        const { name, value } = event.target;
        if (name === "name") setName(value);
    };

    const submitCategory = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8080/api/categories`, { name });
            Swal.fire({
                toast: true,
                icon: 'success',
                position: "top-end",
                title: 'Thêm thành công!',
                text: response.data.message,
                timer: 2000,
                timerProgressBar: true
            }).then(() => {
                fetchCategory();
                setName("");
            });
        } catch (error) {
            if (error.response.status === 422) {
                Swal.fire({
                    text: error.response.data.message,
                    icon: "error",
                });
            } else {
                console.error("Error creating category", error);
            }
        }
    };

    const deleteCategory = async (id) => {
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

        try {
            await axios.delete(`http://localhost:8080/api/categories/${id}`);
            Swal.fire({
                toast: true,
                icon: 'success',
                position: "top-end",
                text: "Xóa thành công.",
            }).then(() => {
                fetchCategory();
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
        try {
            const response = await axios.get(`http://localhost:8080/api/categories/${id}`);
            const brand = response.data;
            setEditcategoryId(brand.id);
            setEditCategoryName(brand.name);
            setEditModalShow(true);
        } catch (error) {
            console.error("Error fetching brand for edit", error);
            Swal.fire({
                text: "Failed to fetch brand for edit",
                icon: "error",
            });
        }
    };

    const closeEditModal = () => {
        setEditModalShow(false);
        setEditcategoryId(null);
        setEditCategoryName("");
    };

    const handleEditCategory = async () => {
        try {
            const response = await axios.put(`http://localhost:8080/api/categories/${editcategoryId}`, { name: editcategoryName });
            Swal.fire({
                toast: true,
                icon: 'success',
                position: "top-end",
                title: "Sửa thành công!",
                text: response.data.message,
                timer: 2000,
                timerProgressBar: true
            });
            fetchCategory();
            setEditModalShow(false);
        } catch (error) {
            console.error("Failed to update category", error);
            Swal.fire({
                text: "Failed to update category",
                icon: "error",
            });
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    const fetchCategory = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/categories`);
            const sortedCategories = (response.data || []).sort((a, b) => a.id - b.id);
            setBrands(sortedCategories);
        } catch (error) {
            console.error("Error fetching categories", error);
            setBrands([]);
        }
    };
    // Hàm xử lý khi chọn tệp
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);  // Lưu tệp vào state
    };
    // Hàm xử lý khi submit form (gửi tệp lên server)
    const handleImport = async (event) => {
        event.preventDefault();

        if (!file) {
            setMessage("Vui lòng chọn một tệp để upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);  // Thêm tệp vào FormData

        try {
            const response = await axios.post("http://localhost:8080/api/categories/import", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",  // Đảm bảo rằng header là multipart/form-data
                },
            });

            // Kiểm tra nếu response có dữ liệu
            if (response && response.data) {
                Swal.fire({
                    toast: true,
                    icon: 'success',
                    position: "top-end",
                    title: "Import File Excel thành công!",
                    text: response.data.message,
                });
                fetchCategory();
                setMessage(response.data);
            } else {
                setMessage("Dữ liệu không hợp lệ.");
            }
        } catch (error) {
            // Kiểm tra lỗi từ server
            if (error.response && error.response.data) {
                setMessage("Import thất bại: " + error.response.data);
            } else {
                setMessage("Có lỗi xảy ra trong quá trình import.");
            }
        }
    };
    const handleExport = async () => {
        try {
            // Gửi yêu cầu tới API backend để xuất dữ liệu (Excel hoặc CSV)
            const response = await axios.get("http://localhost:8080/api/categories/export?type=xlsx", {
                responseType: 'arraybuffer',  // Quan trọng để nhận dữ liệu nhị phân
            });

            // Lấy tên file và dữ liệu từ phản hồi
            const filename = "categories.xlsx";
            const contentType = "text/xlsx";

            // Tạo blob từ dữ liệu nhận được và tải file xuống
            const blob = new Blob([response.data], { type: contentType });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click(); // Mô phỏng click để tải file về
        } catch (error) {
            console.error("Lỗi khi xuất dữ liệu:", error);
            Swal.fire({
                text: "Lỗi khi xuất dữ liệu.",
                icon: "error",
            });
        }
    };

    return (
        <div className="row">
            <div className="col-4"  >
                <form onSubmit={submitCategory}>
                    <div className="container-fluid card shadow my-2 mx-2">
                        <div>
                            <h3 className="text-success text-center">Thêm Danh mục</h3>
                        </div>
                        <div className="mb-3 mt-3">
                            <label htmlFor="name" className="form-label">Danh mục</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                placeholder="Nhập tên Danh mục"
                                value={name}
                                onChange={changeHandler}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary mb-2">Lưu</button>
                    </div>
                </form>
            </div>
            <div className="col-8">
                <div className="container-fluid">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3 d-flex justify-content-between align-items-center">
                            <h6 className="m-0 font-weight-bold text-primary">Tất cả Danh mục</h6>
                            <div className="row">
                                <div className="col-12 text-end">
                                    <form onSubmit={handleImport} >
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept=".xlsx,.xls,.csv"
                                        />
                                        <Button type="submit" variant="success">Import file Excel</Button>
                                    </form>
                                </div>
                                <div className="col-12 text-end mt-2">
                                    <Button variant="success" onClick={handleExport}>
                                        Export file Excel
                                    </Button>
                                </div>
                            </div>

                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered" id="dataTable" cellSpacing="0" width="100%">
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Danh mục</th>
                                            <th style={{ width: "150px" }}>Chức năng</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ textAlign: "center" }}>
                                        {brands.map((brand) => (
                                            <tr key={brand.id}>
                                                <td>{brand.id}</td>
                                                <td>{brand.name}</td>
                                                <td>
                                                    <Button variant="success me-2" onClick={() => openEditModal(brand.id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                                        </svg>
                                                    </Button>
                                                    <Button variant="danger" onClick={() => deleteCategory(brand.id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                                        </svg>
                                                    </Button>
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
            <Modal show={editModalShow} onHide={closeEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa Danh mục</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="editName" className="form-label">Tên danh mục</label>
                        <input
                            type="text"
                            className="form-control"
                            id="editName"
                            name="editName"
                            value={editcategoryName}
                            onChange={(e) => setEditCategoryName(e.target.value)}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeEditModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleEditCategory}>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Category;
