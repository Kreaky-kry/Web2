import { FaShoppingCart } from "react-icons/fa";
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import ComeBack from "../../Components/ComeBack";
import "../../scss/ProductDetail.scss";
import numeral from "numeral";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Card } from "react-bootstrap";
import { ip } from "../../api/Api";




const ProductDetail = () => {
    const [activeTab, setActiveTab] = useState('des');
    const [isShow, setIsShow] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();
    const [cartLoading, setCartLoading] = useState(false);

    const [selectedImage, setSelectedImage] = useState(null);

    const [relatedProducts, setRelatedProducts] = useState([]);
    const [mainProductName, setMainProductName] = useState("");
    const [reviews, setReviews] = useState([]);
    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };
    const [outOfStock, setOutOfStock] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/product/${id}`);
                const productData = response.data;

                if (productData) {
                    const mainProductName = extractProductName(productData.name);
                    setProduct(productData); // nhớ setProduct để dùng bên dưới

                    const isOutOfStock = productData.stockQuantity === 0;
                    setOutOfStock(isOutOfStock); // thêm state này

                    fetchImageAndUpdateProduct(productData);
                    fetchResults(mainProductName);
                    fetchReviews();
                }

            } catch (error) {
                console.error("Lỗi khi gọi API sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    ///lấy đánh giá sản phẩm
    const fetchReviews = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/reviews/${id}`);
            const dataReviews = response.data;
            setReviews(dataReviews);
            console.log(dataReviews);
        } catch (error) {
            console.log("Lỗi: ", error);
        }
    }

    // Hàm lọc tên sản phẩm chính xác
    const extractProductName = (fullName) => {
        return fullName
            .replace(/\d+GB/g, '') // Loại bỏ dung lượng (128GB, 256GB, ...)
            .replace(/\s*\|\s*Chính hãng VN\/A/g, '') // Loại bỏ phần "| Chính hãng VN/A"
            .trim(); // Xóa khoảng trắng dư thừa
    };


    // Hàm fetch ảnh cho 1 sản phẩm
    const fetchImageAndUpdateProduct = async (productData) => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/product/${productData.id}/image`,
                { responseType: "blob" }
            );
            const imageUrl = URL.createObjectURL(response.data);
            setProduct({ ...productData, imageUrl });
        } catch (error) {
            console.error("Lỗi tải ảnh sản phẩm ID:", productData.id, error);
            setProduct({ ...productData, imageUrl: "/images/default-placeholder.jpg" });
        }
    };

    //hàm lấy sản phẩm liên quan

    const fetchResults = async (mainProductName) => {

        try {
            const response = await axios.get(
                `http://localhost:8080/api/products/search?keyword=${mainProductName}`
            );
            setRelatedProducts(response.data);
            fetchImagesRelatedProducts(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy kết quả tìm kiếm:", error);
        }
    };


    // Hàm fetch ảnh cho từng sản phẩm
    const fetchImagesRelatedProducts = async (data) => {
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

        setRelatedProducts(updatedProducts);
    };



    const handleCheckout = (data) => {
        if (!product) {
            console.error("Không có sản phẩm để thanh toán.");
            return;
        }

        // Kiểm tra số lượng mua có vượt quá stockQuantity không
        if (quantity > product.stockQuantity) {
            Swal.fire({
                icon: 'error',
                toast: true,
                position: "top-end",
                title: 'Số lượng không đủ',
                text: `Chỉ còn ${product.stockQuantity} sản phẩm trong kho. Vui lòng chọn lại số lượng.`,
                timer: 2000,
                timerProgressBar: true
            });
            return; // Dừng lại và không điều hướng
        }

        // Tạo thông tin sản phẩm cần mua
        const selectedItems = [
            {
                id: product.id,              // ID sản phẩm
                name: product.name,          // Tên sản phẩm
                imageUrl: product.imageUrl,  // Ảnh sản phẩm
                price: product.price,        // Giá sản phẩm
                quantity: quantity,          // Số lượng mua
                fromCart: false
            }
        ];

        // Tính tổng tiền dựa trên số lượng và giá
        const totalAmount = product.price * quantity;

        // Điều hướng đến trang thanh toán và truyền state
        navigate('/thanh-toan', { state: { selectedItems, totalAmount } });
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh' // chiều cao 100% của viewport,

            }}>
                <img style={{ width: "100px", height: "100px" }} src="../../../img/loading-gif-png-5.gif" />
            </div>
        );
    }
    if (!product) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh' // chiều cao 100% của viewport,

            }}>
                <img style={{ width: "100px", height: "100px" }} src="../../../img/loading-gif-png-5.gif" />
            </div>
        );
    }

    const incrementQuantity = () => setQuantity(quantity + 1);
    const decrementQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };
    const handleShowmore = () => {
        setIsShow(!isShow)
    }
    // Hàm thêm vào giỏ hàng
    const handleAddToCart = async () => {
        try {
            setCartLoading(true);

            // Lấy token từ localStorage
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user.id || !token) {
                // Hiển thị thông báo yêu cầu đăng nhập
                Swal.fire({
                    icon: 'error',
                    title: 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!',
                    confirmButtonText: 'Đăng nhập ngay'
                }).then(() => {
                    // Chuyển hướng người dùng đến trang đăng nhập
                    navigate('/login'); // Đường dẫn đến trang đăng nhập
                });
                return; // Kết thúc hàm nếu chưa đăng nhập
            }


            // Gửi yêu cầu API thêm vào giỏ hàng
            const response = await axios.post(
                "http://localhost:8080/api/cart/add",
                null, // Không có body, sử dụng query params
                {
                    params: {
                        userId: user.id, // ID của user đã đăng nhập
                        productId: product.id, // ID của sản phẩm
                        quantity: quantity, // Số lượng
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thêm vào giỏ hàng thành công',
                    confirmButtonText: 'OK'
                });
            } else {
                toast.error("Không thể thêm sản phẩm vào giỏ hàng!");
            }
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
            alert("Đã có lỗi xảy ra khi thêm vào giỏ hàng!");
        } finally {
            setCartLoading(false);
        }
    };

    return (
        <>
            <ComeBack />
            <div className="productdetail container">
                <div className='detail row'>
                    <div className="col-md-3 product-img">
                        {/* <img className='img' src={`../../../img/${JSON.parse(product.photo)[0]}`} /> */}
                        <div className="product-images" style={{ position: 'relative' }}>
                            <Link to={`/chi-tiet-san-pham/${product.id}`}>
                                <Card.Img
                                    className="product-image"
                                    src={product.imageUrl}
                                    alt={product.name}
                                    onError={(e) => (e.target.src = "/images/default-placeholder.jpg")}
                                />
                                {outOfStock && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '5px',
                                        left: '10px',
                                        backgroundColor: 'rgba(255, 0, 0, 0.8)',
                                        color: 'white',
                                        padding: '5px 10px',
                                        fontWeight: 'bold',
                                        borderRadius: '5px'
                                    }}>
                                        HẾT HÀNG
                                    </div>
                                )}
                            </Link>
                        </div>

                    </div>

                    <div className='col-md-6 product-form'>

                        {/* Header Section */}
                        <div className="product-header">
                            <h1>{product.name}</h1>
                            <span>{product.brand}</span>
                            <span>Tình trạng: Còn hàng</span>
                        </div>

                        {/* Price and Storage Options */}
                        <div className="product-price">
                            <p>Giá: <a>{formatCurrency(product.price)}</a></p>
                            <span>Giá cũ: <strike className="price-old">10.000.000đ</strike></span>
                        </div>

                        <div className="quantity-selection">
                            <span>Số lượng</span>

                            <td className="money">
                                <button id='btn' onClick={decrementQuantity} >-</button>
                                <input id='numberquantity' className='text-center' value={quantity} readOnly style={{ width: "30px" }} />
                                <button id='btn' onClick={incrementQuantity} >+</button>
                            </td>
                        </div>


                        {/* Call-to-Action Buttons */}
                        <div className="action-buttons">
                            <div className="btn-1">
                                <button
                                    className="btn-shopping"
                                    onClick={handleCheckout}
                                    disabled={outOfStock}
                                    style={{ opacity: outOfStock ? 0.5 : 1 }}
                                >
                                    <FaShoppingCart /> Mua ngay<br />
                                    <span>Giao hàng tận nơi hoặc nhận tại cửa hàng</span>
                                </button>
                            </div>

                            <div className="btn-2">
                                <button
                                    className="themgiohang"
                                    onClick={handleAddToCart}
                                    disabled={cartLoading || outOfStock}
                                >
                                    {outOfStock ? "Hết hàng" : cartLoading ? "Đang thêm..." : "Thêm vào giỏ hàng"}
                                </button>
                                <button className="mua-tra-gop" disabled={outOfStock}>Mua trả góp</button>
                            </div>
                        </div>

                    </div>
                    <div className='col-md-3 form-policy'>
                        <div className="sidebar">
                            {/* Chính sách của chúng tôi */}
                            <div className="policies">
                                <div className="section-title">Chính Sách Của Chúng Tôi</div>
                                <p>
                                    <img src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/policy_image_1.png?1719291840576" />
                                    Miễn phí vận chuyển tại TP.HCM
                                </p>
                                <p>
                                    <img src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/policy_image_2.png?1719291840576" />
                                    Bảo hành chính hãng toàn quốc
                                </p>
                                <p>
                                    <img src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/policy_image_3.png?1719291840576" />
                                    Cam kết chính hãng 100%
                                </p>
                                <p>
                                    <img src="https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/policy_image_4.png?1719291840576" />
                                    1 đổi 1 nếu sản phẩm lỗi
                                </p>
                            </div>

                            {/* Có thể bạn thích */}
                            <div className="recommendations">
                                <div className="section-title">Có Thể Bạn Thích</div>
                                <div className="recommendation-item">
                                    <img className="img"
                                        src="https://bizweb.dktcdn.net/thumb/large/100/497/960/products/sac-egnezy.jpg?v=1696428931143"
                                    />
                                    <div>
                                        <span className="product-name">Pin Dự Phòng Energizer</span><br />
                                        <span className="product-price">650.000₫ </span>
                                        <strike className="old-price">715.000₫</strike>
                                    </div>
                                </div>
                                <div className="recommendation-item">
                                    <img className="img"
                                        src="https://bizweb.dktcdn.net/thumb/large/100/497/960/products/sac-egnezy.jpg?v=1696428931143"
                                    />
                                    <div>
                                        <span className="product-name">Pin Dự Phòng Energizer</span><br />
                                        <span className="product-price">650.000₫ </span>
                                        <strike className="old-price">715.000₫</strike>
                                    </div>
                                </div>
                                <div className="recommendation-item">
                                    <img className="img"
                                        src="https://bizweb.dktcdn.net/thumb/large/100/497/960/products/sac-egnezy.jpg?v=1696428931143"
                                    />
                                    <div>
                                        <span className="product-name">Pin Dự Phòng Energizer</span><br />
                                        <span className="product-price">650.000₫ </span>
                                        <strike className="old-price">715.000₫</strike>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="describe row">
                    <div className="tab">
                        <Link onClick={() => setActiveTab("des")}>Mô tả sản phẩm</Link>
                        <Link onClick={() => setActiveTab("policy")}>Chính sách đổi trả</Link>
                    </div>
                    {activeTab === "des" &&
                        (
                            <div className="des col-9 m-3">
                                <span>
                                    Nguồn gốc {product.description} chính hãng<br />
                                    {product.description} nói riêng và toàn bộ sản phẩm công nghệ nói chung
                                    được Di Động Thông Minh nhập trực tiếp từ những nhà phân phối lớn hàng đầu Việt Nam như
                                    FPT Trading, Dầu Khí, Digiworld hay Viettel,...
                                </span><br />
                                {isShow && (
                                    <span>
                                        Chính vì vậy, khi mua hàng tại hệ thống, quý khách hoàn toàn có thể yên tâm về chất lượng cũng như chế độ bảo hành chính hãng.<br />
                                        Không chỉ vậy, Di Động Thông Minh còn cam kết sản phẩm nguyên seal chính hãng và dễ dàng check thông tin IMEI trên trang chủ Apple để kiểm chứng.<br />
                                        Đánh giá thiết kế {product.description} : Mới mẻ, thời thượng<br />
                                        {product.description} năm nay có màu mới tím mới khá lạ mắt. Còn lại, về hình thức thì không khác biệt gì nhiều so với iPhone 13 Pro Max với mặt lưng kính, phần khung viền thiết kế vuông vức và được bo cong bốn góc.<br />
                                        Bên khung cạnh phải có phím nguồn, còn khung cạnh trái có cần gạt rung, phím chỉnh âm lượng và khe sim, thiết bị vẫn có có cổng Lightning và loa ngoài.<br />
                                        Đánh giá màn hình {product.description}: Ấn tượng với Dynamic Island kỳ diệu
                                        Màn hình {product.description} mới có kích thước 6.7” cùng tấm nền OLED với độ phân giải Full HD+ (1290 x 2796 pixel) cho chất lượng hiển thị cực đã mắt.<br />
                                    </span>
                                )}
                                {/* <span>{product.description}</span> */}
                                <div className="bg-cl-active"></div>
                                <a className="showmore" onClick={() => handleShowmore()}>
                                    {isShow ? "Thu gọn" : "Xem thêm"}
                                </a><br />


                            </div>
                        )

                    }
                    {activeTab === "policy" &&
                        (
                            <div className="chinhsach col-9 m-3">
                                + Sản phẩm lỗi, hỏng do quá trình sản xuất hoặc vận chuyện<br />
                                + Nằm trong chính sách đổi trả sản phẩm của Bean<br />
                                + Sản phẩm còn nguyên tem mác không bị rớt vỡ, vô nước<br />
                                + Thời gian đổi trả nhỏ hơn 15 ngày kể từ ngày nhận hàng<br />
                                + Chi phí bảo hành về sản phẩm, vận chuyển khách hàng chịu chi phí
                                Điều kiện đổi trả hàng<br />
                                Điều kiện về thời gian đổi trả: trong vòng 07 ngày kể từ khi nhận được hàng và phải liên hệ gọi ngay cho chúng tôi theo số điện thoại trên để được xác nhận đổi trả hàng.
                                Điều kiện đổi trả hàng:<br />
                                - Sản phẩm gửi lại phải còn nguyên đai nguyên kiện<br />
                                - Phiếu bảo hành (nếu có) và tem của công ty trên sản phẩm còn nguyên vẹn.<br />
                                - Sản phẩm đổi/ trả phải còn đầy đủ hộp, giấy hướng dẫn sử dụng và không bị trầy xước, bể.<br />
                                - Quý khách chịu chi phí vận chuyển, đóng gói, thu hộ tiền, chi phí liên lạc tối đa tương đương 10% giá trị đơn hàng.
                            </div>
                        )
                    }
                </div>

                {/* Additional Information and Recommendations */}

                <div>
                    <p className="mt-3 " style={{ fontStyle: "italic", fontWeight: "600", fontSize: "20px" }}>Sản phẩm liên quan</p>
                    <div className="my-deal-phone container p-3 mt-3">
                        <section className="content container">
                            <div className="content-deal row p-2 justify-content-start">
                                {/* Lặp qua danh sách sản phẩm và hiển thị */}
                                {relatedProducts.length > 0 ? (
                                    relatedProducts.map((item) => (
                                        <Card className="box col-2 m-2 item-cart" key={item.id}>
                                            {/* <div className="discount-badge">-9%</div> Phần giảm giá */}
                                            <div className="favorite-icon" >
                                                {/* Đổi icon dựa trên trạng thái yêu thích */}
                                                {/* <i className={favoriteProducts.includes(item.id) ? "fas fa-heart" : "far fa-heart"}></i> */}
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
                                    <div className="NoProduct">Không có sản phẩm nào để hiển thị</div>
                                )}
                            </div>
                        </section>
                    </div>

                </div>
                <div className="comments mt-4">
                    <p className="mt-3 " style={{ fontStyle: "italic", fontWeight: "600", fontSize: "20px" }}>Đánh giá sản phẩm({reviews.length})</p>

                    {reviews.map((re, index) => (
                        <>
                            <div className="comment my-2 border p-2 rounded">
                                <strong>{re.user.username}</strong>
                                <p>{re.user.email}</p>
                                <p>{re.content}</p>
                                <small>
                                    {new Date(re.createdAt).toLocaleString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false,
                                    })}
                                </small>

                            </div>
                        </>
                    ))}


                </div>
            </div>
        </>
    );

}

export default ProductDetail;
