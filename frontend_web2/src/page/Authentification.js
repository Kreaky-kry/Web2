import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import Login from "./Login";
import Register from "./Register";
import { ip } from "../api/Api";

const Authentification = () => {
  const [user, setUser] = useState(null);  // Trạng thái lưu thông tin người dùng
  const [redirect, setRedirect] = useState("");  // Trạng thái điều hướng
  const dispatch = useDispatch();
  const storedUser = useSelector((state) => state.user_data);  // Lấy thông tin người dùng từ Redux

  // Kiểm tra token trong localStorage khi component được mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getAuth(token);  // Lấy thông tin xác thực nếu có token
    }
  }, []);

  // Cập nhật user nếu storedUser thay đổi
  useEffect(() => {
    if (storedUser && storedUser.name !== (user?.name || "")) {
      setUser(storedUser);
    }
  }, [storedUser]);

  // Lấy thông tin xác thực từ API
  const getAuth = (token) => {
    axios
      .get(`${ip}/auth`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        setUser(result.data.user);  // Cập nhật trạng thái user sau khi lấy dữ liệu thành công
        dispatch({ type: "USER", value: result.data.user });  // Cập nhật Redux với thông tin người dùng
      })
      .catch(() => {
        logout();  // Nếu lỗi thì thực hiện đăng xuất
      });
  };

  // Hàm đăng xuất
  const logout = () => {
    localStorage.removeItem("token");  // Xóa token khỏi localStorage
    setUser(null);  // Xóa thông tin người dùng khỏi trạng thái
    dispatch({ type: "USER", value: "guest" });  // Đặt Redux thành "guest"
  };

  // Xử lý các hành động khi người dùng click vào menu
  const handleClick = (e) => {
    switch (e.target.id) {
      case "0":
        window.location.href = "/dashboard";  // Điều hướng đến Dashboard
        break;
      case "1":
        setRedirect("my-account");  // Điều hướng đến tài khoản của tôi
        break;
      case "2":
        setRedirect("track-my-order");  // Điều hướng đến Theo dõi đơn hàng
        break;
      case "3":
        logout();  // Đăng xuất
        break;
      default:
        break;
    }
  };

  // Điều hướng sau khi người dùng click vào các mục menu
  if (redirect) {
    return <Navigate to={`/${redirect}`} replace />;
  }

  // Hiển thị thông tin nếu người dùng đã đăng nhập, ngược lại hiển thị form đăng nhập
  return user && localStorage.getItem("token") ? (
    <li>
      <Dropdown>
        <Dropdown.Toggle variant="toggle" id="dropdown-basic">
          <i className="fa fa-user-o"></i>
          <span>{user.name}</span>  {/* Hiển thị tên người dùng */}
        </Dropdown.Toggle>

        <Dropdown.Menu onClick={handleClick}>
          {user.role_id !== null && (
            <Dropdown.Item id="0">Dashboard</Dropdown.Item>  
          )}
          <Dropdown.Item id="1">My Account</Dropdown.Item>  {/* Mục Tài khoản */}
          <Dropdown.Item id="2">Track My Order</Dropdown.Item>  {/* Mục Theo dõi đơn hàng */}
          <Dropdown.Divider />
          <Dropdown.Item id="3">
            <i id="3" className="fa fa-sign-out" aria-hidden="true"></i> Log Out  {/* Mục Đăng xuất */}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </li>
  ) : (
    <React.Fragment>
      <li>
        <Login />  {/* Hiển thị form đăng nhập nếu người dùng chưa đăng nhập */}
      </li>
      {/* <li>
        <Register />  Uncomment nếu bạn muốn có form đăng ký 
      </li>
      */}
    </React.Fragment>
  );
};

export default Authentification;
