import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "../../scss/Pay.scss"
import { SiCashapp } from "react-icons/si";
import { Button, Table, Form, Modal } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import confetti from 'canvas-confetti';
import { Spinner } from 'react-bootstrap';
import { ip } from "../../api/Api";


const Pay = () => {


    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    //const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);


    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    const [editModalShow, setEditModalShow] = useState(false);
    const [isLocationSelected, setIsLocationSelected] = useState(false); // Trạng thái chọn địa phương
    const location = useLocation();
    const { selectedItems, totalAmount } = location.state || { selectedItems: [], totalAmount: 0 };
    const [totalMoney, setTotalMoney] = useState(totalAmount);
    const [selectedPay, setSelectedPay] = useState(""); //xử lý chọn phương thức thanh toán.



    //abate
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [products, setProducts] = useState([]);
    const [province, setProvince] = useState([]);
    const [district, setDistrict] = useState([]);
    const [ward, setWard] = useState([]);
    //const [commune, setCommune] = useState([]);
    const [address, setAddress] = useState("");
    //const [totalAmount, setTotalAmount] = useState(0);
    const fee = 40000; // Đặt phí cố định

    const paymentMethods = [
        { label: "Thanh toán khi nhận hàng", value: "COD" },
        { label: "Chuyển khoản ngân hàng", value: "BANK_TRANSFER" },
        { label: "Thẻ tín dụng", value: "CREDIT_CARD" },
        { label: "Thanh toán qua PayPal", value: "PAYPAL" },
    ];
    const handleSelect = (value) => {
        setSelectedPay(value); // Cập nhật state với phương thức thanh toán
    };

    // Style cho overlay
    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Màu nền mờ
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000 // Đảm bảo nó nằm trên cùng
    };

    function handleChange(e) {
        const { name, value } = e.target;

        switch (name) {
            case "name":
                setName(value);
                break;
            case "phone":
                setPhone(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "totalMoney":
                setTotalMoney(value);
                break;
            case "provinces":
                setProvince(value);
                break;
            case "district":
                setDistrict(value);
                break;
            case "wards":
                setWard(value);
                break;
            case "address":
                setAddress(value);
                break;
            default:
                break;
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
    
        if (!email || !name || !phone || !selectedProvince || !selectedDistrict || !selectedWard || !address) {
            setErrorMessage("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
    
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem("user"));
    
        // Tạo danh sách orderItems
        const orderItems = selectedItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price * item.quantity,
        }));
    
        const orderData = {
            userId: user.id,
            totalPrice: totalMoney,
            status: "PENDING",
            paymentMethod: selectedPay,
            orderItems: orderItems,
            address: {
                province: province,
                district: district,
                ward: ward,
                street: address
            }
        };
    
        try {
            // Tạo đơn hàng
            await axios.post(`http://localhost:8080/api/orders/add`, orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            // 🔥 Trừ tồn kho sau khi tạo đơn hàng thành công
            await Promise.all(orderItems.map(item =>
                axios.patch(`http://localhost:8080/api/product/${item.productId}/stock?quantity=${item.quantity}`, null, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ));
    
            // Xóa sản phẩm khỏi giỏ nếu có
            const cartItemIds = selectedItems
                .filter(item => item.fromCart)
                .map(item => item.cartItemId);
    
            if (cartItemIds.length > 0) {
                await Promise.all(
                    cartItemIds.map(cartItemId =>
                        axios.delete(`http://localhost:8080/api/cart/remove?cartItemId=${cartItemId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                    )
                );
                console.log('Các sản phẩm đã được xóa khỏi giỏ hàng');
            }
    
            Swal.fire({
                icon: 'success',
                title: 'Đặt hàng thành công',
                text: 'Bạn muốn làm gì tiếp theo?',
                showCancelButton: true,
                confirmButtonText: 'Tiếp tục mua hàng',
                cancelButtonText: 'Về trang chủ',
                backdrop: 'rgba(0, 0, 0, 0.5)'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/tat-ca-san-pham");
                } else {
                    navigate("/");
                }
            });
    
        } catch (err) {
            console.error("Lỗi khi đặt hàng hoặc trừ kho:", err);
            setErrorMessage("Lỗi khi đặt hàng hoặc trừ kho. Vui lòng thử lại.");
        }
    }
    

    const closeEditModal = () => {
        setEditModalShow(false);

    };
    // 🟢 Hàm tính tổng tiền của từng sản phẩm
    const calculateItemTotal = (item) => {
        const price = item.price ? parseFloat(item.price) : 0;
        const quantity = item.quantity ? parseInt(item.quantity) : 0;
        return price * quantity;
    };

    // 🟢 Hàm tính tổng tiền toàn bộ đơn hàng
    const calculateTotalAmount = () => {
        return selectedItems.reduce((acc, item) => acc + calculateItemTotal(item), 0);
    };

    // 🟢 useEffect để cập nhật tổng tiền khi selectedItems thay đổi
    useEffect(() => {
        const newTotal = calculateTotalAmount();
        setTotalMoney(newTotal + fee); // Cộng phí vận chuyển nếu có
    }, [selectedItems, fee]);


    const formatCurrency = (value) => {
        if (!value || isNaN(value)) return "0 VND"; // Nếu không có giá trị hợp lệ, trả về "0 VND"

        return parseFloat(value).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
    };

    useEffect(() => {
        // Lấy danh sách tỉnh thành
        const fetchProvinces = async () => {
            try {
                const response = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm');
                setProvinces(response.data.data);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };

        fetchProvinces();
    }, []);

    useEffect(() => {
        // Lấy danh sách quận huyện khi tỉnh thành được chọn
        if (selectedProvince) {
            const fetchDistricts = async () => {
                try {
                    const response = await axios.get(`https://esgoo.net/api-tinhthanh/2/${selectedProvince}.htm`);
                    setDistricts(response.data.data);

                } catch (error) {
                    console.error('Error fetching districts:', error);
                }
            };

            fetchDistricts();
        }
    }, [selectedProvince]);

    useEffect(() => {
        // Lấy danh sách phường xã khi quận huyện được chọn
        if (selectedDistrict) {
            const fetchWards = async () => {
                try {
                    const response = await axios.get(`https://esgoo.net/api-tinhthanh/3/${selectedDistrict}.htm`);
                    setWards(response.data.data);
                } catch (error) {
                    console.error('Error fetching wards:', error);
                }
            };

            fetchWards();
        }
    }, [selectedDistrict]);

    return (
        <>
            <Form className="abate" >
                <div className="Pay container">
                    {isLoading && (
                        <div style={overlayStyle}>
                            <Spinner animation="border" variant="light" /> {/* Loading spinner */}
                        </div>
                    )}
                    <div className=" row">
                        <div className="col-8">
                            <div className="main-header">
                                <img className="logo" style={{ width: "300px", paddingTop: "10px", display: "block", margin: "0 auto" }} src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/checkout_logo.png?1726452627090" />
                            </div>
                            {errorMessage && (
                                <div className="alert alert-danger text-center">
                                    {errorMessage}
                                </div>
                            )}
                            <div className="row">
                                <div className="col-6">
                                    <div className=" my-3">
                                        <b>Thông tin người nhận</b>
                                    </div>
                                    <div className="mb-3">
                                        <input type="email" name="email" className="form-control" onChange={handleChange}

                                            placeholder="Nhập email" />
                                    </div>
                                    <div className="mb-3">
                                        <input type="name" name="name" className="form-control" onChange={handleChange}

                                            placeholder="Nhập Họ Tên" />
                                    </div>
                                    <div className="mb-3">
                                        <input type="phone" name="phone" className="form-control" onChange={handleChange}

                                            placeholder="Số điện thoại" />
                                    </div>

                                    <div className="mb-3">
                                        <select
                                            className="form-control"
                                            value={selectedProvince}
                                            onChange={(e) => {
                                                const selectedId = e.target.value; // Lấy ID đã chọn
                                                setSelectedProvince(selectedId); // Cập nhật giá trị đã chọn
                                                // Tìm tên tỉnh tương ứng với ID đã chọn
                                                const selectedProvinceObj = provinces.find(prov => prov.id === selectedId);
                                                if (selectedProvinceObj) {
                                                    setProvince(selectedProvinceObj.name); // Lưu tên tỉnh
                                                } else {
                                                    setProvince(""); // Nếu không tìm thấy, đặt lại giá trị
                                                }
                                            }}
                                        >
                                            <option value="">Chọn Tỉnh, Thành phố</option>
                                            {provinces.map((province) => (
                                                <option key={province.id} value={province.id}>{province.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <select
                                            className="form-control"
                                            value={selectedDistrict}
                                            //onChange={(e) => setSelectedDistrict(e.target.value)}
                                            onChange={(e) => {
                                                const selectedId = e.target.value; // Lấy ID đã chọn
                                                setSelectedDistrict(selectedId); // Cập nhật giá trị đã chọn
                                                // Tìm tên tỉnh tương ứng với ID đã chọn
                                                const selectedDistrictObj = districts.find(prov => prov.id === selectedId);
                                                if (selectedDistrictObj) {
                                                    setDistrict(selectedDistrictObj.name); // Lưu tên tỉnh
                                                } else {
                                                    setDistrict(""); // Nếu không tìm thấy, đặt lại giá trị
                                                }
                                            }}
                                        >
                                            <option value="">Chọn Quận, Huyện</option>
                                            {districts.map((district) => (
                                                <option key={district.id} value={district.id}>{district.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <select
                                            className="form-control"
                                            value={selectedWard}
                                            onChange={(e) => {
                                                const selectedId = e.target.value; // Lấy ID đã chọn
                                                setSelectedWard(selectedId); // Cập nhật giá trị đã chọn
                                                // Tìm tên phường xã tương ứng với ID đã chọn
                                                const selectedWardObj = wards.find(ward => ward.id === selectedId);
                                                if (selectedWardObj) {
                                                    setWard(selectedWardObj.name); // Lưu tên phường/xã
                                                } else {
                                                    setWard(""); // Nếu không tìm thấy, đặt lại giá trị
                                                }
                                            }}
                                        >
                                            <option value="">Chọn Phường, Xã</option>
                                            {wards.map((ward) => (
                                                <option key={ward.id} value={ward.id}>{ward.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <textarea rows="4" name="address" onChange={handleChange} className="form-control" placeholder="Nhập địa chỉ cần giao..." />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className=" my-3">
                                        <b>Vận chuyển</b>
                                    </div>
                                    {/* {isShowComplete() ?
                                        ( */}
                                    <div className="ship-cod form-control">
                                        <div className="ship">
                                            <input type="radio" checked readOnly />
                                            Giao hàng tận nơi
                                        </div>
                                        <span className="cod">{formatCurrency(fee)}</span>
                                    </div>
                                    {/* )
                                        :
                                        (
                                            <span className="null form-control">Vui lòng nhập thông tin giao hàng</span>
                                        )
                                    } */}
                                    <div className=" my-3">
                                        <b>Thanh toán</b>
                                    </div>
                                    <div className="method form-control">

                                        {paymentMethods.map((method) => (
                                            <div key={method.value}>
                                                <input
                                                    className="custom-checkbox"
                                                    type="checkbox"
                                                    checked={selectedPay === method.value}
                                                    onChange={() => handleSelect(method.value)}
                                                />
                                                <span className="custom-checkbox-label">{method.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="col-4  " style={{ height: "730px", width: "400px", borderLeft: "3px solid lightgray" }} >
                            <div className="order container">

                                <div className="container">
                                    <p style={{ fontSize: "20px", fontWeight: "bold", marginTop: "10px", textAlign: "center" }}>Thông tin thanh toán</p>
                                    <div className="order-summary">
                                        <p>Sản phẩm đã chọn:</p>
                                        <hr />
                                        {selectedItems.length === 0 ? (
                                            <p>Không có sản phẩm nào được chọn.</p>
                                        ) : (

                                            <ul>
                                                {selectedItems.map((item, index) => (
                                                    <React.Fragment key={`${item.id}-${index}`}>

                                                        <li className="d-flex justify-content-between align-items-center">
                                                            <div className="d-flex align-items-center">
                                                                {/* Hiển thị hình ảnh sản phẩm */}
                                                                <img
                                                                    src={item.imageUrl}
                                                                    alt={item.name}
                                                                    style={{ width: '70px', height: '70px', marginRight: '10px' }}
                                                                />
                                                                <div>
                                                                    <span style={{ fontWeight: "bold", width: "200px" }}>{item.name}</span><br />
                                                                    <span style={{ fontWeight: "lighter", fontStyle: "italic" }}>
                                                                        Số lượng: {item.quantity}
                                                                    </span><br />
                                                                </div>
                                                            </div>
                                                            <span style={{ fontWeight: "lighter", fontStyle: "italic" }}>
                                                                {formatCurrency(item.price)}
                                                            </span>
                                                        </li>
                                                    </React.Fragment>
                                                ))}
                                            </ul>
                                        )}
                                        <hr />

                                        <div className="d-flex justify-content-between">
                                            <p>Tạm tính:</p>
                                            <strong style={{ fontWeight: "bold", fontStyle: "italic", fontSize: "16px" }}>
                                                {formatCurrency(selectedItems.reduce((acc, item) => acc + calculateItemTotal(item), 0))}
                                            </strong>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <p>Phí vận chuyển: </p>
                                            <strong style={{ fontWeight: "bold", fontStyle: "italic", fontSize: "16px" }}>
                                                {/* {isShowComplete() ?
                                                    ( */}
                                                <strong style={{ fontWeight: "bold", fontStyle: "italic", fontSize: "16px" }}>{formatCurrency(fee)}</strong>
                                                {/* )
                                                    :
                                                    (
                                                        <span>---</span>
                                                    )
                                                } */}
                                            </strong>
                                        </div>
                                        <hr />

                                        <div className="d-flex justify-content-between">
                                            <p>Tổng tiền:</p>
                                            <strong style={{ fontWeight: "bold", fontStyle: "italic", fontSize: "16px", color: "red" }}>
                                                {formatCurrency(totalMoney)} {/* Hiển thị tổng tiền */}
                                            </strong>
                                        </div>
                                        <button onClick={handleSubmit} className="form-control" style={{ marginTop: "10px", backgroundColor: "SlateBlue", color: "white" }}>Thanh toán bằng tiền mặt</button>

                                        <div>
                                            <form id="vnpayForm" action="http://127.0.0.1:8000/api/vnpay_payment" method="POST" >
                                                <input type="hidden" name="total" value={totalMoney} />
                                                <button className="form-control" style={{ marginTop: "10px", backgroundColor: "white", color: "SlateBlue", borderColor: "SlateBlue" }} name="redirect" >Thanh toán bằng VNPAY</button>
                                            </form>
                                        </div>
                                        <Modal show={editModalShow} onHide={closeEditModal}>
                                            <Modal.Header closeButton>
                                                <Modal.Title>Xác nhận thanh toán</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <div className="mb-3">
                                                    <label htmlFor="editName" className="form-label">Xác nhận thanh toán</label>

                                                </div>

                                            </Modal.Body>
                                            <Modal.Footer>
                                                <form action="http://127.0.0.1:8000/api/vnpay_payment" method="POST" name="redirect">
                                                    <input type="hidden" name="total" value={totalMoney} />
                                                    <button className="form-control" style={{ marginTop: "10px", backgroundColor: "SlateBlue", color: "white" }} name="redirect" >Xác nhận</button>
                                                </form>
                                            </Modal.Footer>
                                        </Modal>


                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </Form>

        </>
    );
}
export default Pay;