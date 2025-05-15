// import { Link, Outlet } from "react-router-dom";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import { Container, Navbar } from "react-bootstrap";

// const Header = (props) => {
//     return (
//         <>
//             <Navbar className="bg-body-tertiary" data-bs-theme="dark">
//                 <Navbar.Brand to="#home"><h2 className="ms-3">Trang quản lí</h2></Navbar.Brand>
//                 <Navbar.Toggle />
//                 <Navbar.Collapse className="justify-content-end">

//                     <img className="me-3" style={{ witdh: "30px", height: "30px" }} src="//bizweb.dktcdn.net/100/497/960/themes/923878/assets/favicon.png?1726452627090" />
//                 </Navbar.Collapse>
//             </Navbar>
//             <div className="container-fluid">
//                 <div className="row flex-nowrap">
//                     <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
//                         <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white vh-100">
//                             <Link className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
//                                 <span className="fs-5 d-none d-sm-inline">Danh mục</span>
//                             </Link>
//                             <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
//                                 <li className="nav-item" >
//                                     <Link to="/" className="nav-link align-middle px-0">
//                                         <i className="fs-4 bi-house  text-white"></i> <span className="ms-1 d-none d-sm-inline  text-white">Trang chủ</span>
//                                     </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="user" className="nav-link px-0 align-middle text-white">
//                                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
//                                             <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
//                                         </svg>
//                                         <span className="ms-1 d-none d-sm-inline  ">Người dùng</span>
//                                     </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="product" className="nav-link px-0 align-middle  text-white">
//                                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-seam" viewBox="0 0 16 16">
//                                             <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2zm3.564 1.426L5.596 5 8 5.961 14.154 3.5zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z" />
//                                         </svg>
//                                         <span className="ms-1 d-none d-sm-inline">Sản phẩm</span>
//                                     </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="brand" className="nav-link px-0 align-middle text-white">
//                                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-tags-fill" viewBox="0 0 16 16">
//                                             <path d="M2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586zm3.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
//                                             <path d="M1.293 7.793A1 1 0 0 1 1 7.086V2a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l.043-.043z" />
//                                         </svg>
//                                         <span className="ms-1 d-none d-sm-inline">Thương hiệu</span>
//                                     </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="categories" className="nav-link px-0 align-middle text-white">
//                                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-tags-fill" viewBox="0 0 16 16">
//                                             <path d="M2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586zm3.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
//                                             <path d="M1.293 7.793A1 1 0 0 1 1 7.086V2a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l.043-.043z" />
//                                         </svg>
//                                         <span className="ms-1 d-none d-sm-inline">Danh mục</span>
//                                     </Link>
//                                 </li>

//                                 <li>
//                                     <Link to="abate" className="nav-link px-0 align-middle text-white">
//                                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-basket" viewBox="0 0 16 16">
//                                             <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9zM1 7v1h14V7zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5" />
//                                         </svg>
//                                         <span className="ms-1 d-none d-sm-inline">Thanh toán</span>
//                                     </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="Statistics" className="nav-link px-0 align-middle text-white">
//                                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pc-display-horizontal" viewBox="0 0 16 16">
//                                             <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v7A1.5 1.5 0 0 0 1.5 10H6v1H1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-5v-1h4.5A1.5 1.5 0 0 0 16 8.5v-7A1.5 1.5 0 0 0 14.5 0zm0 1h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5M12 12.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0m2 0a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0M1.5 12h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M1 14.25a.25.25 0 0 1 .25-.25h5.5a.25.25 0 1 1 0 .5h-5.5a.25.25 0 0 1-.25-.25" />
//                                         </svg>
//                                         <span className="ms-1 d-none d-sm-inline">Thống kê</span>
//                                     </Link>
//                                 </li>
//                             </ul>
//                             <hr />


//                         </div>
//                     </div>
//                     <div className="col py-3">
//                         <Outlet />
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }
// export default Header;
// import { Link, NavLink, Outlet } from "react-router-dom";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import { Container, Navbar } from "react-bootstrap";

// const Header = (props) => {
//     return (
//         <>
//             <Navbar className="bg-body-tertiary" data-bs-theme="dark">
//                 <Navbar.Brand to="#home"><h2 className="ms-3">Trang quản lí</h2></Navbar.Brand>
//                 <Navbar.Toggle />
//                 <Navbar.Collapse className="justify-content-end">

//                     <img className="me-3" style={{ witdh: "30px", height: "30px" }} src="//bizweb.dktcdn.net/100/497/960/themes/923878/assets/favicon.png?1726452627090" />
//                 </Navbar.Collapse>
//             </Navbar>
//             <div className="container-fluid">
//                 <div className="row flex-nowrap">
//                     <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
//                         <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white vh-100">
//                             {/* <Link className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
//                                 <span className="fs-5 d-none d-sm-inline">Danh mục</span>
//                             </Link> */}
//                             <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
//                                 <li className="nav-item" >
//                                     <Link to="/" className="nav-link align-middle px-0">
//                                         <i className="fs-4 bi-house  text-white"></i> <span className="ms-1 d-none d-sm-inline  text-white">Trang chủ</span>
//                                     </Link>
//                                 </li>
//                                 {/* người dùng */}
//                                 <li>
//                                     <NavLink
//                                         to="user"
//                                         className={({ isActive }) =>
//                                             `nav-link px-0 align-middle text-white ${isActive ? "text-warning" : ""}`
//                                         }
//                                     >
//                                         <i className="bi bi-star"></i>
//                                         <span className="ms-1 d-none d-sm-inline">Người dùng</span>
//                                     </NavLink>
//                                 </li>
//                                 {/* sản phẩm */}
//                                 <li>

//                                     <NavLink
//                                         to="product"
//                                         className={({ isActive }) =>
//                                             `nav-link px-0 align-middle text-white ${isActive ? "text-warning" : ""}`
//                                         }
//                                     >
//                                         <i className="bi bi-star"></i>
//                                         <span className="ms-1 d-none d-sm-inline">Sản phẩm</span>
//                                     </NavLink>
//                                 </li>
//                                 {/* thương hiệu */}
//                                 <li>

//                                     <NavLink
//                                         to="brand"
//                                         className={({ isActive }) =>
//                                             `nav-link px-0 align-middle text-white ${isActive ? "text-warning" : ""}`
//                                         }
//                                     >
//                                         <i className="bi bi-star"></i>
//                                         <span className="ms-1 d-none d-sm-inline">Thương hiệu</span>
//                                     </NavLink>
//                                 </li>
//                                 {/* danh mục */}
//                                 <li>

//                                     <NavLink
//                                         to="categories"
//                                         className={({ isActive }) =>
//                                             `nav-link px-0 align-middle text-white ${isActive ? "text-warning" : ""}`
//                                         }
//                                     >
//                                         <i className="bi bi-star"></i>
//                                         <span className="ms-1 d-none d-sm-inline">Danh mục</span>
//                                     </NavLink>
//                                 </li>
//                                 {/* topic */}
//                                 <li>

//                                     <NavLink
//                                         to="topic"
//                                         className={({ isActive }) =>
//                                             `nav-link px-0 align-middle text-white ${isActive ? "text-warning" : ""}`
//                                         }
//                                     >
//                                         <i className="bi bi-star"></i>
//                                         <span className="ms-1 d-none d-sm-inline">Topic</span>
//                                     </NavLink>
//                                 </li>
//                                 {/* bài viết */}
//                                 <li>

//                                     <NavLink
//                                         to="post"
//                                         className={({ isActive }) =>
//                                             `nav-link px-0 align-middle text-white ${isActive ? "text-warning" : ""}`
//                                         }
//                                     >
//                                         <i className="bi bi-star"></i>
//                                         <span className="ms-1 d-none d-sm-inline">Bài viết</span>
//                                     </NavLink>
//                                 </li>
//                                 {/* banner */}
//                                 <li>

//                                     <NavLink
//                                         to="banner"
//                                         className={({ isActive }) =>
//                                             `nav-link px-0 align-middle text-white ${isActive ? "text-warning" : ""}`
//                                         }
//                                     >
//                                         <i className="bi bi-star"></i>
//                                         <span className="ms-1 d-none d-sm-inline">Banner</span>
//                                     </NavLink>
//                                 </li>
//                                 {/* đánh giá sản phẩm */}
//                                 <li>
//                                     <NavLink
//                                         to="review"
//                                         className={({ isActive }) =>
//                                             `nav-link px-0 align-middle text-white ${isActive ? "text-warning" : ""}`
//                                         }
//                                     >
//                                         <i className="bi bi-star"></i>
//                                         <span className="ms-1 d-none d-sm-inline">Đánh giá sản phẩm</span>
//                                     </NavLink>
//                                 </li>
//                                 {/* thanh toán */}
//                                 <li>

//                                     <NavLink
//                                         to="abate"
//                                         className={({ isActive }) =>
//                                             `nav-link px-0 align-middle text-white ${isActive ? "text-warning" : ""}`
//                                         }
//                                     >
//                                         <i className="bi bi-star"></i>
//                                         <span className="ms-1 d-none d-sm-inline">Thanh toán</span>
//                                     </NavLink>
//                                 </li>
//                                 {/* thống kê */}
//                                 <li>

//                                     <NavLink
//                                         to="Statistics"
//                                         className={({ isActive }) =>
//                                             `nav-link px-0 align-middle text-white ${isActive ? "text-warning" : ""}`
//                                         }
//                                     >
//                                         <i className="bi bi-star"></i>
//                                         <span className="ms-1 d-none d-sm-inline">Thống kê</span>
//                                     </NavLink>
//                                 </li>
//                             </ul>
//                             <hr />
//                         </div>
//                     </div>
//                     <div className="col py-3">
//                         <Outlet />
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }
// export default Header;
import { NavLink, Outlet } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Navbar } from "react-bootstrap";

const Header = (props) => {
    return (
        <>
            <Navbar className="bg-body-tertiary" data-bs-theme="dark">
                <Navbar.Brand to="#home"><h2 className="ms-3">Trang quản lí</h2></Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <img className="me-3" style={{ width: "30px", height: "30px" }} src="//bizweb.dktcdn.net/100/497/960/themes/923878/assets/favicon.png?1726452627090" alt="logo" />
                </Navbar.Collapse>
            </Navbar>

            <div className="container-fluid">
                <div className="row flex-nowrap">
                    <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
                        <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white vh-100">
                            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                                {[
                                    { path: '/', label: 'Trang chủ', icon: 'bi-house' },
                                    { path: 'user', label: 'Người dùng', icon: 'bi-person' },
                                    { path: 'product', label: 'Sản phẩm', icon: 'bi-box-seam' },
                                    { path: 'brand', label: 'Thương hiệu', icon: 'bi-tags' },
                                    { path: 'categories', label: 'Danh mục', icon: 'bi-list-ul' },
                                    // { path: 'topic', label: 'Topic', icon: 'bi-chat-dots' },
                                    // { path: 'post', label: 'Bài viết', icon: 'bi-file-earmark-text' },
                                    // { path: 'banner', label: 'Banner', icon: 'bi-image' },
                                    // { path: 'review', label: 'Đánh giá sản phẩm', icon: 'bi-chat-left-text' },
                                    { path: 'abate', label: 'Thanh toán', icon: 'bi-credit-card' },
                                ].map(({ path, label, icon }) => (
                                    <li key={path} className="nav-item">
                                        <NavLink
                                            to={path}
                                            end
                                            className={({ isActive }) =>
                                                `nav-link px-0 align-middle w-100 ${isActive ? "text-warning fw-bold" : "text-white"}`
                                            }
                                        >
                                            <i className={`bi ${icon}`}></i>
                                            <span className="ms-2 d-none d-sm-inline">{label}</span>
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                            <hr />
                        </div>
                    </div>
                    <div className="col py-3">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;