'use client'
import { FormEvent, useRef, useState } from 'react';
import classes from './workschedule.module.css'
import {format,addWeeks, subWeeks,startOfWeek,endOfWeek, set} from 'date-fns';
import { vi } from 'date-fns/locale';
import Modal from '@/components/modal';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCirclePlus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { error } from 'console';
import { errorSwal } from '@/components/user/custom/sweetalert';
interface IFEmployee{
    id?:string;
    idemployee?:string,
    firstname?:string;
    lastname?:string;
    name?:string;
    workdate?:string;
    startime?:string;
    endtime?:string;
}
interface newIFEMployee{
    idemployee:string,
    name:string;
    workdate:string;
    startime:string;
    endtime:string;
}
interface WorkSchedule{
    workdate:string;
    startime:string;
    endtime:string;
}

interface workDate{
    date: string;
}

export default function WorkSchedule(){
   
    const dateRef = useRef<HTMLInputElement>(null);
    const [date,setDate] = useState(new Date());    
    const [isSelected, setIsSelected] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [idEmployee,setIdEmployee] = useState<IFEmployee[]>([]);
    const [workEmoloyee,setWorkEmployee] = useState<newIFEMployee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<string>('');
    const [employeeDetails, setEmployeeDetails] = useState<IFEmployee | null>(null);
    const handlePrevDay = () => {
        setDate(prevDate => subWeeks(prevDate, 1));
      };
    
      const handleNextDay = () => {
        setDate(prevDate => addWeeks(prevDate, 1));
      };
      const startOfWeekDate = startOfWeek(date, { weekStartsOn: 1 });
  const endOfWeekDate = endOfWeek(date, { weekStartsOn: 1 });

  const handleAddWorkSchedule = async ()=>{
    try {
        const response = await axios.get('http://localhost:8084/api/v1/workschedule/getidemp');
        console.log(response.data);
        setIdEmployee(response.data);
        if (response.data.length > 0) {
            const firstEmployeeId = response.data[0].id;
            fetchEmployeeDetails(firstEmployeeId);
          }
    } catch (error) {
        console.error('Error fetching id employee:', error);
    }
        setIsSelected(true)
  }

  const handleDetailWorkSchedule = async  (dayOffset: number) => {
  
    
    const currentDay = startOfWeekDate.getDay(); // Ngày hiện tại trong tuần (0: Chủ nhật, 1: Thứ hai, ..., 6: Thứ bảy)

    // Tính toán ngày đầu tuần (Thứ 2 của tuần này)
    const startOfWeek = new Date(startOfWeekDate);
    startOfWeek.setDate(startOfWeekDate.getDate()); // Điều chỉnh để có Chủ nhật

    // Tính toán ngày được chọn
    const selectedDay = new Date(startOfWeek);
    selectedDay.setDate(startOfWeek.getDate() + dayOffset); // Thêm số ngày tương ứng

    // Định dạng ngày thành chuỗi YYYY-MM-DD
    const formattedDate = selectedDay.toISOString().split('T')[0];
    setSelectedDate(formattedDate);
    const work:workDate={
        date:formattedDate
    }
    try {
        const response = await axios.post('http://localhost:8084/api/v1/workschedule/workdate', {date:formattedDate});
        console.log('Response:', response.data);
        if(response.status === 400){
            alert(response.data.status);
        }
        setWorkEmployee(response.data)
        
        setShowModal(true);
        
    } catch (error:any) {
        if (error.response) {
            // Server đã trả về lỗi với mã lỗi và dữ liệu lỗi
            alert( error.response.data.message);
            setShowModal(false);
        }
        
    }
   
  };

  const handleCloseModal = () => {
    setIsSelected(false)      
    setShowModal(false);
    };

const handleBack = (event: React.MouseEvent<HTMLButtonElement>)=>{
    event.preventDefault();
    setShowModal(true);
    setIsSelected(false)  
}

const handleCancel = (event: React.MouseEvent<HTMLButtonElement>)=>{
    if (dateRef.current) dateRef.current.value='';
    event.preventDefault();
}
const handleSelectChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    
    const selectedId = event.target.value;
    setSelectedEmployee(selectedId);
    fetchEmployeeDetails(selectedId);

};
const fetchEmployeeDetails = async (id: string) => {
    try {
      const response = await axios.get<IFEmployee>(`http://localhost:8084/api/v1/workschedule/${id}`);
      setEmployeeDetails(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching employee details:', error);
      setEmployeeDetails(null); // Reset details if there is an error
    }
  };

  const handleAddWorkScheduleDate = async (event:FormEvent)=>{
    event.preventDefault();
    const formElement = document.getElementById('form-add-work-date') as HTMLFormElement;
    if (!formElement) {
        console.error('Form element not found');
        return;
    }
    

    const form = new FormData(formElement);
    const workschedule:WorkSchedule ={
        workdate:form.get('workdate') as string,
        startime:form.get('startime') as string,
        endtime: form.get('endtime') as string
    }

    if(workschedule.workdate.trim() === ''){
        errorSwal("Thất bại","Vui lòng chọn ngày");
        return;
    }
    const currentDay = new Date(workschedule.workdate).getDay();
    if(currentDay === 0){
        errorSwal("Thất bại","Vui lòng không chọn chủ nhật");
        return;
    }
    
    try {
        const response = await axios.post('http://localhost:8084/api/v1/workschedule', workschedule);
        console.log('Response:', response.data.message);
        if(response.status === 400){
            alert(response.data.status);
        }
      //  alert("Thêm lịch làm việc thành công");
      Swal.fire({
        title: "Thành công",
        text: `${response.data.message}`,
        icon: "success"
      });
    } catch (error:any) {
        if (error.response) {
            // Server đã trả về lỗi với mã lỗi và dữ liệu lỗi
           // alert( error.response.data.message);
            Swal.fire({
                title: "Thất bại",
                text: `${error.response.data.message}`,
                icon: "error"
              });
        }
        
    }
    
  }

  const handelAddEmployeeWorkSchedule = async (event:FormEvent)=>{
  
    event.preventDefault();
    const formElement = document.getElementById('form-add-employe-work-schedule') as HTMLFormElement;
    if (!formElement) {
        console.error('Form element not found');
        return;
    }

    const form = new FormData(formElement);
    const ifemployee:IFEmployee ={
            idemployee: form.get('manv') as string,
            name: form.get('fullname') as string,
            workdate:form.get('workdate') as string,
            startime:form.get('startime') as string,
            endtime:form.get('endtime') as string  
    }

    try {
        const response = await axios.post('http://localhost:8084/api/v1/workschedule/workschedulemployee', ifemployee);
        console.log('Response:', response.data.message);
        if(response.status === 400){
            alert(response.data.status);
        }
        alert("Thêm ca làm việc thành công");
        setIsSelected(false);
    } catch (error:any) {
        if (error.response) {
            // Server đã trả về lỗi với mã lỗi và dữ liệu lỗi
            alert( error.response.data.message);
        }
        
    }
    
    
  }

    return (
        <div className={classes.article}>
           
               
                    <div className={classes.article_button}> 
                <button className= {classes.btn_prev} onClick={handlePrevDay}>Trước</button>
                <span>Tuần: {format(startOfWeekDate, 'dd/MM/yyyy', { locale: vi })} - {format(endOfWeekDate, 'dd/MM/yyyy', { locale: vi })}</span>
                <button className={classes.btn_next} onClick={handleNextDay}>Sau</button>
               
            </div>
            
            <table>
                <thead>
                    <tr>
                    <th>Ca làm việc</th>
                    <th>Thứ hai</th>
                    <th>Thứ ba</th>
                    <th>Thứ tư</th>
                    <th>Thứ năm</th>
                    <th>Thứ sáu</th>
                    <th>Thứ bảy</th>
                    <th>Chủ nhật</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Ca làm việc 8:00 - 17:00</td>
                        <td><button onClick={()=>handleDetailWorkSchedule(1)}>Xem chi tiết</button></td>
                        <td><button onClick={()=>handleDetailWorkSchedule(2)}>Xem chi tiết</button></td>
                        <td><button onClick={()=>handleDetailWorkSchedule(3)}>Xem chi tiết</button></td>
                        <td><button onClick={()=>handleDetailWorkSchedule(4)}>Xem chi tiết</button></td>
                        <td><button onClick={()=>handleDetailWorkSchedule(5)}>Xem chi tiết</button></td>
                        <td><button onClick={()=>handleDetailWorkSchedule(6)}>Xem chi tiết</button></td>
                        <td><button onClick={()=>handleDetailWorkSchedule(7)}>Xem chi tiết</button></td>
                    </tr>
                </tbody>
            </table>

            <div className={classes.form_add_container}>
                 <h2>Thêm lịch làm việc</h2> 
             
                <form id = 'form-add-work-date'>
                <div className={classes.form_group}>
                                  
                                  <label>Ngày làm việc:</label>
                                  <input type="date" name='workdate'  ref={dateRef} required/>
                          </div>

                          <div className={classes.form_time}>
                              <div>
                                  <label>Giờ bắt đầu:</label>
                                  <input name="startime" type="time" defaultValue="08:00" readOnly/>
                              </div>

                              <div>
                                  <label>Giờ kết thúc:</label>
                                  <input name="endtime" type="time" defaultValue="17:00" readOnly/>
                              </div>
                          </div>

                          <div className={classes.form_btn}>
                              <div className={classes.btn_form_add_work_schedule}>
                              <button type='submit' onClick={handleAddWorkScheduleDate}>Lưu</button>
                              <button type='submit' onClick={handleCancel}>Hủy</button>
                              </div>
                          
                          </div>
                </form>
            </div>

            <div id="modal-root">
            {showModal && (
                <Modal onClose={handleCloseModal}>
                    {isSelected? (
                        <>
                            <form id="form-add-employe-work-schedule" className={classes.form_add_work_schedule}>

                                <div className={classes.form_group}>
                                    <label>Mã nhân viên:</label>
                                    <select id='manv' name='manv'  value={selectedEmployee}
                onChange={handleSelectChange} required>
                                            {idEmployee.map((employee) => (
                                                <option key={employee.id} value={employee.id}>
                                                    {employee.id}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div className={classes.form_group}>
                                    <label>Họ tên:</label>
                                    <input name="fullname"  type="text" value={employeeDetails ? `${employeeDetails.firstname} ${employeeDetails.lastname}` : ''} readOnly/>
                                </div>

                                <div className={classes.form_group}>
                                  
                                        <label>Ngày làm việc:</label>
                                        <input name="workdate" type="date" value={selectedDate} readOnly/>
                                </div>

                                <div className={classes.form_time}>
                                    <div>
                                        <label>Giờ bắt đầu:</label>
                                        <input name="startime" type="time" defaultValue="08:00" readOnly/>
                                    </div>

                                    <div>
                                        <label>Giờ kết thúc:</label>
                                        <input name="endtime" type="time" defaultValue="17:00" readOnly/>
                                    </div>
                                </div>

                                <div className={classes.form_group}>
                                    <div className={classes.btn_form_add_work_schedule}>
                                    <button type='submit' onClick={handelAddEmployeeWorkSchedule}>Lưu</button>
                                    <button onClick={handleBack}>Hủy</button>
                                    </div>
                                
                                </div>
                            </form>
                        </>
                    ):(
                        <>
                    <button className={classes.btnAddWorkSchedule} onClick={handleAddWorkSchedule}>
                        <FontAwesomeIcon icon={faPlus}
                        style={{marginRight:"5px"}}/>
                        Thêm nhân viên</button>
                      <table className={classes.form_show}>
                        <thead>
                            <tr>
                                <th>Mã nhân viên</th>
                                <th>Họ tên</th>
                                <th>Ngày làm việc</th>
                                <th>Giờ bắt đầu</th>
                                <th>Giờ kết thúc</th>
                            </tr>
                        </thead>
            
                        <tbody>
                        {workEmoloyee.map((item) => (
                        <tr key={item.idemployee}>
                            <td>{item.idemployee}</td>
                            <td>{item.name}</td>
                            <td>{item.workdate}</td>
                            <td>{item.startime}</td>
                            <td>{item.endtime}</td>
                        </tr>
                    ))}
                        </tbody>

                      </table>
                      </>
                    )}
                    
                </Modal>
              )}
                
            </div>
            
          
        </div>
    )
}