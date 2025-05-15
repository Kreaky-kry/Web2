
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const UpdateProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [image, setImage] = useState();
    const [updateProduct, setUpdateProduct] = useState({
        id: null,
        name: "",
        description: "",
        brand: "",
        price: "",
        category: "",
        releaseDate: "",
        productAvailable: false,
        stockQuantity: "",
    });
    const [brands, setBrands] = useState([]);
    //gọi brand
    useEffect(() => {
        const fetchcategory = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/brands");
                console.log(response.data); // Kiểm tra dữ liệu trả về
                if (Array.isArray(response.data)) {
                    setBrands(response.data);
                } else {
                    console.error("Dữ liệu không phải là mảng:", response.data);
                }
            } catch (error) {
                console.log("Lỗi call API", error);
            }
        };
        fetchcategory();
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/product/${id}`);
                let productData = response.data;

                // Kiểm tra category có hợp lệ không, nếu không gán giá trị mặc định
                if (!productData.category) {
                    productData.category = ""; // Gán giá trị mặc định nếu category không tồn tại
                }

                setProduct(productData);
                setUpdateProduct(productData);

                const responseImage = await axios.get(`http://localhost:8080/api/product/${id}/image`, { responseType: "blob" });
                const imageFile = await convertUrlToFile(responseImage.data, response.data.imageName);
                setImage(imageFile);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };
        fetchProduct();
    }, [id]);


    const convertUrlToFile = async (blobData, fileName) => {
        return new File([blobData], fileName, { type: blobData.type });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedProduct = new FormData();
        updatedProduct.append("imageFile", image);
        updatedProduct.append("product", new Blob([JSON.stringify(updateProduct)], { type: "application/json" }));

        try {
            await axios.put(`http://localhost:8080/api/product/${id}`, updatedProduct, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            Swal.fire({
                toast: true,
                icon: 'success',
                position: "top-end",
                text: "Sửa thành công.",
                timer: 2000,
                timerProgressBar: true
            });
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Failed to update product. Please try again.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdateProduct({ ...updateProduct, [name]: value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    return (
        <div className="update-product-container">
            <div className="center-container" style={{ marginTop: "7rem", maxWidth: "700px", margin: "0 auto", padding: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", background: "#fff", borderRadius: "8px" }}>
                <h2 className="text-center pb-3">Sửa sản phẩm</h2>
                <form className="row g-3 pt-1" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label className="form-label"><strong>Tên sản phẩm</strong></label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder={product.name}
                            value={updateProduct.name}
                            onChange={handleChange}
                            name="name"
                        />
                    </div>
                    <div className="col-md-6">

                        <label className="form-label"><strong>Thương Hiệu</strong></label>
                        {brands.length > 0 ? (
                            <select
                                className="form-select"
                                onChange={handleChange}
                                value={updateProduct.brand}
                                name="brand"
                                required
                            >
                                {brands.map((item, index) => (
                                    <option key={index} value={item.name}>{item.name}</option>
                                ))}

                            </select>
                        ) : (
                            <span>Không có brand</span>
                        )}
                    </div>
                    <div className="col-12">
                        <label className="form-label"><strong>Mô tả</strong></label>
                        <textarea
                            className="form-control"
                            placeholder={product.description}
                            name="description"
                            onChange={handleChange}
                            value={updateProduct.description}
                            rows="3"
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label"><strong>Giá</strong></label>
                        <input
                            type="number"
                            className="form-control"
                            onChange={handleChange}
                            value={updateProduct.price}
                            placeholder={product.price}
                            name="price"
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label"><strong>Danh mục</strong></label>
                        <select
                            className="form-select"
                            value={updateProduct.category || ""} // Đảm bảo không bị undefined
                            onChange={handleChange}
                            name="category"
                        >
                            <option value="">Chọn danh mục</option>
                            <option value="Áo">Áo</option>
                            <option value="Headphone">Quần</option>
                            <option value="Mobile">Giày</option>
                            <option value="Electronics">Bóng rổ</option>
                            <option value="Toys">Bóng Chuyền</option>
                            <option value="Fashion">Bóng đá</option>
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="form-label"><strong>Tồn kho</strong></label>
                        <input
                            type="number"
                            className="form-control"
                            onChange={handleChange}
                            placeholder={product.stockQuantity}
                            value={updateProduct.stockQuantity}
                            name="stockQuantity"
                        />
                    </div>
                    <div className="col-md-8">
                        <label className="form-label"><strong>Hình ảnh</strong></label>
                        <div className="image-preview mb-2">
                            <img
                                src={image ? URL.createObjectURL(image) : "Image unavailable"}
                                alt={product.imageName}
                                style={{
                                    width: "200px",
                                    height: "200px",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                }}
                            />
                        </div>
                        <input
                            className="form-control"
                            type="file"
                            onChange={handleImageChange}
                            name="imageUrl"
                        />
                    </div>
                    <div className="col-12">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="productAvailable"
                                checked={updateProduct.productAvailable}
                                onChange={(e) => setUpdateProduct({ ...updateProduct, productAvailable: e.target.checked })}
                            />
                            <label className="form-check-label"><strong>Product Available</strong></label>
                        </div>
                    </div>
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary w-100">Lưu thay đổi</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProduct;
