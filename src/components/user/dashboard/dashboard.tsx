'use client'
import classes from './dashboard.module.css';
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
export default function UserDashboard (){
    return (
            <div className={classes.main_container}>
                    <div className={classes.chartContainer}>
      <h1 className={classes.chartTitle}>Biểu đồ thống kê</h1>
      <Line data={data} options={options} />
    </div>
            </div>
    )
}