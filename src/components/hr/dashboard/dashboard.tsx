'use client'
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css'
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie'
import { BarElement, CategoryScale, Chart, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import axios from 'axios';
import { errorSwal } from '@/custom/sweetalert';
import { Bar } from 'react-chartjs-2';
Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tháng'
        }
      },
      y: {
        title: {
          display: true,
          text: 'VNĐ'
        },
        ticks: {
          // Định dạng các nhãn trên trục y thành tiền VNĐ
          callback: function (value: number | string): string {
            return Number(value).toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            });
          }
        }
      }
    }
  };
const formattedAmount = (num:number | Float32Array)=>{
   return num.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
}
  

export default function HR_Dashboard(){
    const router = useRouter();
   const [amountEmployee,setAmountEmployee] = useState(0);
   const [totalPayment,setTotalPayment] = useState(0);
   const [countContract,setCounContract] = useState(0);
   const [countAttendance,setCountAttendance] = useState(0);
   const [arrReward,setArrReward] = useState<number[]>([]);
   const [arrPunish,setArrPunish] = useState<number[]>([]);
    const token = Cookies.get('token')
    const currentDate = new Date();
   
    const formattedDate = currentDate.toLocaleDateString('en-CA');
    console.log(currentDate + "---" + formattedDate);
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const data1 = {
  labels: ['0','1', '2', '3', '4', '6', '7','8','9','10','11','12'],
  datasets: [
      {
          label: 'Thưởng',
          data: arrReward,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
      }
  ]
};


const data2 = {
    labels: ['0','1', '2', '3', '4', '6', '7','8','9','10','11','12'],
  datasets: [
      {
          label: 'Phạt',
          data: arrPunish,
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
      }
  ]
};

   const getAmountEmployee = async()=>{
    try{
        // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/employee/amount`, {
        //     headers: {
        //       Authorization: `Bearer ${token}`
        //     }
        //   });
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/employee/amount`,
     {
      headers: {
          Authorization: `Bearer ${token}`
        }
  }
  )

        setAmountEmployee(response.data.data);
    }catch(error){
        errorSwal("Thất bại",'Có lỗi xảy ra!');
    }
   }

   const getToTalPaymentByYearAndMonth =async()=>{
        try{
             const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/payroll/totalPayment`,{
                params:{
                    month:currentMonth,
                    year:currentYear
                }, headers: {
                  Authorization: `Bearer ${token}`  
                }
             })
             setTotalPayment(response.data);
        }catch(error){
            errorSwal("Thất bại",'Có lỗi xảy ra!');
        }
   }

   const countContractByMonthAndYear =async()=>{
    try{
         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/contract/countContract`,{
            params:{
                month:currentMonth,
                year:currentYear
            },headers: {
              Authorization: `Bearer ${token}`  
            }

         })
         setCounContract(response.data);
    }catch(error){
        errorSwal("Thất bại",'Có lỗi xảy ra!');
    }
}
const countDateAttendance = async()=>{
    try{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/attendance/countDate`,{
           params:{
             date:formattedDate.replace(/-/g, '/')
           },  headers: {
            Authorization: `Bearer ${token}`  
          }
        })
        setCountAttendance(response.data);
   }catch(error){
       errorSwal("Thất bại",'Có lỗi xảy ra!');
   }
}
const countRewardPunish = async()=>{
    try{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/rewardpunish/countRewardPunish`,{
           params:{
             year:currentYear
           }, headers: {
            Authorization: `Bearer ${token}`  
          }

        })

        setArrReward(response.data[0]);
        setArrPunish(response.data[1]);
   }catch(error){
       errorSwal("Thất bại",'Có lỗi xảy ra!');
   }
}
   useEffect(()=>{
        getAmountEmployee();
        getToTalPaymentByYearAndMonth();
        countContractByMonthAndYear();
        countDateAttendance();
        countRewardPunish();
   },[]);

    if(!localStorage.getItem('username')){
        router.push('/login');
        return null;
    }
    return (
        <div className={styles.article}>
            <div className={styles.main}>
            <div className={styles.red_box}>
                <h5>Tổng số nhân viên</h5>
                <h2>{amountEmployee}</h2>
            </div>
            <div className={styles.orange_box}>
                <h5>Tổng lương đã trả trong tháng {currentMonth}</h5>
                <h2>{ formattedAmount(totalPayment)}</h2>
            </div>
            <div className={styles.yellow_box}>
                <h5>Số lượng hợp đồng trong tháng {currentMonth} </h5>
                <h2>{countContract}</h2>
            </div>
            <div className={styles.green_box}>
                <h5>Số lượng chấm công trong ngày {formattedDate}</h5>
                <h2>{countAttendance}</h2>
            </div>

            </div>
            <div className={styles.chartContainer}>
    <div className={styles.chart}>
        <Bar data={data1} options={options} />
    </div>
    <div className={styles.chart}>
        <Bar data={data2} options={options} />
    </div>
</div>


        </div>
    )
}

