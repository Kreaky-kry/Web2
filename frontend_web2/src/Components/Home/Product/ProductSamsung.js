import { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import numeral from 'numeral';
import axios from "axios";
import '../../../scss/Accessory.scss'
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ip } from "../../../api/Api";

const ProductSamsung = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favoriteProducts, setFavoriteProducts] = useState([]); // Lưu trữ danh sách sản phẩm yêu thích
    const navigate = useNavigate();

    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };

    const handleAddToWishlist = async (data) => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user.id || !token) {
                // Hiển thị thông báo yêu cầu đăng nhập
                Swal.fire({
                    icon: 'error',
                    title: 'Bạn cần đăng nhập để thêm sản phẩm yêu thích!',
                    confirmButtonText: 'Đăng nhập ngay'
                }).then(() => {
                    // Chuyển hướng người dùng đến trang đăng nhập
                    navigate('/login'); // Đường dẫn đến trang đăng nhập
                });
                return; // Kết thúc hàm nếu chưa đăng nhập
            }


            // Gửi yêu cầu API thêm vào giỏ hàng
            const response = await axios.post(
                "http://localhost:8080/api/wishlist/add",
                null, // Không có body, sử dụng query params
                {
                    params: {
                        userId: user.id, // ID của user đã đăng nhập
                        productId: data, // ID của sản phẩm
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: 'success',
                    title: 'Thêm sản phẩm yêu thích thành công',
                    confirmButtonText: 'OK'
                });
                // Cập nhật danh sách sản phẩm yêu thích nếu chưa có
                setFavoriteProducts((prevFavorites) => {
                    if (!prevFavorites.includes(data)) {
                        return [...prevFavorites, data];
                    }
                    return prevFavorites; // Trả về danh sách cũ nếu đã tồn tại
                });
            } else {
                toast.error("Không thể thêm sản phẩm vào giỏ hàng!");
            }
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
            console.log(data);
            Swal.fire({
                toast: true,
                icon: 'warning',
                position: "top-end",
                title: 'Sản phẩm yêu thích đã được thêm',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/brand/samsung?page=0&size=8");
                const productList = response.data.content; // ⚡ Lấy mảng từ content

                // Sau khi lấy danh sách sản phẩm, gọi API lấy ảnh
                fetchImagesAndUpdateProducts(productList);
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);
    // Hàm fetch ảnh cho từng sản phẩm
    const fetchImagesAndUpdateProducts = async (data) => {
        if (!data || data.length === 0) return;

        const updatedProducts = await Promise.all(
            data.map(async (product) => {
                try {
                    const response = await axios.get(
                        `http://localhost:8080/api/product/${product.id}/image`,
                        { responseType: "blob" }
                    );
                    const imageUrl = URL.createObjectURL(response.data);
                    return { ...product, imageUrl };
                } catch (error) {
                    console.error("Lỗi tải ảnh sản phẩm ID:", product.id, error);
                    return { ...product, imageUrl: "/images/default-placeholder.jpg" }; // Ảnh mặc định khi lỗi
                }
            })
        );

        setProducts(updatedProducts);
    };

    // Nếu đang loading, hiển thị loading text
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh' // chiều cao 100% của viewport,

            }}>
                <img style={{ width: "100px", height: "100px" }} src="./img/loading-gif-png-5.gif" />
            </div>
        );
    }


    return (

        <div className="accessory mt-5">
            <ToastContainer />
            <section className="content container">
                <div className="title-index">
                    <Link className="name-title">
                        <span className="phukien-link">Samsung</span>Nổi bật
                    </Link>
                    <div className="link-title">
                        <Link>Galaxy S Series </Link>
                        <Link>Galaxy Note Series </Link>
                        <Link>Galaxy S Series </Link>

                    </div>

                </div>
                <div className="my-deal-phone container p-3 mt-3">
                    <section className="content container">
                        <div className="content-deal row p-2">
                            {/* Lặp qua danh sách sản phẩm và hiển thị */}
                            {/* Lặp qua danh sách sản phẩm và hiển thị */}
                            {products.length > 0 ? (
                                products.map((item) => (
                                    <Card className="box col-2 m-2 item-cart" key={item.id}>
                                        <div className="discount-badge">-9%</div> {/* Phần giảm giá */}
                                        <div className="favorite-icon" onClick={() => handleAddToWishlist(item.id)}>
                                            {/* Đổi icon dựa trên trạng thái yêu thích */}
                                            <i className={favoriteProducts.includes(item.id) ? "fas fa-heart" : "far fa-heart"}></i>
                                        </div>
                                        <Link to={`/chi-tiet-san-pham/${item.id}`}>
                                            <Card.Img
                                                className="product-image"
                                                src={item.imageUrl}
                                                alt={item.name}
                                            />
                                        </Link>
                                        <div className="official-badge">Chính Hãng 100%</div> {/* Chính hãng */}
                                        <div>
                                            <p className="text_name">{item.name}</p>
                                        </div>
                                        <div className="list-group-flush">
                                            <hr />
                                            <p className="text_price">Giá: {formatCurrency(item.price)}</p>
                                            <hr />
                                            <p className="text_plus">Tặng sạc cáp nhanh 25w trị giá 250k</p>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div>Không có sản phẩm nào để hiển thị</div>
                            )}
                        </div>
                    </section>
                </div>

            </section >

        </div >
    )
}
export default ProductSamsung;