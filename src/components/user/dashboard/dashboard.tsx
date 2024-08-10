'use client'
import classes from './dashboard.module.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartOptions, Tick } from 'chart.js';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { errorSwal } from '../custom/sweetalert';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const data = {
  labels: ['1', '2', '3', '4', '5', '6', '7','8','9','10','11','12'],
  datasets: [
    {
      label: 'Tiền lương',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: 'rgba(75,192,192,1)',
    },
  ],
};


  

const options: ChartOptions<'line'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const, // Vị trí của legend
    },
    title: {
      display: true,
      text: 'Thống kê',
    },
  },
  scales: {
    y: {
      title: {
        display: true,
        text: 'VNĐ', // Nhãn trục y
      },
      ticks: {
        // Hàm callback tùy chỉnh hiển thị giá trị trên trục y
        callback: function (tickValue: string | number, index: number, ticks: Tick[]) {
          // Chuyển đổi tickValue về number nếu nó là string
          const value = typeof tickValue === 'string' ? parseFloat(tickValue) : tickValue;
          // Trả về giá trị đã được định dạng kèm đơn vị "VNĐ"
          return value.toLocaleString() + ' VNĐ';
        }
      }
    }
  }
};

// Sử dụng options với cấu hình biểu đồ
// new Chart(context, { type: 'line', data, options });

  const formattedAmount = (num:Float32Array | number)=>{
    return  num.toLocaleString('vi-VN', {
     style: 'currency',
     currency: 'VND',
   });
 }
 
//  function formatDate(dateString:string) {
//      const date = new Date(dateString);
//      const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng từ 0-11, cần +1
//      const day = String(date.getDate()).padStart(2, '0');
//      const year = date.getFullYear();
//      return `${day}-${month}-${year}`;
//    }

export default function UserDashboard (){
  
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  const currentYear = new Date().getFullYear();
  const [totalMonth,setTotalMonth] = useState<number[]>([]);
  // http://localhost:8085/api/v1/payroll/getMonthlyEmployee
  const data = {
    labels: ['Tháng','1', '2', '3', '4', '5', '6', '7','8','9','10','11','12'],
    datasets: [
      {
        label: 'Tiền lương',
        data: totalMonth ,
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };
  const getMonthly = async()=>{
    try{
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/payroll/getMonthlyEmployee`,{
         params:{
             idemployee:username,
             year:currentYear
         },headers: {
          Authorization: `Bearer ${token}`  
        }

      })
      setTotalMonth(response.data);

 }catch(error){
     errorSwal("Thất bại",'Có lỗi xảy ra!');
 }
  }
  useEffect(()=>{
    getMonthly();
  },[])
    return (
            <div className={classes.main_container}>
                    <div className={classes.chartContainer}>
      <h1 className={classes.chartTitle}>Biểu đồ thống kê lương </h1>
      <Line data={data} options={options} />
    </div>
            </div>
    )
}