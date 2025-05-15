import React, { useEffect, useState } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart
} from 'recharts';
import axios from 'axios';

const RevenueChart = () => {
  const [chartData, setChartData] = useState([]);
  const [quantityData, setQuantityData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/orders");
        const orders = response.data;
        console.log(orders);
        const monthlyRevenue = Array.from({ length: 12 }, (_, i) => ({
          name: `Tháng ${i + 1}`,
          totalRevenue: 0,
        }));

        const monthlyQuantity = Array.from({ length: 12 }, (_, i) => ({
          name: `Tháng ${i + 1}`,
          totalQuantity: 0,
        }));

        orders.forEach(order => {
          const month = new Date(order.createdAt).getMonth();

          monthlyRevenue[month].totalRevenue += order.totalPrice ?? 0;

          if (Array.isArray(order.orderItems)) {
            order.orderItems
              .forEach(item => {
                monthlyQuantity[month].totalQuantity += item.quantity ?? 0;
              });
          }
        });
        // Bảng hash map đếm số lượng mỗi sản phẩm
        const productMap = {};

        orders.forEach(order => {
          order.orderItems.forEach(item => {
            const productId = item.product.id;
            const name = item.product.name;
            const quantity = item.quantity;

            if (!productMap[productId]) {
              productMap[productId] = {
                name,
                totalSold: 0
              };
            }

            productMap[productId].totalSold += quantity;
          });
        });

        // Chuyển thành mảng và lấy top 5
        const sortedProducts = Object.values(productMap)
          .sort((a, b) => b.totalSold - a.totalSold)
          .slice(0, 5);

        setTopProducts(sortedProducts);
        setChartData(monthlyRevenue);
        setQuantityData(monthlyQuantity);
      } catch (error) {
        console.error("Lỗi khi fetch đơn hàng:", error);
      }
    };

    fetchOrders();
  }, []);

  const maxRevenue = Math.max(...chartData.map(item => item.totalRevenue), 0);
  const yAxisMax = Math.ceil(maxRevenue / 10000000) * 10000000 + 10000000;

  return (
    <>
      <h2>Doanh thu cả năm</h2>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 20, left: 30 }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name" />
          <YAxis
            domain={[0, yAxisMax]}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip formatter={(value) => `${value.toLocaleString()} đ`} />
          <Legend />
          <Bar dataKey="totalRevenue" barSize={30} fill="#413ea0" name="Tổng doanh thu" />
          <Line type="monotone" dataKey="totalRevenue" stroke="#ff7300" name="Xu hướng" />
        </ComposedChart>
      </ResponsiveContainer>
      <p style={{display:"flex", justifyContent:"center", marginTop:"20px", fontStyle: "italic", fontWeight: "600", fontSize: "20px"}}>Số lượng bán theo từng tháng</p>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={quantityData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="totalQuantity"
            stroke="#8884d8"
            fill="#8884d8"
            name='Số lượng'
          />
        </AreaChart>
      </ResponsiveContainer>
      <p style={{display:"flex", justifyContent:"center", marginTop:"20px", fontStyle: "italic", fontWeight: "600", fontSize: "20px"}}>Top 5 sản phẩm bán chạy</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          layout="vertical"
          data={topProducts}
          margin={{ top: 20, right: 50, left: 100, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ angle: 0, textAnchor: 'end' }}
            width={200}
          />
          <Tooltip />
          <Bar dataKey="totalSold" fill="#82ca9d" name="Số lượng bán" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default RevenueChart;
