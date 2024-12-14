'use client'
import { useEffect, useState } from "react";
import classes from './timesheet.module.css'
import axios from "axios";
import { errorSwal } from '@/custom/sweetalert';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Cookies from 'js-cookie'
interface WorkScheduleDetail{
    idEmployee:string;
    workdate:string;
    startTime:string;
    endTime:string;
}
 function formatDate(dateString:string) {
     const date = new Date(dateString);
     const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng từ 0-11, cần +1
     const day = String(date.getDate()).padStart(2, '0');
     const year = date.getFullYear();
     return `${day}-${month}-${year}`;
   }
export default function UserTimeSheet(){
    let username = '';
    if (typeof window !== 'undefined'){
     username = localStorage.getItem('username')!;
    }
   const token = Cookies.get('token')
   const [showWorkScheduleDetail,setShowWorkScheduleDetail] = useState<WorkScheduleDetail[]>([]);
   const [workscheduledetail,setWorkscheduledetail] = useState<WorkScheduleDetail[]>([]);
   const [searchTerm, setSearchTerm] = useState('');
   const [currentPage, setCurrentPage] = useState(1);
   const [itemsPerPage] = useState(7);
   const totalPages = Math.ceil(workscheduledetail.length / itemsPerPage);
    
   const handlePageChange = (pageNumber:number) => {
     setCurrentPage(pageNumber);
   };
   const getWorkScheduleDetailById = async()=>{
        try{
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/workscheduledetail/${username}`,{
                headers: {
                    Authorization: `Bearer ${token}`  
                  }
            });
            if(res.status === 200){
                setShowWorkScheduleDetail([...res.data.data].reverse());
                setWorkscheduledetail([...res.data.data].reverse())
            } 
        }catch(error:any){
            errorSwal('Thất bại',"Có lỗi xảy ra");
            console.log(1);
        }
   }

   useEffect(()=>{
        getWorkScheduleDetailById();
   },[])
   const handleSearch = (event:React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
  };


  const currentData = searchTerm ? 
  workscheduledetail.filter(
      (item) =>
        item.idEmployee!.includes(searchTerm) ||
        item.workdate.includes(searchTerm)
        || item.endTime.includes(searchTerm) ||
        item.startTime.includes(searchTerm) 
       
      
    ).slice((currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage) 
  :
  workscheduledetail.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    )
    return (
        <div className={classes.main_container}>
            <div className={classes.timeSheetTitle}>
                <h2>Danh sách lịch làm việc của nhân viên {username}</h2>
            </div>
          
            <div>

                
            <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={e=>(setSearchTerm(e.target.value))}
                        style={{ marginBottom: '10px' }}
                    />
{/* 
                    <button className={classes.btnSearch} onClick={searchTimeSheet}>
                        <FontAwesomeIcon icon={faSearch} style={
                            { marginRight: "5px" }
                        } />
                   </button> */}
            </div>

            <table className={classes.work_schedule}>
            <thead>
                    <tr>
                       <th>Mã nhân viên</th>
                       {/* <th>Họ tên nhân viên</th> */}
                       <th>Ngày làm việc</th>
                       <th>Giờ bắt đầu</th>
                       <th>Giờ kết thúc</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((s,index)=>(
                            <tr key={index}>
                                <td>{s.idEmployee}</td>
                                {/* <td>{s.name}</td> */}
                                <td>{formatDate(s.workdate)}</td>
                                <td>{s.startTime}</td>
                                <td>{s.endTime}</td>
                            </tr>
                    ))}
                   
                </tbody>
            </table>

            <div className={classes.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? classes.active : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
        </div>
    )
}