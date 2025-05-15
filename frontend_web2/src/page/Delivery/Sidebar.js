import { Link } from "react-router-dom";
import "../../scss/Delivery.scss"
import { useEffect, useState } from "react";
import axios from "axios";
import { ip } from "../../api/Api";
const Sidebar = () => {

    const [user, setuser] = useState([]);

    const getUser = async () => {
        try {
            // Lấy token từ localStorage
            const token = localStorage.getItem('token');
            
            // Gửi yêu cầu GET với token trong header
            const response = await axios.get(`${ip}/getUser`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Thêm token vào header
                }
            });
            const userData = response.data;
            setuser(userData);
        } catch (error) {
            console.log("lỗi khi gọi user", error)
        }
    }
    useEffect(() => {
        getUser();
    },[])



    return (
        <div className="sidebar">
            <div className="profile-section">
               
                {
                    user.map((item, index) => {
                        return (
                            <div key={index}>
                                {/* <img src="profile-placeholder.jpg" alt="Profile" className="profile-img" /> */}
                                <div className="username">{item.name}</div>
                                <div className="email">{item.email}</div>
                                {/* <button className="edit-profile">Sửa Hồ Sơ</button> */}
                            </div>
                        )
                    })
                }
            </div>
            <ul className="menu">
                {/* <Link to="/my-account"><li>Tài Khoản Của Tôi</li></Link> */}
                <Link><li className="active">Đơn Mua</li></Link>
            </ul>
        </div>
    );
}

export default Sidebar;