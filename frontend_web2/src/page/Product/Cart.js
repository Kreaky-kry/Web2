import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Toast } from 'react-bootstrap';
import ComeBack from "../../Components/ComeBack";
import { toast, ToastContainer } from 'react-toastify';

import numeral from 'numeral';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import "../../scss/Cart.scss";
import { ip } from '../../api/Api';
import Swal from 'sweetalert2';

const Cart = () => {
    const [cartitems, setCartItems] = useState([]);
    const [productPrices, setProductPrices] = useState({}); // Lưu giá sản phẩm
    const [loadingCart, setLoadingCart] = useState(true);
    const [loadingUser, setLoadingUser] = useState(true);
    const [user, setUser] = useState(null);

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const navigate = useNavigate();


    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };

    const fetchCartItems = async () => {
        try {
            const token = localStorage.getItem("token"); // Lấy token từ localStorage
            const user = JSON.parse(localStorage.getItem("user")); // Lấy user từ localStorage

            if (!user || !user.id) {
                console.log("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!");
                return;
            }

            const response = await axios.get(`http://localhost:8080/api/cart/user/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }, // Gửi token để xác thực
            });

            const cartItems = response.data.cartItems;
            // console.log("Dữ liệu giỏ hàng:", cartItems);
            if (!cartItems || cartItems.length === 0) {
                setCartItems([]);
                return;
            }

            const updatedCartItems = cartItems.map((item) => ({
                id: item.id,
                quantity: item.quantity,
                product: {
                    id: item.product.id,
                    name: item.product.name,
                    description: item.product.description,
                    brand: item.product.brand,
                    category: item.product.category,
                    price: item.product.price,
                    stockQuantity: item.product.stockQuantity,
                    releaseDate: item.product.releaseDate,
                    productAvailable: item.product.productAvailable,
                    image: `data:${item.product.imageType};base64,${item.product.imageDate}`,
                },
            }));
            //console.log(updatedCartItems)
            setCartItems(updatedCartItems);
            fetchImagesAndUpdateCart(updatedCartItems);
        } catch (error) {
            console.error("Lỗi khi lấy giỏ hàng:", error);
            // toast.error("Có lỗi xảy ra khi lấy giỏ hàng");
        } finally {
            setLoadingCart(false);
        }
    };
    // Hàm fetch ảnh cho 1 sản phẩm
    const fetchImagesAndUpdateCart = async (cartItems) => {
        try {
            const updatedItems = await Promise.all(
                cartItems.map(async (item) => {
                    //console.log(item.product.id)

                    try {
                        const response = await axios.get(
                            `http://localhost:8080/api/product/${item.product.id}/image`,
                            { responseType: "blob" }
                        );
                        const imageUrl = URL.createObjectURL(response.data);
                        return { ...item, product: { ...item.product, imageUrl } };
                    } catch (error) {
                        console.error("Lỗi tải ảnh sản phẩm ID:", item.product.id, error);
                        return { ...item, product: { ...item.product, imageUrl: "/images/default-placeholder.jpg" } };
                    }
                })
            );

            setCartItems(updatedItems);
        } catch (error) {
            console.error("Lỗi khi cập nhật ảnh cho giỏ hàng:", error);
        }
    };






    const checkUserLogin = () => {
        const token = localStorage.getItem("token");
        if (token) {
            getUserData(token);
        } else {
            setUser(null);
            setLoadingUser(false);
        }
    };

    // Hàm lấy thông tin người dùng từ API
    const getUserData = async () => {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage

        if (!token) {
            console.log("Không có token, yêu cầu đăng nhập!");
            setUser(null);
            return;
        }

        try {
            const response = await axios.get("http://localhost:8080/api/auth/user-info", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data) {
                setUser(response.data); // Lưu thông tin user vào state
                fetchCartItems(token);
                setLoadingUser(false);
            } else {
                console.error("Dữ liệu user không hợp lệ:", response.data);
                setUser(null);
            }
        } catch (error) {
            console.error("Lỗi lấy thông tin người dùng:", error);
            localStorage.removeItem("token"); // Xóa token nếu lỗi
            setUser(null); // Xóa user
            window.location.reload(); // Tải lại trang để yêu cầu đăng nhập
        }
    };
    // Gọi hàm khi component được render
    useEffect(() => {
        getUserData();
        fetchCartItems();
    }, []);





    const thanhtien = (price, quantity) => price * quantity;

    const tinhTongTien = () => {
        return cartitems
            .filter(item => selectedProducts.includes(item.id))
            .reduce((total, item) => total + thanhtien(item.product.price, item.quantity), 0);
    };
    // const tinhTongTien = () => {
    //     if (!cartitems || cartitems.length === 0) return 0;

    //     const total = cartitems.reduce((total, item) => {
    //         const price = item?.product?.price ? parseFloat(item.product.price) : 0;
    //         const quantity = item?.quantity ? parseInt(item.quantity) : 1;
    //         return total + price * quantity;
    //     }, 0);

    //     return total.toLocaleString("vi-VN"); // Định dạng số tiền theo Việt Nam
    // };



    const handleCheckout = () => {
        // Kiểm tra giỏ hàng có trống không
        if (!cartitems || cartitems.length === 0) {
            toast.error("Giỏ hàng của bạn đang trống!");
            return;
        }

        // Lọc các sản phẩm đã chọn và chuyển đổi dữ liệu
        const selectedItems = cartitems
            .filter(item => selectedProducts.includes(item.id)) // Chỉ lấy sản phẩm đã chọn
            .map(item => ({
                cartItemId: item.id,
                id: item?.product?.id ?? 0,
                name: item?.product?.name ?? "Không có tên",
                imageUrl: item.product.image,
                price: item?.product?.price ? parseFloat(item.product.price) : 0,
                quantity: item?.quantity ?? 1,
                stock: item?.product.stockQuantity,
                fromCart: true
            }));
        console.log(selectedItems);

        // Kiểm tra nếu không có sản phẩm nào được chọn
        if (selectedItems.length === 0) {
            console.error("Bạn chưa chọn sản phẩm nào để thanh toán.");
            Swal.fire({
                toast: true,
                icon: 'warning',
                position: "top-end",
                title: 'Vui lòng chọn ít nhất một sản phẩm để thanh toán!',
                confirmButtonText: 'OK',
                timer: 2000,
                timerProgressBar: true
            });
            return;
        }
        // Kiểm tra stock
        // Kiểm tra stock cho từng sản phẩm
        for (let item of selectedItems) {
            if (item.quantity > item.stock) {
                Swal.fire({
                    toast: true,
                    icon: 'warning',
                    position: "top-end",
                    title: `Sản phẩm ${item.name} không đủ số lượng trong kho!`,
                    confirmButtonText: 'OK',
                    timer: 2000,
                    timerProgressBar: true
                });
                return;
            }
        }
        const totalAmount = selectedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        // console.log("Danh sách sản phẩm gửi qua thanh toán:", selectedItems);
        // console.log("Tổng tiền:", totalAmount);

        // Điều hướng đến trang thanh toán và truyền dữ liệu
        navigate('/thanh-toan', { state: { selectedItems, totalAmount } });
    };








    const handleIncrement = async (cartItemId) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );

        // Tìm cartItem có ID tương ứng để lấy số lượng mới
        const updatedItem = cartitems.find(item => item.id === cartItemId);
        if (!updatedItem) return;

        const updatedQuantity = updatedItem.quantity + 1; // Lấy số lượng mới

        try {
            await axios.put(`http://localhost:8080/api/cart/update-quantity?cartItemId=${cartItemId}&quantity=${updatedQuantity}`);
        } catch (error) {
            console.error("Lỗi khi cập nhật số lượng:", error);
        }
    };


    const handleDecrement = async (cartItemId) => {
        const currentProduct = cartitems.find(item => item.id === cartItemId);
        if (!currentProduct || currentProduct.quantity <= 1) return;

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === cartItemId ? { ...item, quantity: item.quantity - 1 } : item
            )
        );

        try {
            await axios.put(`http://localhost:8080/api/cart/update-quantity?cartItemId=${cartItemId}&quantity=${currentProduct.quantity - 1}`);
        } catch (error) {
            console.error("Lỗi khi cập nhật số lượng:", error);
        }
    };

    useEffect(() => {
        checkUserLogin();
    }, []);

    const handleRemove = async (cartItemId) => {
        try {
            const token = localStorage.getItem("token"); // Lấy token từ localStorage
            if (!token) {
                console.error("Không tìm thấy token! Người dùng cần đăng nhập.");
                return;
            }

            await axios.delete(`http://localhost:8080/api/cart/remove?cartItemId=${cartItemId}`, {
                headers: { Authorization: `Bearer ${token}` } // Gửi token trong headers
            });

            setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
            console.log("Sản phẩm đã được xóa khỏi giỏ hàng!");
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
        }
    };



    // Xử lý chọn tất cả
    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            // Nếu chọn tất cả, thì tất cả các sản phẩm sẽ vào danh sách selectedProducts
            const allProductIds = cartitems.map(item => item.id);
            setSelectedProducts(allProductIds);
        } else {
            // Nếu bỏ chọn tất cả, thì clear danh sách selectedProducts
            setSelectedProducts([]);
        }
    };

    // Xử lý chọn từng sản phẩm
    const handleSelectProduct = (id) => {
        if (selectedProducts.includes(id)) {
            setSelectedProducts(selectedProducts.filter(itemId => itemId !== id));
        } else {
            setSelectedProducts([...selectedProducts, id]);
        }
    };

    if (loadingUser) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <img style={{ width: "100px", height: "100px" }} src="./img/loading-gif-png-5.gif" alt="Loading..." />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container text-center" style={{ height: "300px" }}>
                <h2 style={{ paddingTop: "100px", fontWeight: "bold", color: "red" }}>Bạn cần đăng nhập để xem giỏ hàng</h2>
                <p>Đăng nhập
                    <Link to="/login" className='ms-1'>
                        {/* <Button variant="primary">Đăng nhập</Button> */}
                        tại đây
                    </Link>
                </p>


            </div>
        );
    }

    if (loadingCart) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <img style={{ width: "100px", height: "100px" }} src="./img/loading-gif-png-5.gif" alt="Loading..." />
            </div>
        );
    }

    return (
        <>
            <ComeBack />
            <ToastContainer />

            <div className="mynocart container mt-2">
                <h5 className="title-cart" style={{ color: "red", fontSize: "20px", fontWeight: "bolder", fontStyle: "italic", paddingTop: "10px", paddingBottom: "10px" }}>Giỏ hàng của bạn</h5>
            </div>
            {cartitems.length === 0 ? (
                <div className="content-nocart container text-center mt-5" style={{ height: "200px" }}>
                    <div className="icon">
                        <img src="https://bizweb.dktcdn.net/100/479/509/themes/897806/assets/no-cart.png?1677998172667" alt="No cart" /><br />
                        <span>Không có sản phẩm nào trong giỏ hàng</span>
                    </div>
                </div>
            ) : (
                <div>
                    <Table striped bordered hover className="container">
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                    /> Chọn tất cả
                                </th>
                                <th>Thông tin sản phẩm</th>
                                <th>Đơn giá</th>
                                <th>Số lượng</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartitems.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedProducts.includes(item.id)}
                                            onChange={() => handleSelectProduct(item.id)}
                                        />
                                    </td>
                                    <td>
                                        <div className="product-detail">
                                            <div className="col-md-3 product-img">
                                                <Link to={`/chi-tiet-san-pham/${item.product.id}`}>
                                                    <img
                                                        style={{ width: "100px", height: "100px" }}
                                                        className="img"
                                                        src={item.product.image}
                                                        alt={item.product.name}
                                                    />
                                                </Link>
                                            </div>
                                            <div style={{ fontWeight: "bold" }}>{item.product.name}</div>
                                        </div>
                                        <span style={{ color: "red", cursor: "pointer" }} onClick={() => handleRemove(item.id)} >Xóa</span>
                                    </td>
                                    <td style={{ fontWeight: "bold", color: "blue" }} className="money">{formatCurrency(item.product.price)}</td>
                                    <td className="money">
                                        <button id='btn' onClick={() => handleDecrement(item.id)}>-</button>
                                        <input id='numberquantity' className='text-center' value={item.quantity} readOnly style={{ width: "30px" }} />
                                        <button id='btn' onClick={() => handleIncrement(item.id)}>+</button>
                                    </td>
                                    <td style={{ fontWeight: "bold", color: "red" }} className="money">{formatCurrency(thanhtien(item.product.price, item.quantity))}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div className="container mt-3 d-flex justify-content-between align-items-center">
                        <h5 style={{ margin: 0 }}>
                            Tổng tiền:
                            <p style={{ color: "red", fontWeight: "bold" }}>
                                {formatCurrency(tinhTongTien())}
                            </p>
                        </h5>
                        <Button variant="primary" onClick={handleCheckout}>Thanh toán</Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Cart;
