'use client'
import classes from './dashboard.module.css'
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Dataset 1',
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
        text: 'Sample Line Chart',
      },
    },
  };
export default function AdminDashboard(){
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
     
      <Line data={data} options={options} />

   
      <Line data={data} options={options} />
    </div>
        </div>
    )
}