'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './attendance.module.css'
import { faCheck, faDeleteLeft, faPlus, faRightFromBracket, faRightToBracket, faSquareArrowUpRight, faTable, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { errorAlert, errorSwal, successSwal } from '../custom/sweetalert';
import Swal from 'sweetalert2';


 interface Attendance{
    idemployee:string,
    dateattendance:string,
    date?:string;
    checkintime:string,
    checkouttime:string,
    status:string,
    attendanceStatusName?:string
    numberwork:number
 } 

 interface AttendanceExplain{
    idemployee:string;
    date:string;
    checkintime:string;
    checkoutime:string;
    explaination:string;
    status:string;
 }
 function convertToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function calculateWorkHours(startTime: string, endTime: string): number {
    const startMinutes = convertToMinutes(startTime);
    const endMinutes = convertToMinutes(endTime);

    const totalMinutes = endMinutes - startMinutes;
    const totalHours = totalMinutes / 60;

    let totalDays = 0;
    if (totalHours >= 8) totalDays = 1;
    else if (totalHours >= 6) totalDays = 0.75;
    else if (totalHours >= 4) totalDays = 0.5;
    else if (totalHours >= 2) totalDays = 0.25;
    else if (totalHours === 1) totalDays = 0.1;
    else (totalHours < 1)
     {
        totalDays = 0;
    }
    return totalDays;
}

function compareTimes(time1: string, time2: string): number {
    return convertToMinutes(time1) - convertToMinutes(time2);
}

function calculateMinutes(a:string,b:string) : number{
  const startMinutes = convertToMinutes(a);
  const endMinutes = convertToMinutes(b);
  return (endMinutes - startMinutes) / 480;
}


export default function UserAttendance(){
    const username = localStorage.getItem('username');
    const [isExplain, setIsExplain] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [attendance,setAttendance] = useState<Attendance[]>([]);
    const [attendance_explain,setAttendance_Explain] = useState<AttendanceExplain[]>([]);
    const [currentCheckIn, setCurrentCheckIn] = useState<Attendance | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [isReasonTableVisible, setIsReasonTableVisible] = useState(false);
    const getAllAttendance = async()=>{
        try{
            const response  = await axios(`http://localhost:8083/api/v1/attendance/${username}`);
            if(response.status === 200){
                setAttendance(response.data.data.reverse());
            }
        }catch(error:any){
            errorSwal("Thất bại",`${error.response.data.message}`);
        }
    }

    const getAttendanceExplain = async()=>{
      try{
        const response  = await axios(`http://localhost:8083/api/v1/attendance_explain/${username}`);
        if(response.status === 200){
            setAttendance_Explain(response.data.data.reverse());
        }
    }catch(error:any){
        errorSwal("Thất bại",`${error.response.data.message}`);
    }
    }

    useEffect(()=>{
        getAllAttendance();
        getAttendanceExplain();
    },[])
    
    const itemsPerPage = 5;
    const totalPages = Math.ceil(attendance.length / itemsPerPage);
  
    const handleCheckIn = async () => {
      const today = new Date().toISOString().slice(0, 10);
      const hasCheckedIn = attendance.some((item) => item.idemployee === `${username}` && item.dateattendance === today && item.checkintime);
   
      if (hasCheckedIn) {
        errorAlert('Bạn đã chấm công vào trong ngày hôm nay rồi.');
        
        return;
      }
  
      const newEntry: Attendance = {
        idemployee: `${username}` , 
        dateattendance: today,
        // startime: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        checkintime:new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        checkouttime: '',
        status: '',
        numberwork: 0,
        // workhours: 0
      };
      if(compareTimes(newEntry.checkintime,"17:15") >= 0){
            errorSwal('Thất bại','Ngoài thời gian chấm công');
            return;
        }
        try{
          const response = await axios.post('http://localhost:8083/api/v1/attendance',newEntry);
          if(response.status === 201){
              
            setCurrentCheckIn(newEntry);
            setAttendance([newEntry,...attendance]);
            setError(null);
                successSwal('Thành công',`${response.data.message}`);
          }
      }catch(error:any){
          errorSwal('Thất bại',`${error.response.data.message}`);
      }
        
     
    };
  
    const handleCheckOut = async () => {
      if (currentCheckIn) {
        const today = new Date().toISOString().slice(0, 10);
        const hasCheckedOut = attendance.some((item) =>
          item.idemployee === currentCheckIn.idemployee &&
          item.dateattendance === today &&
          item.checkintime &&
          item.checkouttime
        );
  
        let statusAttendance = '';
        if (hasCheckedOut) {
          setError('Bạn đã chấm công ra trong ngày hôm nay rồi.');
          return;
        }
  
        
        const endTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        // const totalAdjustedDays = calculateAdjustedDays(currentCheckIn.startime, endTime);
       
        if (compareTimes(currentCheckIn.checkintime, "08:15") > 0 && compareTimes(endTime, "16:45") > 0) {
            statusAttendance = 'Đi trễ';
        } else if (compareTimes(currentCheckIn.checkintime, "08:15") <= 0 && compareTimes(endTime, "16:45") < 0) {
           statusAttendance ='Về sớm';
        }else if(compareTimes(currentCheckIn.checkintime, "08:15") > 0 && compareTimes(endTime, "16:45") < 0){
           statusAttendance ='Đi trễ về sớm';
        } 
        else {
             statusAttendance ='Đi làm đầy đủ';
        }
        


        const updatedEntry: Attendance = {
          ...currentCheckIn,
          checkouttime: endTime,
          status:statusAttendance,
          attendanceStatusName:statusAttendance, // Hoặc tính toán trạng thái khác
          numberwork: calculateWorkHours(currentCheckIn.checkintime,endTime),
        //   workhours: totalAdjustedDays // Số công
        };


        try{
            const response = await axios.put('http://localhost:8083/api/v1/attendance',updatedEntry);
            if(response.status === 200){
                const updatedData = attendance.map((item) =>
                    item.idemployee === currentCheckIn.idemployee && item.dateattendance === currentCheckIn.dateattendance ? updatedEntry : item
                  );
                  setAttendance(updatedData);
                  setCurrentCheckIn(null);
                  setError(null);
                  successSwal('Thành công',`${response.data.message}`);
            }
        }catch(error:any){
            errorSwal('Thất bại',`${error.response.data.message}`);
        }
  
        
      }
    };
  
    const showExplain = () => {
      setIsExplain(true);
    };
  
    const hideExplain = () => {
      setIsExplain(false);
      setSelectedRowIndex(null);
    };
  
    const handlePageChange = (pageNumber: number) => {
      setCurrentPage(pageNumber);
    };
  
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = attendance.slice(indexOfFirstItem, indexOfLastItem);
    
    const toggleReasonTable = () => {
      setIsReasonTableVisible(!isReasonTableVisible);
    };
  
    const closeReasonTable = ()=>{
      setIsReasonTableVisible(false);
    }
    const handleRowSelection = (index:any) => {
      setSelectedRowIndex(index === selectedRowIndex ? null : index);
    };
    const handleSelectRow = async() => {
      if (selectedRowIndex !== null) {
        const { value: text } = await Swal.fire({
          input: "textarea",
          inputLabel: "Nhập lý do",
          inputPlaceholder: "Type your message here...",
          inputAttributes: {
            "aria-label": "Type your message here"
          },
          showCancelButton: true
        });
        const selectedRow  = {
          idemployee: attendance[selectedRowIndex].idemployee,
          date: attendance[selectedRowIndex].dateattendance,
          checkintime: attendance[selectedRowIndex].checkintime,
          checkoutime: attendance[selectedRowIndex].checkouttime,
          reason:text
        } 
       
        try{
          const response = await axios.post('http://localhost:8083/api/v1/attendance_explain',selectedRow);
          if(response.status === 201){
            successSwal("Thành công",`${response.data.message}`);
            setSelectedRowIndex(null);
            setIsExplain(false);
          }
        }catch(error:any){
          errorSwal("Thất bại",`${error.response.data.message}`);
        }
        
      }
   
    };
    return (
      <div className={classes.main_container}>
        <div className={classes.main_container_add_attendance}>
          <div className={classes.add_attendance}>
            {!isReasonTableVisible && (
              <>
               <button className={classes.check_in_button} onClick={handleCheckIn}>
              <FontAwesomeIcon icon={faRightToBracket} style={{ marginRight: '5px' }} />
              Chấm công vào
            </button>
            <button className={classes.check_out_button} onClick={handleCheckOut}>
              <FontAwesomeIcon icon={faRightFromBracket} style={{ marginRight: '5px' }} />
              Chấm công ra
            </button>
              </>
            )}
           
          </div>
          <div className={classes.add_reason}>
            {isExplain ? (
              <>
                <button onClick={handleSelectRow} >
                  <FontAwesomeIcon icon={faCheck} style={{ marginRight: '5px' }} />
                  Chọn
                </button>
                <button onClick={hideExplain}>
                  <FontAwesomeIcon icon={faTimes} style={{ marginRight: '5px' }} />
                  Hủy
                </button>
              </>
            ) : isReasonTableVisible ? (
              <button onClick={closeReasonTable}>
              <FontAwesomeIcon icon={faDeleteLeft} style={{ marginRight: '5px' }} />
              Quay lại
            </button>
            ):(
              <>
              <button onClick={showExplain}>
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />
                Thêm giải trình
              </button>
                 <button onClick={toggleReasonTable}>
                 <FontAwesomeIcon icon={faTable} style={{ marginRight: '5px' }} />
                 Bảng giải trình
               </button>
              </>
              
            )}
          </div>
        </div>
        {!isReasonTableVisible && (
        <div className={classes.main_container_table}>
          <h2>Bảng danh sách chấm công của {username}</h2>
        
          <table className={classes.attendance_table}>
            <thead>
              <tr>
                {isExplain && <th>Lựa chọn</th>}
                <th>Mã nhân viên</th>
                <th>Ngày chấm công</th>
                <th>Giờ vào</th>
                <th>Giờ ra</th>
                <th>Trạng thái</th>
                <th>Số công</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((item, index) => (
                <tr key={index}>
                  {isExplain && (
                    <td>
                      <input type="checkbox" 
                       checked={selectedRowIndex === index}
                       onChange={() => handleRowSelection(index)}
                      />
                    </td>
                  )}
                  <td>{item.idemployee}</td>
                  <td>{item.dateattendance}</td>
                  <td>{item.checkintime}</td>
                  <td>{item.checkouttime}</td>
                  <td>{item.attendanceStatusName}</td>
                  <td>{item.numberwork}</td>
                  {/* <td>{item.workhours.toFixed(2)}</td> Hiển thị số công với 2 chữ số thập phân */}
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
      )}

      {isReasonTableVisible && (
        <div className={classes.main_container_table}>
          <h2>Bảng giải trình</h2>
          <table className={classes.attendance_table}>
            <thead>
              <tr>
                <th>Mã nhân viên</th>
                <th>Ngày giải trình</th>
                <th>Giờ vào</th>
                <th>Giờ ra</th>
                <th>Lý do</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {attendance_explain.map((a,index)=>(
                  <tr key={index}>
                    <td>{a.idemployee}</td>
                    <td>{a.date}</td>
                    <td>{a.checkintime}</td>
                    <td>{a.checkoutime}</td>
                    <td>{a.explaination}</td>
                    <td>{a.status}</td>
                  </tr>
              ))}
             
            </tbody>
          </table>
        </div>
      )}
      </div>
    );
}