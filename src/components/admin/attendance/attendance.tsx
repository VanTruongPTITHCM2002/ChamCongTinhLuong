'use client'
import { FormEvent, useEffect, useRef, useState } from 'react'
import classes from './attendance.module.css'
import axios from 'axios';
import Modal from '@/components/modal';
import Swal from 'sweetalert2';

interface Attendance{
    idemployee:string;
    dateattendance?:string;
    checkintime:string;
    checkouttime?:string;
    status?:string | number;
    attendanceStatusName?:string,
    description?:string,
    explaination?:string,
    numberwork?:number;
}

interface Attendance_Explain{
    idemployee:string;
    date:string;
    checkintime:string;
    checkoutime:string;
    explaination?:string;
    status:string
}
interface IFEmployee{
    id:string;
}

interface Filter{
    idemployee:string;
}

interface WorkRecord{
    idemployee: string;
    month: number;
    year: number;
    day_work?:Float32Array;
}

export default function AdminAttendancePage(){

    const [isUpdate,setIsUpdate]= useState(false);
    const [workRecord,setWorkRecord] = useState(false);
    const [attendanceExplain,setAttendanceExplain] = useState(false);
    const [modal,setModal] = useState(false);
    const [changeStatus,setChangeStatus] = useState(false);
    const [attendance,setAttendance] = useState<Attendance[]>([]);
    const [attedance_explain,setAttendance_Explain] = useState<Attendance_Explain[]>([]);
    const [option,setOption] = useState<string>('');
    const [selectedEmployee, setSelectedEmployee] = useState<string>('');
    const [idEmployee,setIdEmployee] = useState<IFEmployee[]>([]);
    const [workRecordList,setWorkRecordList] = useState<WorkRecord[]>([]);
    const inputRefs = useRef<Record<number, any>>({});
    const customModalStyles = {
        width: '50%', // Tùy chỉnh độ rộng của modal
        height: '50%', // Tùy chỉnh chiều cao của modal
    };
    const statusOptions = [
        { value: 'Đi trễ', label: 'Đi trễ' },
        { value: 'Về sớm', label: 'Về sớm' },
        { value: 'Đi sớm', label: 'Đi sớm' },
        { value: 'Nghỉ phép', label: 'Nghỉ phép' },
        { value: 'Không phép', label: 'Không phép' },
        { value: 'Ngày nghỉ', label: 'Ngày nghỉ' },
        { value: 'Đi làm đầy đủ', label: 'Đi làm đầy đủ' },
        { value: 'Nghỉ bù', label: 'Nghỉ bù' },
        { value: 'Làm thêm giờ', label: 'Làm thêm giờ' },
        { value: 'Công tác', label: 'Công tác' }
      ];

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
  
    const handleClickWorkRecord = async()=>{
        try{
            const response = await axios.get('http://localhost:8083/api/v1/workrecord');
            if(response.status === 200){
                setWorkRecordList(response.data.data);
            }
        }catch(error){
            alert("xảy ra lỗi trong quá trình call API");
        }
        setWorkRecord(true);
        setOption('workrecord');
    }

    const handleBack = (num:number)=>{
        
        setWorkRecord(false);

        setAttendanceExplain(false);
    }

    const handleCliCkAttendanceExplain = async ()=>{
        try{
            const response = await axios.get('http://localhost:8083/api/v1/attendance_explain');
            if(response.status === 200){
                setAttendance_Explain(response.data.data);
            }
        }catch(error){
            alert("Xảy ra lỗi trong quá trình lấy dữ liệu");
        }
        setOption('attedance_explain')
        setAttendanceExplain(true);
    }
    
    const handleCancel = ()=>{
        setIsUpdate(false);
        setChangeStatus(false);
    }

    const handleModalAddWorkRecord = ()=>{
        setModal(true);
    }
    const closeModal = () => {
        setModal(false);
    };

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
            attendanceStatusName: inputRefs.current[index]?.status?.value || attendance[index].status,
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

    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event:any) => {
        setInputValue(event.target.value);
    };

    const buttonSearch = async (str:string)=>{

        const filter:Filter ={
            idemployee:inputValue
        } 
        try {
            if(str === 'workrecord'){
                const response = await axios.post('http://localhost:8083/api/v1/workrecord/filter', filter
                );
              
                setWorkRecordList(response.data.data);
            }else if(str === 'attedance_explain'){
                const response = await axios.post('http://localhost:8083/api/v1/attendance_explain/filter', filter
                );
                setAttendance_Explain(response.data.data);
            }
          
           
          
          } catch (error) {
            console.error('There was an error fetching the data!', error);
          }
          
    }

    const buttonAddWorkRecord = async (event:FormEvent)=>{
        event.preventDefault();
    const formElement = document.getElementById('form_add_work_record') as HTMLFormElement;
    if (!formElement) {
        console.error('Form element not found');
        return;
    }

    const form = new FormData(formElement);
    const workRecord:WorkRecord ={
        idemployee:form.get('manv') as string,
        month: Number(form.get('month') as string),
        year: Number(form.get('year') as string),
    }
    
    const date = new Date();
    if(workRecord.year > date.getFullYear()){
        Swal.fire({
            title: "Thất bại",
            text: "Vui lòng chọn năm hiện tại",
            icon: "error"
          });
        return;
    }
  
    if(workRecord.month !== (date.getMonth()+1)){
        Swal.fire({
            title: "Thất bại",
            text: "Vui lòng chọn tháng hiện tại",
            icon: "error"
          });
        return;
    }

    try {
        const response = await axios.post('http://localhost:8083/api/v1/workrecord', workRecord);
        console.log('Response:', response.data.message);
        if(response.status === 400){
            alert(response.data.status);
        }
        alert("Thêm bảng ghi công thành công");
    } catch (error:any) {
        if (error.response) {
            // Server đã trả về lỗi với mã lỗi và dữ liệu lỗi
            alert( error.response.data.message);
        }
        
    }
    }

    const handleShowDetail =(reason:string | undefined)=>{
        Swal.fire({
            text:`${reason}`
        })
    }
    const buttonChangeStatus = ()=>{
        setChangeStatus(true);
    }
    const buttonUpdateAttendanceExplain = async (index:number)=>{
        const updatedAttendanceExplain: Attendance_Explain = {
            ...attedance_explain[index],
            status: inputRefs.current[index]?.status?.value || attendance[index].status,
          };
        try{
            const response = await axios.put('http://localhost:8083/api/v1/attendance_explain',updatedAttendanceExplain);
            if(response.status === 200){
                alert(response.data.message);
                setAttendance_Explain((prevAttendanceExplain) => {
                    const newAttendanceExplain = [...prevAttendanceExplain];
                    newAttendanceExplain[index] = updatedAttendanceExplain;
                    return newAttendanceExplain;
                  });
            }
        }catch(error){
            alert('Xảy ra lỗi trong quá trình call API');
        }
        setChangeStatus(false);
    }
    return (
        <div className={classes.article}>
            <div className={classes.article_option}>
                
                <div className={classes.article_option_select}>
            
            {!workRecord && !attendanceExplain?(
                    <>
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
                    </>
            ):(
                 <>
                    <input style={{ height: '30px',marginRight:'5px'}}   value={inputValue} 
                onChange={handleInputChange}  type='text'/>
                    <button className={classes.btn_search} onClick={()=>buttonSearch(option)}>Tìm kiếm</button>
                 </>   
            )}
         
            </div>
                <div className={classes.article_option_button}>
                    {workRecord ? (
                        <div>
                            <button onClick={handleModalAddWorkRecord}>Thêm bảng ghi công</button>
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
                            <th>Tháng</th>
                            <th>Năm</th>
                            <th>Tổng ngày công</th>
                        </tr>
                    </thead>

                    <tbody>
                        {workRecordList.map((workRecord,index)=>(
                            <tr key={index}>
                                <td>{workRecord.idemployee}</td>
                                <td>{workRecord.month}</td>
                                <td>{workRecord.year}</td>
                                <td>{workRecord.day_work}</td>
                            </tr>
                        ))}
                      
                    </tbody>
                </table>
                </>
            )
        : attendanceExplain? (
            <table>
            <thead>
                <tr>
                    <th>Mã nhân viên</th>
                    <th>Ngày chấm công</th>
                    <th>Giờ vào</th>
                    <th>Giờ ra</th>
                    <th>Giải thích lý do</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                </tr>
            </thead>

            <tbody>
                {attedance_explain.map((e,index)=>(
                    <tr key={index}>
                    <td>{e.idemployee}</td>
                    <td>{e.date}</td>
                    <td>{e.checkintime}</td>
                    <td>{e.checkoutime}</td>

                    <td>
                        <button onClick={()=> handleShowDetail(e.explaination)}>Xem chi tiết</button>   
                    </td>
                    <td>
                        {!changeStatus?
                        (
                            e.status
                        ):(
                             <select defaultValue={e.status}
                             ref={(el) => (inputRefs.current[index] = { ...inputRefs.current[index], status: el })}
                             >
                            <option value="Đang chờ duyệt">Đang chờ duyệt</option>
                            <option value="Duyệt">Duyệt</option>
                            <option value="Không duyệt">Không duyệt</option>
                        </select>
                        )}

                       
                       </td>

                    <td>
                        {!changeStatus?
                        (
                          <button onClick={buttonChangeStatus}>Thay đổi</button>    
                        ):(
                            <div className={classes.button_explain}>
                                <button onClick={()=>buttonUpdateAttendanceExplain(index)}>Lưu</button>
                                <button onClick={handleCancel}>Hủy</button>
                            </div>
                            
                        )}
                      
                        
                    </td>
                </tr>
                ))
                
            }
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
                <select
                defaultValue={attend.attendanceStatusName}
                ref={(el) => (inputRefs.current[index] = { ...inputRefs.current[index], status: el })}
              >
                <option value="">Chọn trạng thái</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
                </td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={attend.numberwork}
                    ref={(el) => (inputRefs.current[index] = { ...inputRefs.current[index], numberwork: el })}
                  />
                </td>
                <td>
                    <button  className={classes.btn_update} onClick={() => handleClickSave(index)}>Lưu</button>

                    <button  className={classes.btn_update} onClick={handleCancel}>Hủy</button>
                </td>
              </>
                            </>
                        ): 
                    (
                            <>
                              <td>{attend.checkintime}</td>
                        <td>{attend.checkouttime}</td>
                        <td>{attend.attendanceStatusName}</td>
                        <td>{attend.numberwork}</td>
                        <td><button onClick={handleClickUpdate}>Chỉnh sửa</button></td>
                            </>
                    )}
                      
                    </tr>
                ))}
              
            </tbody>
        </table>)
        }

<div id="modal-root"> {modal && (
                <Modal onClose={closeModal}  customStyles={customModalStyles}>
                    <form id='form_add_work_record' className={classes.form_add_work_record}>
                        <h2>Thêm tháng ghi ngày công cho nhân viên</h2>
                        <div>
                            <label htmlFor="manv">Mã nhân viên:</label>
                        <select id='manv' name='manv'  value={selectedEmployee}
                onChange={handleSelectChange} required>
                                            {idEmployee.map((employee) => (
                                                <option key={employee.id} value={employee.id}>
                                                    {employee.id}
                                                </option>
                                            ))}
                                    </select>
                        </div>

                        <div>
                            <label htmlFor='month'>Tháng:</label>
                            <input id='month'  name='month' type='number' max={12} min={1} maxLength={2}/>
                        </div>

                        <div>
                            <label htmlFor='year'>Năm:</label>
                            <input id='year' name='year' type='number' max={2030} min={2024} maxLength={4}/>
                        </div>

                        <div className={classes.form_add_work_record_button}>
                            <button onClick={buttonAddWorkRecord}>Thêm</button>
                            <button onClick={closeModal}>Hủy</button>
                        </div>
                    </form>
                </Modal>
)}
        </div>
        </div>
    )
}