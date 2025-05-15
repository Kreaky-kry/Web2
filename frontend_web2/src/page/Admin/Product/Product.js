import React, { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Pagination from "react-js-pagination";
import { Button, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import axios from "axios";
import { ip } from "../../../api/Api";
import { use } from "react";




const Products = () => {
  // State hooks to replace class state
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [searchproducts, setS] = useState([]);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [product, setProduct] = useState([]);
  const [detailModalShow, setDetailModalShow] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const [input, setInput] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);




  // 🟢 Hàm gọi API lấy sản phẩm theo trang, ưu tiên sản phẩm có releaseDate sớm nhất
  const getProducts = useCallback(async (pageNumber = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/productsPage?page=${pageNumber - 1}&size=${perPage}&sort=releaseDate,desc`
      );

      if (response.data) {
        let sortedProducts = response.data.content || [];

        // Kiểm tra nếu có releaseDate và sắp xếp giảm dần (mới nhất lên đầu)
        if (sortedProducts.length > 0 && sortedProducts[0].releaseDate) {
          sortedProducts = sortedProducts.sort(
            (a, b) => Date.parse(b.releaseDate) - Date.parse(a.releaseDate)
          );
        }

        setCurrentPage(response.data.number + 1);
        setTotalPages(response.data.totalPages);
        setProducts(sortedProducts);
        fetchImagesAndUpdateProducts(sortedProducts);
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);



  // 🟢 Gọi API khi component mount
  useEffect(() => {
    getProducts(1);
  }, [getProducts]);



  // 🟢 Điều hướng trang
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      if (input.trim()) {
        searchProducts(input, page); // gọi hàm tìm kiếm nếu có từ khóa
      } else {
        getProducts(page); // gọi bình thường nếu không tìm kiếm
      }
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
          return { ...product, imageUrl: "/images/default-placeholder.jpg" }; // Ảnh mặc định khi lỗi
        }
      })
    );

    setProducts(updatedProducts);
  };

  // Similar to componentDidMount
  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //chi tiết
  const openDetailModal = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/product/${id}`);
      const productDetails = response.data;
      setProduct(productDetails)
      setDetailModalShow(true);

    } catch (error) {
      console.error("Error fetching product details", error);
      Swal.fire({
        text: "Failed to fetch product details",
        icon: "error",
      });
    }
  };

  const handleDelete = (id) => {
    setDeletingProductId(id);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {

        Axios.delete(`http://localhost:8080/api/product/${id}`, {

        })
          .then((response) => {
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: response.data.message,
            }).then(() => {
              getProducts(currentPage); // Refresh the product list after deletion
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.response?.data?.message || "Something went wrong!",
            });
          })
          .finally(() => {
            setDeletingProductId(null); // Clear deleting state
          });
      } else {
        setDeletingProductId(null); // If user cancels, clear deleting state
      }
    });
  };

  const closeProductDetailModal = () => {
    setDetailModalShow(false);
    setProduct([])
  }



  useEffect(() => {
    getProducts();
  }, [getProducts]);


  //search
  const searchProducts = async (keyword, page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/products/searchPage`, {
        params: {
          keyword: keyword.trim().toLowerCase(),
          page: page - 1,
          size: perPage
        }
      });
  
      const { content = [], totalPages, currentPage } = response.data || {};
  
      // Kiểm tra dữ liệu nhận được từ API
      //console.log("Dữ liệu API:", response.data.products);
  
      setProducts(response.data.products);  // Cập nhật state sản phẩm
      setSearchResults(content);  // Cập nhật kết quả tìm kiếm
      setNoResults(content.length === 0);
      setTotalPages(totalPages);
      setCurrentPage(currentPage + 1);
  
      // Nếu cần xử lý thêm, bạn có thể thêm logic sau
      fetchImagesAndUpdateProducts(response.data.products);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      setProducts([]);  // Nếu có lỗi, đảm bảo reset lại products
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };
  



const handleChange = async (value) => {
  const keyword = value.trim();  // Lọc khoảng trắng đầu và cuối

  setInput(value);  // Cập nhật input (chưa trim) cho việc hiển thị trực tiếp

  if (keyword.length >= 1) {
      setShowSearchResults(true);  // Hiển thị kết quả tìm kiếm

      try {
          await searchProducts(keyword, 1);  // Gọi tìm kiếm từ trang 1
      } catch (error) {
          console.error('Lỗi khi tìm kiếm:', error);
          // Có thể hiển thị thông báo lỗi nếu cần
      }
  } else {
      setShowSearchResults(false);  // Ẩn kết quả tìm kiếm nếu không có từ khóa
      setSearchResults([]);  // Reset kết quả tìm kiếm
      setNoResults(false);  // Đặt lại trạng thái không có kết quả
      getProducts(1);  // Reset lại danh sách sản phẩm gốc từ trang 1
  }
};




  return (
    <div className="container-fluid">
      <div className="card shadow mb-4">
        <div className="card-header py-3 d-flex justify-content-between align-items-center">
          <h6 className="m-0 font-weight-bold text-primary">Tất cả sản phẩm</h6>
          <div>
            <input
              placeholder="Tìm..."
              className="form-control"
              style={{ width: "140px" }}
              value={input}
              onChange={(e) => handleChange(e.target.value)}
            />
            <Link to={'/admin/productCreate'} className="btn btn-success my-2 me-2 ">Thêm sản phẩm</Link>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
              <thead>
                <tr>
                  <th>Hình ảnh(đại diện)</th>

                  <th>Tên sản phẩm</th>

                  <th>Chức năng</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7">
                      <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <Spinner animation="border" />
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td style={{ textAlign: "center" }}>
                        <img
                          height="60px"
                          width="60px"
                          src={product.imageUrl}
                          alt={product.name}
                        />
                      </td>

                      <td>{product.name}</td>


                      <td style={{ textAlign: "center" }}>
                        <Link to={`/admin/ProductEdit/${product.id}`} className="btn btn-success my-2 me-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                          </svg>
                        </Link>

                        <Button variant="success me-2 btn btn-warning" onClick={() => openDetailModal(product.id)} >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                          </svg>
                        </Button>

                        <Button
                          variant="danger"
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingProductId === product.id}
                        >
                          {deletingProductId === product.id ? <Spinner size="sm" /> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                          </svg>}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* 🟢 Thanh phân trang */}
          <div className="pageNumber">
            <button
              id="firstPage"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className={currentPage === 1 ? "disabled-button" : ""}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-left" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                <path fill-rule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
              </svg>
            </button>

            <button
              id="first"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={currentPage === 1 ? "disabled-button" : ""}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
              </svg>
            </button>

            <span id="page">Trang {currentPage} / {totalPages}</span>

            <button
              id="firstPage"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={currentPage === totalPages ? "disabled-button" : ""}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
              </svg>
            </button>

            <button
              id="first"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className={currentPage === totalPages ? "disabled-button" : ""}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708" />
                <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <Modal show={detailModalShow} onHide={closeProductDetailModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Hiển thị thông tin của sản phẩm từ object product */}
          {product ? (
            <div>
              {/* Hiển thị hình ảnh */}
              <div><strong>Hình ảnh:</strong></div>
              <div>
                <img
                  height="60px"
                  width="60px"
                  src={`data:${product.imageType};base64,${product.imageDate}`}
                  alt={product.name}
                />
              </div>
              {/* Hiển thị thông tin chi tiết sản phẩm */}
              <div><strong>Tên sản phẩm: </strong> {product.name}</div>
              <div><strong>Giá: </strong> {product.price}</div>
              <div><strong>Mô tả: </strong> {product.description}</div>
              <div><strong>Số lượng tồn kho: </strong> {product.stockQuantity}</div>
              <div><strong>Loại: </strong>{product.category}</div>
              <div><strong>Thương hiệu: </strong>{product.brand}</div>
              <div><strong>Ngày nhập vào: </strong>{new Date(product.releaseDate).toLocaleString()}</div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeProductDetailModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>


    </div>
  );
};

export default Products;
