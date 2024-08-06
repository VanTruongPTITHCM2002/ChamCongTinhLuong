'use client'
import { useEffect, useState } from "react";
import classes from './timesheet.module.css'
import axios from "axios";
import { errorSwal } from "../custom/sweetalert";

interface WorkScheduleDetail{
    idemployee:string;
    name:string;
    workdate:string;
    startime:string;
    endtime:string;
}
 function formatDate(dateString:string) {
     const date = new Date(dateString);
     const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng từ 0-11, cần +1
     const day = String(date.getDate()).padStart(2, '0');
     const year = date.getFullYear();
     return `${day}-${month}-${year}`;
   }
export default function UserTimeSheet(){
   const username = localStorage.getItem('username');
   const [showWorkScheduleDetail,setShowWorkScheduleDetail] = useState<WorkScheduleDetail[]>([]);
   const getWorkScheduleDetailById = async()=>{
        try{
            const res = await axios.get(`http://localhost:8084/api/v1/workscheduledetail/${username}`);
            if(res.status === 200){
                setShowWorkScheduleDetail(res.data.data);
            } 
        }catch(error:any){
            errorSwal('Thất bại',"Có lỗi xảy ra");
            console.log(1);
        }
   }

   useEffect(()=>{
        getWorkScheduleDetailById();
   },[])

    return (
        <div className={classes.main_container}>
            <div className={classes.timeSheetTitle}>
                <h2>Danh sách lịch làm việc của nhân viên {username}</h2>
            </div>
          


            <table className={classes.work_schedule}>
            <thead>
                    <tr>
                       <th>Mã nhân viên</th>
                       <th>Họ tên nhân viên</th>
                       <th>Ngày làm việc</th>
                       <th>Giờ bắt đầu</th>
                       <th>Giờ kết thúc</th>
                    </tr>
                </thead>
                <tbody>
                    {showWorkScheduleDetail.map((s,index)=>(
                            <tr key={index}>
                                <td>{s.idemployee}</td>
                                <td>{s.name}</td>
                                <td>{formatDate(s.workdate)}</td>
                                <td>{s.startime}</td>
                                <td>{s.endtime}</td>
                            </tr>
                    ))}
                   
                </tbody>
            </table>
        </div>
    )
}