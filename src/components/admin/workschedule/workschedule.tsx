'use client'
import { useState } from 'react';
import classes from './workschedule.module.css'
import {format,addWeeks, subWeeks,startOfWeek,endOfWeek, set} from 'date-fns';
import { vi } from 'date-fns/locale';
import Modal from '@/components/modal';
export default function WorkSchedule(){
    const [date,setDate] = useState(new Date());    
    const [isSelected, setIsSelected] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const handlePrevDay = () => {
        setDate(prevDate => subWeeks(prevDate, 1));
      };
    
      const handleNextDay = () => {
        setDate(prevDate => addWeeks(prevDate, 1));
      };
      const startOfWeekDate = startOfWeek(date, { weekStartsOn: 1 });
  const endOfWeekDate = endOfWeek(date, { weekStartsOn: 1 });

  const handleAddWorkSchedule = ()=>{
        setIsSelected(true)
  }

  const handleDetailWorkSchedule = (dayOffset: number) => {
    
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
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setIsSelected(false)      
    setShowModal(false);
    };

const handleBack = ()=>{
    setIsSelected(false);
}

    return (
        <div className={classes.article}>
           
               
                    <div> 
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
            <div id="modal-root">
            {showModal && (
                <Modal onClose={handleCloseModal}>
                    {isSelected? (
                        <>
                            <form className={classes.form_add_work_schedule}>

                                <div className={classes.form_group}>
                                    <label>Mã nhân viên:</label>
                                    <select id='manv' name='manv' defaultValue='asdas' required>
                                        <option value="">NV001</option>
                                        <option value="">NV003</option>
                                        <option value="">NV005</option>
                                    </select>
                                </div>

                                <div className={classes.form_group}>
                                    <label>Họ tên:</label>
                                    <input type="text"/>
                                </div>

                                <div className={classes.form_group}>
                                  
                                        <label>Ngày làm việc:</label>
                                        <input type="date" value={selectedDate} readOnly/>
                                </div>

                                <div className={classes.form_time}>
                                    <div>
                                        <label>Giờ bắt đầu:</label>
                                        <input type="time"/>
                                    </div>

                                    <div>
                                        <label>Giờ kết thúc:</label>
                                        <input type="time"/>
                                    </div>
                                </div>

                                <div className={classes.form_group}>
                                    <div className={classes.btn_form_add_work_schedule}>
                                    <button type='submit'>Lưu</button>
                                    <button onClick={handleBack}>Hủy</button>
                                    </div>
                                
                                </div>
                            </form>
                        </>
                    ):(
                        <>
                    <button onClick={handleAddWorkSchedule}>Thêm nhân viên vào ca làm việc</button>
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
                            <tr>
                                <td>NV001</td>
                                <td>Nguyễn Văn Trường</td>
                                <td>10/07/2024</td>
                                <td>08:00</td>
                                <td>17:00</td>
                                </tr>
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