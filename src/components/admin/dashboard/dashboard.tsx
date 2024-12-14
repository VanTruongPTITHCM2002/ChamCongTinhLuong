'use client'
import axios from 'axios';
import classes from './dashboard.module.css'
import { Chart, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ChartData } from 'chart.js';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { errorSwal } from '@/custom/sweetalert';
import Cookies from 'js-cookie'
import { AnyCnameRecord } from 'dns';

// Đăng ký các thành phần cần thiết
Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
      x: {
          title: {
              display: true,
              text: 'Ngày' // Hiển thị tiêu đề cho trục x
          }
      },
      y: {
          title: {
              display: true,
              text: 'Lần truy cập' // Hiển thị tiêu đề cho trục y
          },
          ticks: {
            beginAtZero: true, // Bắt đầu trục y từ 0
            stepSize: 1, // Mỗi bước trên trục y tăng 1 đơn vị
            callback: function (value:any) {
                return Number(value).toLocaleString('vi-VN'); // Hiển thị số với dấu phân cách hàng nghìn
            }
        }
      }
  }
};
interface Access{
  mount:number;
  date:string;
}
  

export default function AdminDashboard(){
    const router = useRouter();
   const [amountAccount,setAmountAccount] = useState(0);
   const [totalPayment,setTotalPayment] = useState(0);
   const [countContract,setCounContract] = useState(0);
   const [countAttendance,setCountAttendance] = useState(0);
   const [accessWeb,setAccessWeb] = useState<Access[]>([]);
   const [arrPunish,setArrPunish] = useState<number[]>([]);
    const token = Cookies.get('token')
    const currentDate = new Date();
   
    const formattedDate = currentDate.toLocaleDateString('en-CA');
    const [chartData, setChartData] = useState<ChartData<'bar'>>({
      labels: [],
      datasets: []
  });



  const getAccess = async()=>{
    try{
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/audit-log/count`,
      {
        params:{
          action:"Đăng nhập",
        },
       headers: {
           Authorization: `Bearer ${token}`
         }
   }
   )
 
        
         setChartData({
          labels:response.data.map((item:Access) => item.date.split(' ')[0]),
          datasets: [
              {
                  label: `Số lượng truy cập đăng nhập`,
                  data: response.data.map((item:Access) => item.mount),
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1,
              }
          ]
      });
      console.log(response.data.map((item:Access) => item.date))
     }catch(error){
         // errorSwal("Thất bại",'Có lỗi xảy ra!');
     }
  }

   const getSumAccount = async()=>{
    try{
  
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/account/sum`,
     {
      headers: {
          Authorization: `Bearer ${token}`
        }
  }
  )

        setAmountAccount(response.data);
    }catch(error){
        // errorSwal("Thất bại",'Có lỗi xảy ra!');
    }
   }


   const getActiveAccount =async()=>{
    try{
         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/account/active`,{
           headers: {
              Authorization: `Bearer ${token}`  
            }

         })
         setCounContract(response.data);
    }catch(error){
        errorSwal("Thất bại",'Có lỗi xảy ra!');
    }
}
const getInActiveAccount = async()=>{
    try{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/account/inactive`,{
           headers: {
            Authorization: `Bearer ${token}`  
          }
        })
        setCountAttendance(response.data);
   }catch(error){
       errorSwal("Thất bại",'Có lỗi xảy ra!');
   }
  }

   useEffect(()=>{
        getSumAccount();
        getActiveAccount();
        getInActiveAccount();
        getAccess();
       
       
      
        // getToTalPaymentByYearAndMonth();
        // countContractByMonthAndYear();
        // countDateAttendance();
        // countRewardPunish();
   },[]);

    if(!localStorage.getItem('username')){
        router.push('/login');
        return null;
    }
    return (
        <div className={classes.article}>
            <div className={classes.main}>
            <div className={classes.red_box}>
                <h5>Tổng số tài khoản</h5>
                <h2>{amountAccount}</h2>
            </div>
            <div className={classes.orange_box}>
                <h5>Số tài khoản hoạt động</h5>
                <h2>{ countContract}</h2>
            </div>
            <div className={classes.yellow_box}>
                <h5>Số tài khoản không hoạt động </h5>
                <h2>{countAttendance}</h2>
            </div>
            {/* <div className={classes.green_box}>
                <h5>Số lượng chấm công trong ngày {formattedDate}</h5>
                <h2>{countAttendance}</h2>
            </div> */}

            </div>
            <div className={classes.chartContainer}>
    <div className={classes.chart}>
        <Bar data={chartData} options={options} />
    </div>
    {/* <div className={classes.chart}>
        <Bar data={data2} options={options} />
    </div> */}
</div>


        </div>
    )
}
