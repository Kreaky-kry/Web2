import React, { useState, useRef, useEffect } from 'react';
import '../../assets/css/HotDeals.css'; // Đảm bảo rằng đường dẫn đến file CSS là chính xác


const HotDeals = () => {
	const [endDate, setEndDate] = useState('');
	const [timerDays, setTimerDays] = useState('00');
	const [timerHours, setTimerHours] = useState('00');
	const [timerMinutes, setTimerMinutes] = useState('00');
	const [timerSeconds, setTimerSeconds] = useState('00');

	let interval = useRef();

	const calculateEndDate = () => {
		const endDate = new Date(); // Lấy thời điểm hiện tại
		endDate.setDate(endDate.getDate() + 2); // Thêm 5 ngày vào thời điểm hiện tại

		// Chuyển đổi ngày kết thúc thành chuỗi có định dạng YYYY-MM-DD
		const year = endDate.getFullYear();
		const month = String(endDate.getMonth() + 1).padStart(2, '0'); // Thêm '0' phía trước nếu tháng là số đơn
		const day = String(endDate.getDate()).padStart(2, '0'); // Thêm '0' phía trước nếu ngày là số đơn
		const formattedEndDate = `${year}-${month}-${day}`;

		return formattedEndDate;
	};

	const startTimer = () => {
		const countDownDate = new Date(endDate).getTime();

		interval.current = setInterval(() => {
			const now = new Date().getTime();
			const distance = countDownDate - now;

			const days = Math.floor(distance / (1000 * 60 * 60 * 24));
			const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((distance % (1000 * 60)) / 1000);

			if (distance < 0) {
				clearInterval(interval.current);
			} else {
				setTimerDays(formatTime(days));
				setTimerHours(formatTime(hours));
				setTimerMinutes(formatTime(minutes));
				setTimerSeconds(formatTime(seconds));
			}
		}, 1000);
	};

	const formatTime = (time) => {
		return time < 10 ? `0${time}` : time;
	};

	useEffect(() => {
		const calculatedEndDate = calculateEndDate(); // Tính toán ngày kết thúc sau 5 ngày
		setEndDate(calculatedEndDate); // Thiết lập endDate với ngày kết thúc tính được

		return () => {
			clearInterval(interval.current);
		};
	}, []);

	useEffect(() => {
		if (endDate) {
			startTimer();
		}
	}, [endDate]);

	return (
		<div id="hot-deal" className="section">
			<div className="container">
				<div className="row">
					<div className="col-md-12">
						<div className="hot-deal">
							<ul className="hot-deal-countdown">
								<li>
									<div>
										<h3>{timerDays}</h3>
										<span>days</span>
									</div>
								</li>
								<li>
									<div>
										<h3>{timerHours}</h3>
										<span>Hours</span>
									</div>
								</li>
								<li>
									<div>
										<h3>{timerMinutes}</h3>
										<span>Mins</span>
									</div>
								</li>
								<li>
									<div>
										<h3>{timerSeconds}</h3>
										<span>Secs</span>
									</div>
								</li>
							</ul>
							
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HotDeals;
