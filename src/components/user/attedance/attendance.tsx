'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './attendance.module.css'
import { faCheck, faPlus, faRightFromBracket, faRightToBracket, faSquareArrowUpRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { errorAlert, errorSwal, successSwal } from '../custom/sweetalert';


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


export default function UserAttendance(){
    const username = localStorage.getItem('username');
    const [isExplain, setIsExplain] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [stausAttendance,setStatusAttendance] = useState<string>("");
    const [attendance,setAttendance] = useState<Attendance[]>([]);
    const [currentCheckIn, setCurrentCheckIn] = useState<Attendance | null>(null);
    const [error, setError] = useState<string | null>(null);

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

    useEffect(()=>{
        getAllAttendance();
    },[])
    
    const itemsPerPage = 5;
    const totalPages = Math.ceil(attendance.length / itemsPerPage);
  
    const handleCheckIn = () => {
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
      setCurrentCheckIn(newEntry);
      setAttendance([newEntry,...attendance]);
      setError(null);
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
  
        if (hasCheckedOut) {
          setError('Bạn đã chấm công ra trong ngày hôm nay rồi.');
          return;
        }
  
        
        const endTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        // const totalAdjustedDays = calculateAdjustedDays(currentCheckIn.startime, endTime);
       
        if (compareTimes(currentCheckIn.checkintime, "08:15") > 0 && compareTimes(endTime, "16:45") > 0) {
            setStatusAttendance('Đi trễ');
        } else if (compareTimes(currentCheckIn.checkintime, "08:15") <= 0 && compareTimes(endTime, "16:45") < 0) {
            setStatusAttendance('Về sớm');
        } else {
            setStatusAttendance('Đi làm đầy đủ');
        }
        


        const updatedEntry: Attendance = {
          ...currentCheckIn,
          checkouttime: endTime,
          status:stausAttendance,
          attendanceStatusName:stausAttendance, // Hoặc tính toán trạng thái khác
          numberwork: calculateWorkHours(currentCheckIn.checkintime,endTime),
        //   workhours: totalAdjustedDays // Số công
        };


        try{
            const response = await axios.post('http://localhost:8083/api/v1/attendance',updatedEntry);
            if(response.status === 201){
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
    };
  
    const handlePageChange = (pageNumber: number) => {
      setCurrentPage(pageNumber);
    };
  
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = attendance.slice(indexOfFirstItem, indexOfLastItem);
  
    return (
      <div className={classes.main_container}>
        <div className={classes.main_container_add_attendance}>
          <div className={classes.add_attendance}>
            <button className={classes.check_in_button} onClick={handleCheckIn}>
              <FontAwesomeIcon icon={faRightToBracket} style={{ marginRight: '5px' }} />
              Chấm công vào
            </button>
            <button className={classes.check_out_button} onClick={handleCheckOut}>
              <FontAwesomeIcon icon={faRightFromBracket} style={{ marginRight: '5px' }} />
              Chấm công ra
            </button>
          </div>
          <div className={classes.add_reason}>
            {isExplain ? (
              <>
                <button>
                  <FontAwesomeIcon icon={faCheck} style={{ marginRight: '5px' }} />
                  Chọn
                </button>
                <button onClick={hideExplain}>
                  <FontAwesomeIcon icon={faTimes} style={{ marginRight: '5px' }} />
                  Hủy
                </button>
              </>
            ) : (
              <button onClick={showExplain}>
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />
                Thêm giải trình
              </button>
            )}
          </div>
        </div>
  
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
                      <input type="checkbox" />
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
      </div>
    );
}