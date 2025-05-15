import { useState } from "react";
import { FaInstagram } from "react-icons/fa";

const Banner = () => {
    const [banner, setBanner] = useState([

    ])

    return (
        <>
            <div className="banner-bg">
                <div className="content container">
                    {banner.map((item, index) => {
                        return (
                            <div className="col-4 mt-4" key={item.id}>
                                <div>
                                    <img src={item.img} className="image" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div >
        </>
    );
}
export default Banner;