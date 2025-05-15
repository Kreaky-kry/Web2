
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../scss/AllProduct.scss";
import ComeBack from "../../Components/ComeBack";
import numeral from "numeral";
import axios from "axios";
import { Card } from "react-bootstrap";
import "../../../src/assets/css/pagination.css";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FaInstagram } from "react-icons/fa";
import { Grid, List } from 'lucide-react';
const AllProduct = () => {
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const perPage = 10;
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('grid'); // grid hoặc list
    const [sortOption, setSortOption] = useState('default'); // Tùy chọn sắp xếp mặc định
    // State cho các bộ lọc
    const [brandFilter, setBrandFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [tempPriceRange, setTempPriceRange] = useState({ min: '', max: '' });
    
    // State cho danh sách danh mục và thương hiệu được lấy từ API
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const formatCurrency = (value) => {
        return numeral(value).format('0,0') + ' ₫';
    };
    const [banner, setBanner] = useState([
        { id: 1, img: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/img_3banner_1.jpg?1719291840576", icon: <FaInstagram /> },
        { id: 2, img: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/img_3banner_2.jpg?1719291840576", icon: <FaInstagram /> },
        { id: 3, img: "https://bizweb.dktcdn.net/100/497/960/themes/923878/assets/img_3banner_3.jpg?1719291840576", icon: <FaInstagram /> },
    ]);

    // Hàm gọi API để lấy danh sách danh mục
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:8080/api/categories");
            if (response.data) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách danh mục:", error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };
    // Hàm gọi API để lấy danh sách thương hiệu
    const fetchBrands = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:8080/api/brands");
            if (response.data) {
                setBrands(response.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách thương hiệu:", error);
            setBrands([]);
        } finally {
            setLoading(false);
        }
    };
    // Gọi API để lấy danh sách danh mục và thương hiệu khi component được mount
    useEffect(() => {
        fetchCategories();
        fetchBrands();
    }, []);
    // Hàm thêm vào yêu thích
    const handleAddToWishlist = async (data) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user.id || !token) {
                Swal.fire({
                    icon: 'error',
                    title: 'Bạn cần đăng nhập để thêm sản phẩm yêu thích!',
                    confirmButtonText: 'Đăng nhập ngay'
                }).then(() => {
                    navigate('/login');
                });
                return;
            }
          
            const response = await axios.post(
                "http://localhost:8080/api/wishlist/add",null,
                {
                    params: {
                        userId: user.id,
                        productId: data,
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
                    confirmButtonText: 'OK',
                    timer: 2000,
                    timerProgressBar: true
                });
                
                setFavoriteProducts((prevFavorites) => {
                    if (!prevFavorites.includes(data)) {
                        return [...prevFavorites, data];
                    }
                    return prevFavorites;
                });
            } else {
                toast.error("Không thể thêm sản phẩm vào giỏ hàng!");
            }
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
            Swal.fire({
                toast: true,
                icon: 'warning',
                position: "top-end",
                title: 'Sản phẩm yêu thích đã được thêm',
                confirmButtonText: 'OK',
                timer: 2000,
                timerProgressBar: true
            });
        } finally {
            setLoading(false);
        }
    };
    // Hàm gọi API lấy sản phẩm với các bộ lọc
    const getFilteredProducts = useCallback(async (pageNumber = 1) => {
        try {
            setLoading(true);   
            let url = `http://localhost:8080/api/productsPage?page=${pageNumber - 1}&size=${perPage}`; 
            // Thêm các tham số lọc vào URL nếu có
            if (brandFilter) {
                // Sử dụng API lọc theo thương hiệu
                url = `http://localhost:8080/api/brand/${brandFilter}?page=${pageNumber - 1}&size=${perPage}`;
            } else if (categoryFilter) {
                // Sử dụng API lọc theo danh mục
                url = `http://localhost:8080/api/category/${categoryFilter}?page=${pageNumber - 1}&size=${perPage}`;
            }
            
            const response = await axios.get(url);
            
            if (response.data) {
                let productData = response.data.content || [];
                
                // Lọc theo giá nếu có
                if (priceRange.min !== '' || priceRange.max !== '') {
                    const min = priceRange.min === '' ? 0 : parseInt(priceRange.min);
                    const max = priceRange.max === '' ? Infinity : parseInt(priceRange.max);
                    
                    productData = productData.filter(product => 
                        product.price >= min && product.price <= max
                    );
                }
                
                // Sắp xếp sản phẩm nếu chọn
                if (sortOption === 'price-asc') {
                    productData.sort((a, b) => a.price - b.price);
                } else if (sortOption === 'price-desc') {
                    productData.sort((a, b) => b.price - a.price);
                } else if (sortOption === 'newest') {
                    // Giả định rằng sản phẩm có trường createdDate hoặc releaseDate
                    productData.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                }
                
                setCurrentPage(response.data.number + 1);
                setTotalPages(response.data.totalPages);
                setProducts(productData || []);
                fetchImagesAndUpdateProducts(productData);
            }
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [brandFilter, categoryFilter, priceRange, sortOption, perPage]);
    // Gọi API khi component mount hoặc khi các bộ lọc thay đổi
    useEffect(() => {
        getFilteredProducts(1);
    }, [getFilteredProducts, brandFilter, categoryFilter, sortOption]);
    // Điều hướng trang
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            getFilteredProducts(page);
        }
    };
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
                    return { ...product, imageUrl: "/images/default-placeholder.jpg" };
                }
            })
        );
        setProducts(updatedProducts);
    };
    // Xử lý thay đổi chế độ xem (grid/list)
    const handleViewModeChange = (mode) => {
        setViewMode(mode);
    };
    // Xử lý thay đổi bộ lọc thương hiệu
    const handleBrandChange = (brand) => {
        setBrandFilter(brand === brandFilter ? '' : brand);
        setCategoryFilter(''); // Reset bộ lọc danh mục khi chọn thương hiệu
    };
    // Xử lý thay đổi bộ lọc danh mục
    const handleCategoryChange = (category) => {
        setCategoryFilter(category === categoryFilter ? '' : category);
        setBrandFilter(''); // Reset bộ lọc thương hiệu khi chọn danh mục
    };
    // Xử lý thay đổi khoảng giá
    const handlePriceRangeChange = (min, max) => {
        setPriceRange({ min, max });
    };
    // Xử lý thay đổi sắp xếp
    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };
    // Xử lý áp dụng bộ lọc giá
    const applyPriceFilter = () => {
        setPriceRange({
            min: priceRange.min,
            max: priceRange.max
        });
        // Nếu bạn có hàm fetch sản phẩm theo giá thì gọi ở đây
        // fetchProducts({ min: tempPriceRange.min, max: tempPriceRange.max });
    };
    
    // Component hiển thị sản phẩm theo kiểu grid
    const renderGridProducts = () => (
        <div className="content-deal row p-2">
            {products.length > 0 ? (
                products.slice(0, 10).map((item) => (
                    <Card className="box col-2 m-2 item-cart" key={item.id}>
                        <div className="discount-badge">-9%</div>
                        <div className="favorite-icon" onClick={() => handleAddToWishlist(item.id)}>
                            <i className={favoriteProducts.includes(item.id) ? "fas fa-heart text-red-500" : "far fa-heart"}></i>
                        </div>
                        <Link to={`/chi-tiet-san-pham/${item.id}`}>
                            <Card.Img
                                className="product-image"
                                src={item.imageUrl}
                                alt={item.name}
                            />
                        </Link>
                        <div className="official-badge mt-4">Chính Hãng 100%</div>
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
    );
    // Component hiển thị sản phẩm theo kiểu list
    const renderListProducts = () => (
        <div className="list-products">
            {products.length > 0 ? (
                products.slice(0, 10).map((item) => (
                    <div className="list-product-item row" key={item.id}>
                        <div className="col-3">
                            <Link to={`/chi-tiet-san-pham/${item.id}`}>
                                <img 
                                    className="list-product-image" 
                                    src={item.imageUrl} 
                                    alt={item.name} 
                                />
                            </Link>
                        </div>
                        <div className="col-9 list-product-details">
                            <h4 className="list-product-name">{item.name}</h4>
                            <div className="list-product-brand">Thương hiệu: {item.brand || "Không có"}</div>
                            <div className="list-product-price">Giá: {formatCurrency(item.price)}</div>
                            <div className="list-product-description">
                                <p className="text_plus">Tặng sạc cáp nhanh 25w trị giá 250k</p>
                            </div>
                            <div className="list-product-actions">
                            <button
                                className={`btn-add-to-wishlist ${favoriteProducts.includes(item.id) ? 'active' : ''}`}
                                onClick={() => handleAddToWishlist(item.id)}>
                                <i className={favoriteProducts.includes(item.id) ? "fas fa-heart" : "far fa-heart"}></i>
                                {favoriteProducts.includes(item.id) ? ' Đã yêu thích' : ' Thêm vào yêu thích'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="NoProduct ps-2">Không có sản phẩm nào để hiển thị</div>
            )}
        </div>
    );
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <img style={{ width: "100px", height: "100px" }} src="./img/loading-gif-png-5.gif" alt="Loading" />
            </div>
        );
    }

    return (
        <>
            <ComeBack />
            <div className="AllProduct mt-3">
                <ToastContainer />
                <div className="bannerAll">
                    <div className="contentAll containerAll">
                        {banner.map((item) => (
                            <div className="col-4 " key={item.id}>
                                <div>
                                    <img src={item.img} className="image" alt="Banner" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Phần lọc và hiển thị sản phẩm */}
                <div className="container mt-4">
                    <div className="row">
                        {/* Phần sidebar bộ lọc */}
                        <div className="col-md-2">
                            <div className="filter-section">
                                {/* Lọc theo danh mục */}
                                <div className="filter-block">
                                    <h4>Danh mục</h4>
                                    <ul className="filter-list">
                                        {categories.length > 0 ? (
                                            categories.map(category => (
                                                <li key={category.id}>
                                                    <div className="form-check">
                                                        <input
                                                            type="radio"
                                                            className="form-check-input"
                                                            name="category"
                                                            id={`category-${category.id}`}
                                                            checked={categoryFilter === category.name}
                                                            onChange={() => handleCategoryChange(category.name)}
                                                        />
                                                        <label className="form-check-label" htmlFor={`category-${category.id}`}>
                                                            {category.name}
                                                        </label>
                                                    </div>
                                                </li>
                                            ))
                                        ) : (
                                            <li>Đang tải danh mục...</li>
                                        )}
                                    </ul>
                                </div>
                                {/* Lọc theo thương hiệu */}
                                <div className="filter-block">
                                    <h4>Thương hiệu</h4>
                                    <ul className="filter-list">
                                        {brands.length > 0 ? (
                                            brands.map(brand => (
                                                <li key={brand.id}>
                                                    <div className="form-check">
                                                        <input
                                                            type="radio"
                                                            className="form-check-input"
                                                            name="brand"
                                                            id={`brand-${brand.id}`}
                                                            checked={brandFilter === brand.name}
                                                            onChange={() => handleBrandChange(brand.name)}
                                                        />
                                                        <label className="form-check-label" htmlFor={`brand-${brand.id}`}>
                                                            {brand.name}
                                                        </label>
                                                    </div>
                                                </li>
                                            ))
                                        ) : (
                                            <li>Đang tải thương hiệu...</li>
                                        )}
                                    </ul>
                                </div>
                                {/* Lọc theo giá */}
                                <div className="filter-block">
                                    <h4>Giá</h4>
                                    <div className="price-filter">
                                        <div className="form-group mb-2">
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Giá thấp nhất"
                                                value={tempPriceRange.min}
                                                onChange={(e) => setTempPriceRange({ ...tempPriceRange, min: e.target.value })}/>
                                        </div>
                                        <div className="form-group mb-2">
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Giá cao nhất"
                                                value={tempPriceRange.max}
                                                onChange={(e) => setTempPriceRange({ ...tempPriceRange, max: e.target.value })}/>
                                        </div>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={applyPriceFilter}>
                                            Áp dụng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Phần hiển thị sản phẩm */}
                        <div className="col-md-10">
                            {/* Thanh công cụ trên cùng */}
                            <div className="product-toolbar mb-3">
                            <div className="view-options d-flex align-items-center">
                                    <span className="me-2">Sắp xếp:</span>
                                    <select
                                        className="form-select form-select-sm"
                                        value={sortOption}
                                        onChange={handleSortChange}>
                                        <option value="default">Mặc định</option>
                                        <option value="price-asc">Giá: Thấp đến Cao</option>
                                        <option value="price-desc">Giá: Cao đến Thấp</option>
                                        <option value="newest">Mới nhất</option>
                                        <option value="bestseller">Bán chạy</option>
                                    </select>
                                </div>
                                {/* Hiển thị sản phẩm theo grid vs list */}
                                <div className="view-mode">
                                    <button
                                        className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => handleViewModeChange('grid')}
                                        title="Chế độ xem lưới">
                                        <Grid size={22}/>
                                    </button>
                                    <button
                                        className={`btn btn-sm ms-2 ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => handleViewModeChange('list')}
                                        title="Chế độ xem danh sách">
                                        <List size={22}/>
                                    </button>
                                </div>
                            </div>
                            {/* Hiển thị sản phẩm theo chế độ xem đã chọn */}
                            <div className="my-deal-phone">
                                {viewMode === 'grid' ? renderGridProducts() : renderListProducts()}
                            </div>
                            {/* Thanh phân trang */}
                            <div className="pageNumber">
                                <button
                                    id="firstPage"
                                    onClick={() => goToPage(1)}
                                    disabled={currentPage === 1}
                                    className={currentPage === 1 ? "disabled-button" : ""}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-left" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                                        <path fillRule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                                    </svg>
                                </button>
                                <button
                                    id="first"
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={currentPage === 1 ? "disabled-button" : ""}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                                    </svg>
                                </button>
                                <span id="page">Trang {currentPage} / {totalPages}</span>
                                <button
                                    id="firstPage"
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={currentPage === totalPages ? "disabled-button" : ""}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
                                    </svg>
                                </button>
                                <button
                                    id="first"
                                    onClick={() => goToPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className={currentPage === totalPages ? "disabled-button" : ""}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708" />
                                        <path fillRule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AllProduct;