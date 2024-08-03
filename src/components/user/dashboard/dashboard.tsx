'use client'
import classes from './dashboard.module.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
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


  

const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const, 
      },
      title: {
        display: true,
        text: 'Thống kê',
      },
    },
  };

export default function UserDashboard (){
  
  const username = localStorage.getItem('username');
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
      const response = await axios.get(`http://localhost:8085/api/v1/payroll/getMonthlyEmployee`,{
         params:{
             idemployee:username,
             year:currentYear
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