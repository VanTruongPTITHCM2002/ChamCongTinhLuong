'use client'
import classes from './dashboard.module.css'
import { Chart, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';

// Đăng ký các thành phần cần thiết
Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
      x: {
          title: {
              display: true,
              text: 'X Axis'
          }
      },
      y: {
          title: {
              display: true,
              text: 'Y Axis'
          }
      }
  }
};

const data1 = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
      {
          label: 'Dataset 1',
          data: [65, 59, 80, 81, 56, 55],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
      }
  ]
};

const data2 = {
  labels: ['July', 'August', 'September', 'October', 'November', 'December'],
  datasets: [
      {
          label: 'Dataset 2',
          data: [75, 69, 70, 91, 76, 85],
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
      }
  ]
};


export default function AdminDashboard(){
    const router = useRouter();
   

    if(!localStorage.getItem('username')){
        router.push('/login');
        return null;
    }
    return (
        <div className={classes.article}>
            <div className={classes.main}>
            <div className={classes.red_box}>
                <h5>Tổng số nhân viên</h5>
            </div>
            <div className={classes.orange_box}>
                <h5>Tổng lương đã trả trong tháng</h5>
            </div>
            <div className={classes.yellow_box}>
                <h5>Số lượng hợp đồng đã ký trong tháng</h5>
            </div>
            <div className={classes.green_box}>
                <h5>Số lương chấm công trong ngày</h5>
            </div>

            </div>
            <div className={classes.chartContainer}>
    <div className={classes.chart}>
        <Bar data={data1} options={options} />
    </div>
    <div className={classes.chart}>
        <Bar data={data2} options={options} />
    </div>
</div>


        </div>
    )
}