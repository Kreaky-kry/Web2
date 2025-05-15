import { useEffect, useState } from "react";
import "../../scss/Delivery.scss"
import { CiDeliveryTruck } from "react-icons/ci";
import { json, Link } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import numeral from "numeral";
import { ip } from "../../api/Api";



const TabAllDelivery = (props) => {
    const { show, products, handleClose, handleShow } = props
    const [orderuserid, setOrderuserid] = useState([]);
    const [product, setProduct] = useState({}); // Store product details
    const [loading, setLoading] = useState(false);
    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };




    const [error, setError] = useState(null);
    const getOrderByUserId = async () => {
        try {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));

            if (!user) {
                setError("Không tìm thấy thông tin người dùng.");
                return;
            }

            const response = await axios.get(`http://localhost:8080/api/orders/user/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Lọc ra các đơn hàng có status === "PENDING"
            const pendingOrders = response.data.filter(order => order.status === "PENDING");

            setOrderuserid(pendingOrders);
        } catch (error) {
            console.error("Lỗi khi gọi API đơn hàng:", error);
            setError("Không thể tải dữ liệu đơn hàng.");
        }
    };

    useEffect(() => {

        getOrderByUserId();
    }, []);

    const fetchProductDetails = async (productId) => {
        if (!productId) return; // Nếu productId không tồn tại, không gọi API

        if (!products[productId]) { // Chỉ fetch nếu sản phẩm chưa có
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8080/api/product/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProduct(prevProducts => ({
                    ...prevProducts,
                    [productId]: response.data
                }));
            } catch (error) {
                console.error("Lỗi khi gọi API sản phẩm:", error);
            }
        }
    };


    useEffect(() => {
        if (orderuserid.length > 0) {
            orderuserid.forEach(order => {
                order.orderItems.forEach(item => {
                    if (item.productId) { // Chỉ gọi API nếu productId tồn tại
                        fetchProductDetails(item.productId);
                    } else {
                        console.warn("Không tìm thấy productId cho orderItem:", item);
                    }
                });
            });
        }
    }, [orderuserid]);

    const Canceled = async (id) => {
        try {
            setLoading(true); // Bật trạng thái loading
            await axios.put(`http://localhost:8080/api/orders/${id}/status`, null, {
                params: { status: "CANCELED" }
            });

            Swal.fire({
                toast: true,
                icon: 'success',
                position: "top-end",
                title: 'Hủy đơn hàng thành công',
                confirmButtonText: 'OK'
            });

            // Gọi lại API để lấy danh sách đơn hàng mới
            getOrderByUserId();
        } catch (error) {
            console.error("Lỗi khi hủy đơn hàng", error);
        } finally {
            setLoading(false); // Tắt loading sau khi hoàn thành
        }
    };


    if (loading) {
        return (
            <div style={{
                textAlign: "center",
                padding: "50px",
                fontSize: "18px",
                fontWeight: "bold",
                color: "#503eb6",
                height: "500px"

            }
            }>
            </div >
        );
    }

    return (
        <>
            <div className="font-sans mb-3">
                <div className="bg-gray-100 mt-3">
                    <input type="text" placeholder="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm" className="w-full p-2 border border-gray-300 rounded form-control" />
                </div>
                <div>

                    {orderuserid.length > 0 ? (

                        orderuserid.map((order, orderIndex) => (
                            <div className="bg-white p-4 mt-2 shadow-sm rounded" key={`order-${orderIndex}`}>
                                {/* Tiêu đề đơn hàng */}
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="text-danger fw-bold fs-5">Đơn hàng thứ {orderIndex + 1}</p>
                                    <div className="d-flex align-items-center">
                                        <CiDeliveryTruck className="text-success fs-4" />
                                        <span className="ms-2 me-2 border-end text-success">Giao hàng nhanh |</span>
                                        <span className="text-danger fw-bold">Tiết kiệm</span>
                                    </div>
                                </div>
                                <hr />

                                {/* Danh sách sản phẩm */}
                                {order?.orderItems?.map((item, itemIndex) => {
                                    const product = item.product; // Đúng, lấy trực tiếp từ API trả về
                                    return (
                                        <div className="d-flex align-items-center my-3" key={`item-${itemIndex}`}>
                                            {product ? (
                                                <>
                                                    <img
                                                        src={`data:${product.imageType};base64,${product.imageDate}`}
                                                        alt={product.name}
                                                        className="rounded"
                                                        style={{ width: '70px', height: '70px', marginRight: '10px' }}
                                                    />
                                                    <div className="ms-3">
                                                        <p className="fw-bold mb-1">{product.name}</p>
                                                        <p className="mb-1">Số lượng: {item.quantity}</p>
                                                        <p className="mb-1">Giá: {product.price.toLocaleString()} VND</p>
                                                        <span className="text-success">Trả hàng miễn phí 15 ngày</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <p>Đang tải sản phẩm...</p>
                                            )}
                                        </div>
                                    );
                                })}

                                <hr />

                                {/* Tổng tiền */}
                                <div className="d-flex justify-content-end mb-3">
                                    <span>Thành tiền: <b className="text-primary">{order?.totalPrice?.toLocaleString()} VND</b></span>
                                </div>

                                {/* Thông tin đánh giá và trạng thái đơn hàng */}
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="danh-gia">
                                        Đánh giá sản phẩm trước <span className="text-danger">22-05-2025</span>
                                        <br />
                                        <span className="text-danger">Đánh giá ngay và nhận 200 Xu</span>
                                    </div>
                                    <div>
                                        {order?.status === "PENDING" ? (
                                            <button className="btn btn-danger me-2 btnHuyDon" onClick={() => Canceled(order.id)}>Hủy đơn hàng</button>
                                        ) : (
                                            <span className="text-muted">Đã hủy</span>
                                        )}
                                    </div>
                                </div>

                            </div>
                        ))


                    ) : (
                        <div className="no-products">
                            <div className="bg-img"></div>
                        </div>
                    )}

                </div>
            </div>


        </>

    )
}

export default TabAllDelivery;