'use client'
import { useEffect, useRef, useState } from 'react'
import classes from './attendance.module.css'
import axios from 'axios';

interface Attendance{
    idemployee:string;
    dateattendance:string;
    checkintime:string;
    checkouttime:string
    status:string;
    numberwork?:number;
}
interface IFEmployee{
    id:string;
}

interface Filter{
    idemployee:string;
}

export default function AdminAttendancePage(){

    const [isUpdate,setIsUpdate]= useState(false);
    const [workRecord,setWorkRecord] = useState(false);
    const [attendanceExplain,setAttendanceExplain] = useState(false);
    const [attendance,setAttendance] = useState<Attendance[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<string>('');
    const [idEmployee,setIdEmployee] = useState<IFEmployee[]>([]);
    const inputRefs = useRef<Record<number, any>>({});
    useEffect(()=>{
         

        fetchAttendance();
        getIDemployee();
    },[])


    
    const fetchAttendance = async () => {
        try {
            const response = await axios.get('http://localhost:8083/api/v1/attendance');
            setAttendance(response.data.data);
        } catch (error) {
            console.error('Error fetching employee ID:', error);
        }
    };

    const getIDemployee = async ()=>{
        try {
            const response = await axios.get('http://localhost:8084/api/v1/workschedule/getidemp');
            console.log(response.data);
            setIdEmployee(response.data);
        
        } catch (error) {
            console.error('Error fetching id employee:', error);
        }
    
    }
  
    const handleClickWorkRecord = ()=>{
        setWorkRecord(true);
    }

    const handleBack = (num:number)=>{
        
        setWorkRecord(false);

        setAttendanceExplain(false);
    }

    const handleCliCkAttendanceExplain = ()=>{
        setAttendanceExplain(true);
    }
    

    const handleSelectChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    
        const selectedId = event.target.value;
        setSelectedEmployee(selectedId);
    };
    const handleButtonClick = async ()=>{
        const filter:Filter ={
            idemployee:selectedEmployee
        } 
        try {
          const response = await axios.post('http://localhost:8083/api/v1/attendance/filter', filter
          );
        
          setAttendance(response.data.data);
        
        } catch (error) {
          console.error('There was an error fetching the data!', error);
        }
        
    }

    const handleClickUpdate = ()=>{
        setIsUpdate(true);
    }
    const handleClickSave = async (index:number)=>{
        const updatedAttendance: Attendance = {
            ...attendance[index],
            checkintime: inputRefs.current[index]?.checkintime?.value || attendance[index].checkintime,
            checkouttime: inputRefs.current[index]?.checkouttime?.value || attendance[index].checkouttime,
            status: inputRefs.current[index]?.status?.value || attendance[index].status,
            numberwork: parseFloat(inputRefs.current[index]?.numberwork?.value) || attendance[index].numberwork,
          };
        try{
            const response = await axios.put('http://localhost:8083/api/v1/attendance',updatedAttendance);
            if(response.status === 200){
                alert(response.data.message);
                setAttendance((prevAttendance) => {
                    const newAttendance = [...prevAttendance];
                    newAttendance[index] = updatedAttendance;
                    return newAttendance;
                  });
            }
        }catch(error){
            alert('Xảy ra lỗi trong quá trình call API');
        }
        setIsUpdate(false);
    }
    return (
        <div className={classes.article}>
            <div className={classes.article_option}>
                
                <div className={classes.article_option_select}>
            

            <select id='manv' name='manv'  value={selectedEmployee}
                onChange={handleSelectChange} required>
                    <option value={'all'}>--Tất cả--</option>
                                            {idEmployee.map((employee) => (
                                                <option key={employee.id} value={employee.id}>
                                                    {employee.id}
                                                </option>
                                            ))}
                                    </select>
                                    <button className={classes.btn_search} onClick={handleButtonClick}>Tìm kiếm</button>
            </div>
                <div className={classes.article_option_button}>
                    {workRecord ? (
                        <div>
                            <button onClick={()=>handleBack(2)}>Quay lại</button>
                        </div>
                    ) : attendanceExplain ? (
                        <div>
                        <button onClick={()=>handleBack(3)}>Quay lại</button>
                    </div>
                    ):(
                        <>
                                <div className={classes.article_option_button_workrecord}>
                                    <button onClick={handleClickWorkRecord}>Bảng ngày ghi công</button>
                                </div>

                                <div className={classes.article_option_button_explain}>
                                    <button onClick={handleCliCkAttendanceExplain}>Bảng giải trình</button>
                                </div>
                        </>
                    )}
               
                </div>
            </div>
            {workRecord ?
            (
                <>
                <table>
                    <thead>
                        <tr>
                            <th>Mã nhân viên</th>
                            <th>Họ tên nhân viên</th>
                            <th>Tháng</th>
                            <th>Năm</th>
                            <th>Tổng ngày công</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>NV001</td>
                            <td>Nguyễn Văn Trường</td>
                            <td>5</td>
                            <td>2024</td>
                            <td>25</td>
                        </tr>
                    </tbody>
                </table>
                </>
            )
        : attendanceExplain? (
            <table>
            <thead>
                <tr>
                    <th>Mã nhân viên</th>
                    <th>Họ tên nhân viên</th>
                    <th>Ngày chấm công</th>
                    <th>Giờ vào</th>
                    <th>Giờ ra</th>
                    <th>Giải thích lý do</th>
                    <th>Trạng thái</th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td>NV001</td>
                    <td>Nguyễn Văn Trường</td>
                    <td>23/11/223</td>
                    <td>08:11</td>
                    <td>17:30</td>
                    <td><button>Xem chi tiết</button></td>
                    <td>
                        <select>
                            <option>Đang chờ duyệt</option>
                            <option>Duyệt</option>
                            <option>Không duyệt</option>
                        </select>
                       </td>
                </tr>
            </tbody>
        </table>
        ) :
        ( <table>
            <thead>
                <tr>
                    <th>Mã nhân viên</th>
                    <th>Ngày chấm công</th>
                    <th>Giờ vào</th>
                    <th>Giờ ra</th>
                    <th>Trạng thái</th>
                    <th>Tính công</th>
                    <th>Thao tác</th>
                </tr>
            </thead>

            <tbody>
                {attendance.map((attend,index) => (
                    <tr key={index}>
                        <td>{attend.idemployee}</td>
                        <td>{attend.dateattendance}</td>
                        {isUpdate?
                        (
                            <>
                               <>
                <td>
                  <input
                    type="time"
                    defaultValue={attend.checkintime}
                    ref={(el) => (inputRefs.current[index] = { ...inputRefs.current[index], checkintime: el })}
                  />
                </td>
                <td>
                  <input
                    type="time"
                    defaultValue={attend.checkouttime}
                    ref={(el) => (inputRefs.current[index] = { ...inputRefs.current[index], checkouttime: el })}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    defaultValue={attend.status}
                    ref={(el) => (inputRefs.current[index] = { ...inputRefs.current[index], status: el })}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={attend.numberwork}
                    ref={(el) => (inputRefs.current[index] = { ...inputRefs.current[index], numberwork: el })}
                  />
                </td>
                <td><button onClick={() => handleClickSave(index)}>Lưu</button></td>
              </>
                            </>
                        ): 
                    (
                            <>
                              <td>{attend.checkintime}</td>
                        <td>{attend.checkouttime}</td>
                        <td>{attend.status}</td>
                        <td>{attend.numberwork}</td>
                        <td><button onClick={handleClickUpdate}>Chỉnh sửa</button></td>
                            </>
                    )}
                      
                    </tr>
                ))}
              
            </tbody>
        </table>)
        }


        </div>
    )
}