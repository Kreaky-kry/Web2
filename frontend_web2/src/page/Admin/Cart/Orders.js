import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { ip } from "../../../api/Api";


const Order = () => {

    const [orders, setOrders] = useState([]);
    const [abate, setAbate] = useState([]);
    const [detailModalShow, setDetailModalShow] = useState(false);
    const [error, setError] = useState(null);
    const [loadingId, setLoadingId] = useState(null);
    const [deletingProductId, setDeletingProductId] = useState(null);

    // const formatCurrency = (value) => value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    //xác nhận đơn hàng
    const handleConfirm = async (id) => {
        setLoadingId(id); // Bật trạng thái loading cho nút

        try {
            await putOrdersStatus(id, "PAID"); // Truyền trạng thái mới

            // Cập nhật trạng thái đơn hàng trong danh sách `orders`
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === id ? { ...order, status: "PAID" } : order
                )
            );
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
        } finally {
            setLoadingId(null); // Tắt loading sau khi xong
        }
    };
    //xác nhận vận chuyển
    const handleDelivered = async (id) => {
        setLoadingId(id); // Bật trạng thái loading cho nút

        try {
            await putOrdersStatus(id, "DELIVERED"); // Truyền trạng thái mới

            // Cập nhật trạng thái đơn hàng trong danh sách `orders`
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === id ? { ...order, status: "DELIVERED" } : order
                )
            );
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
        } finally {
            setLoadingId(null); // Tắt loading sau khi xong
        }
    };

    const getOrders = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/orders`)
            const ords = response.data;
            setOrders(ords);
        } catch (error) {
            console.log("Lỗi khi gọi giỏ hàng", error)
        }
    }

    const putOrdersStatus = async (id, status) => {
        try {
            const response = await axios.put(
                `http://localhost:8080/api/orders/${id}/status`,
                null, // Không cần body
                { params: { status } } // Gửi status qua query params
            );

            console.log("Cập nhật trạng thái thành công:", response.data);

            if (response.status === 200) {
                return response.data; // Trả về dữ liệu từ server
            } else {
                console.error("Cập nhật thất bại, status code:", response.status);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error.response?.data || error.message);
        }
    };


    const deleteAbates = async (id) => {
        const isConfirm = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (!isConfirm.isConfirmed) {
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/api/orders/${id}`);
            Swal.fire({
                icon: "success",
                title: "Deleted!",
            }).then(() => {
                getOrders();
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.response?.data?.message || "Something went wrong!",
            });
        }
    }

    useEffect(() => {
        getOrders();
    }, [])


    //chi tiết
    const openDetailModal = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user'));
            console.log(id)
            if (!user) {
                setError("Không tìm thấy thông tin người dùng.");
                return;
            }

            const response = await axios.get(`http://localhost:8080/api/orders/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // console.log(response.data);
            setAbate(response.data);
            setDetailModalShow(true);
        } catch (error) {
            console.error("Lỗi khi gọi API đơn hàng:", error);
            setError("Không thể tải dữ liệu đơn hàng.");
        }
    };
    useEffect(() => {


        openDetailModal();
    }, []);

    const closeDetailModal = () => {
        setDetailModalShow(false);
        setAbate([]);
    }


    return (
        <div >


            <div className="container-fluid">
                <div className="card shadow mb-4">
                    <div className="card-header py-3 d-flex justify-content-between align-items-center">
                        <h6 className="m-0 font-weight-bold text-primary">Thanh toán</h6>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered" id="dataTable" cellSpacing="0" width="100%">
                                <thead>
                                    <tr>
                                        <th>id</th>
                                        <th>user_id</th>
                                        <th>Tên người nhận</th>
                                        <th>Tổng tiền</th>
                                        <th>Tỉnh/Thành phố</th>
                                        <th>Huyện/Quận</th>
                                        <th>Xã/Phường</th>
                                        <th>Địa chỉ</th>
                                        <th>Actions</th>
                                        <th>Trạng thái đơn hàng</th>
                                    </tr>
                                </thead>
                                <tbody style={{ textAlign: "center" }}>
                                    {
                                        orders && orders.length > 0 ? (

                                            orders.map((aba) => (
                                                <tr key={aba.id} >
                                                    <td>{aba.id}</td>
                                                    <td>{aba.user.id}</td>
                                                    <td>{aba.user.username}</td>
                                                    <td>{aba.totalPrice.toLocaleString()}</td>
                                                    <td>{aba.shippingAddress.province}</td>
                                                    <td>{aba.shippingAddress.district}</td>
                                                    <td>{aba.shippingAddress.ward}</td>
                                                    <td>{aba.shippingAddress.street}</td>

                                                    <td style={{ textAlign: "center" }}>
                                                        {/* <Button variant="success me-2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                                            </svg>
                                                        </Button> */}
                                                        <Button variant="success me-2 btn btn-warning" onClick={() => openDetailModal(aba.id)} >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                                            </svg>
                                                        </Button>
                                                        <Button variant="danger">
                                                            <svg xmlns="http://www.w3.org/2000/svg" onClick={() => deleteAbates(aba.id)} width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                                            </svg>
                                                        </Button>
                                                    </td>
                                                    <td>
                                                        {aba.status === "PENDING" ? (
                                                            <Button
                                                                onClick={() => handleConfirm(aba.id)}
                                                                variant="success"
                                                                disabled={loadingId === aba.id} // Vô hiệu hóa khi đang loading
                                                            >
                                                                {loadingId === aba.id ? (
                                                                    <>
                                                                        <Spinner
                                                                            as="span"
                                                                            animation="border"
                                                                            size="sm"
                                                                            role="status"
                                                                            aria-hidden="true"
                                                                        />{" "}
                                                                        Đang xác nhận...
                                                                    </>
                                                                ) : (
                                                                    "Xác nhận"
                                                                )}
                                                            </Button>
                                                        ) : aba.status === "CANCELED" ? (
                                                            <span style={{ color: "red", fontWeight: "bold" }}>Đã hủy</span>
                                                        ) : aba.status === "PAID" ? (
                                                            <Button
                                                                onClick={() => handleDelivered(aba.id)}
                                                                variant="primary"
                                                                disabled={loadingId === aba.id} // Vô hiệu hóa khi đang loading
                                                            >
                                                                {loadingId === aba.id ? (
                                                                    <>
                                                                        <Spinner
                                                                            as="span"
                                                                            animation="border"
                                                                            size="sm"
                                                                            role="status"
                                                                            aria-hidden="true"
                                                                        />{" "}
                                                                        Đang xác nhận...
                                                                    </>
                                                                ) : (
                                                                    "Hoàn thành"
                                                                )}
                                                            </Button>
                                                        ) : (
                                                            <span style={{ color: "blue", fontWeight: "bold" }}>Đã hoàn thành</span>
                                                        )}
                                                    </td>

                                                </tr>

                                            ))

                                        ) : (
                                            <tr>
                                                <td colSpan="5">Loading...</td> {/* Hiển thị thông báo loading trong một dòng */}
                                            </tr>

                                        )
                                    }
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={detailModalShow} onHide={() => setDetailModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết đơn hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {abate ? (
                        <div>
                            {/* Thông tin khách hàng */}
                            <div><strong>Tên khách hàng:</strong> {abate.user?.username}</div>
                            <div><strong>Email:</strong> {abate.user?.email}</div>

                            {/* Thông tin đơn hàng */}
                            <div><strong>Phương thức thanh toán:</strong> {abate.paymentMethod}</div>
                            <div><strong>Trạng thái:</strong> {abate.status}</div>
                            <div><strong>Ngày đặt hàng:</strong> {new Date(abate.createdAt).toLocaleString()}</div>

                            {/* Danh sách sản phẩm */}
                            <div><strong>Sản phẩm đã đặt:</strong></div>
                            {abate.orderItems && abate.orderItems.length > 0 ? (
                                <ul>
                                    {abate.orderItems.map((item, index) => (
                                        <li key={item.id}>
                                            <div><strong>Tên sản phẩm:</strong> {item.product.name}</div>
                                            <div><strong>Số lượng:</strong> {item.quantity}</div>
                                            <div><strong>Giá:</strong> {item.product.price.toLocaleString()} VND</div>
                                            <div>
                                                <strong>Hình ảnh:</strong><br />
                                                <img
                                                    src={`data:${item.product.imageType};base64,${item.product.imageDate}`}
                                                    alt={item.product.name}
                                                    height="60"
                                                    width="60"
                                                    style={{ margin: '5px', borderRadius: '8px' }}
                                                />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Không có sản phẩm nào được đặt.</p>
                            )}
                            {/* Tổng tiền */}
                            <div><strong>Tổng tiền:</strong> {abate.totalPrice ? abate.totalPrice.toLocaleString() : "Đang cập nhật"} VND</div>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDetailModalShow(false)}>Đóng</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
export default Order;