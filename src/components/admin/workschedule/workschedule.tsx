'use client'
import { FormEvent, useEffect, useRef, useState } from 'react';
import classes from './workschedule.module.css'
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek, set } from 'date-fns';
import { vi } from 'date-fns/locale';
import Modal from '@/components/modal';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faCircle, faCircleInfo, faCirclePlus, faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { error } from 'console';
import moment from 'moment'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { errorAlert, errorSwal, successSwal } from '@/custom/sweetalert';
import Cookies from 'js-cookie';
import { Employee } from '@/pages/api/admin/apiEmployee';
interface IFEmployee {
    id?: string;
    idemployee?: string,
    firstname?: string;
    lastname?: string;
    name?: string;
    workdate?: string;
    startime?: string;
    endtime?: string;
}
interface newIFEMployee {
    idEmployee: string,
    workdate: string;
    startTime: string;
    endTime: string;
}
interface WorkSchedule {
    workdate: string;
    startime: string;
    endtime: string;
}

interface workDate {
    date: string;
}

interface ListEmployeeRequest{
    listEmployee:string[],
    dateWork:string,
}

const WorkSchedule: React.FC<{ employee: Employee[], workschedule:WorkSchedule[]}> = ({ employee ,workschedule}) => {
    const token = Cookies.get('token');
    const dateRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const [date, setDate] = useState(new Date());
    const [isSelected, setIsSelected] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [idEmployee, setIdEmployee] = useState<IFEmployee[]>([]);
   
    const [workEmoloyee, setWorkEmployee] = useState<newIFEMployee[]>([]);
    const [employeeDetails, setEmployeeDetails] = useState<IFEmployee | null>(null);


    const [selected, setSelected] = useState<string[]>([]);

    const toggleSelect = (id: string) =>
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );

    const toggleAll = () =>
        setSelected(selected.length === employee.length ? [] : employee.map((d) => d.idEmployee!));

    const handlePrevDay = () => {
        setDate(prevDate => subWeeks(prevDate, 1));
    };

    const handleNextDay = () => {
        setDate(prevDate => addWeeks(prevDate, 1));
    };
    const startOfWeekDate = startOfWeek(date, { weekStartsOn: 1 });
    const endOfWeekDate = endOfWeek(date, { weekStartsOn: 1 });

    const handleAddWorkSchedule = async () => {
        const date = new Date();
        const date2 = new Date(selectedDate);
        if (date > date2) {
            errorSwal("Thất bại", "Không thể thêm nhân viên vào ca này");
            return;
        }
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/workschedule/getidemp`, {
                params: {
                    date: selectedDate.replace(/-/g, '/')
                },
                headers: {
                    Authorization: `Bearer ${token}`  // Thêm token vào header
                }
            });

            setIdEmployee(response.data);
            if (response.data.length > 0) {
                const firstEmployeeId = response.data[0].id;
                fetchEmployeeDetails(firstEmployeeId);
            }
        } catch (error) {
            console.error('Error fetching id employee:', error);
        }
        setIsSelected(true)
        setSelected([]);
    }




    const isWorkDays = (dayOffset: number) => {
        const startOfWeek = new Date(startOfWeekDate);
        startOfWeek.setDate(startOfWeekDate.getDate()); // Điều chỉnh để có Chủ nhật

        // Tính toán ngày được chọn
        const selectedDay = new Date(startOfWeek);
        selectedDay.setDate(startOfWeek.getDate() + dayOffset); // Thêm số ngày tương ứng

        // Định dạng ngày thành chuỗi YYYY-MM-DD
        const formattedDate = selectedDay.toISOString().split('T')[0];
        return workschedule.filter(event => event.workdate === formattedDate).length > 0;
    }


    const handleDetailWorkSchedule = async (dayOffset: number) => {


        const currentDay = startOfWeekDate.getDay(); // Ngày hiện tại trong tuần (0: Chủ nhật, 1: Thứ hai, ..., 6: Thứ bảy)

        // Tính toán ngày đầu tuần (Thứ 2 của tuần này)
        const startOfWeek = new Date(startOfWeekDate);
        startOfWeek.setDate(startOfWeekDate.getDate()); // Điều chỉnh để có Chủ nhật

        // Tính toán ngày được chọn
        const selectedDay = new Date(startOfWeek);
        selectedDay.setDate(startOfWeek.getDate() + dayOffset); // Thêm số ngày tương ứng

        // Định dạng ngày thành chuỗi YYYY-MM-DD
        const formattedDate = selectedDay.toISOString().split('T')[0];
        console.log(formattedDate)
        setSelectedDate(formattedDate);
        const work: workDate = {
            date: formattedDate
        }
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/workschedule/workdate`, {
                date: formattedDate
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }

            }

            );
            console.log('Response:', response.data);
            if (response.status === 400) {

                alert(response.data.status);
            }
            setWorkEmployee(response.data)

            setShowModal(true);

        } catch (error: any) {
            if (error.response) {
                // Server đã trả về lỗi với mã lỗi và dữ liệu lỗi
                //alert( error.response.data.message);
                errorAlert(error.response.data.message);
                setShowModal(false);
            }

        }

    };





    const handelDeleteWorkSchedule = async (index: number) => {
        const currentDay = startOfWeekDate.getDay(); // Ngày hiện tại trong tuần (0: Chủ nhật, 1: Thứ hai, ..., 6: Thứ bảy)

        // Tính toán ngày đầu tuần (Thứ 2 của tuần này)
        const startOfWeek = new Date(startOfWeekDate);
        startOfWeek.setDate(startOfWeekDate.getDate()); // Điều chỉnh để có Chủ nhật

        // Tính toán ngày được chọn
        const selectedDay = new Date(startOfWeek);
        selectedDay.setDate(startOfWeek.getDate() + index); // Thêm số ngày tương ứng

        // Định dạng ngày thành chuỗi YYYY-MM-DD
        const formattedDate = selectedDay.toISOString().split('T')[0];
        setSelectedDate(formattedDate);
        const work: workDate = {
            date: formattedDate
        }

        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/workschedule`,

                {
                    params: {
                        date: formattedDate.replace(/-/g, '/')
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }

                }
            );

            if (response.status === 200) {
                successSwal('Thành công', response.data.message);
                window.location.reload();
            }

        } catch (error: any) {
            if (error.response) {
                // Server đã trả về lỗi với mã lỗi và dữ liệu lỗi
                //alert( error.response.data.message);
                errorAlert(error.response.data.message);
                setShowModal(false);
            }

        }
    }

    const handleCloseModal = () => {
        setIsSelected(false)
        setShowModal(false);
    };

    const handleBack = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setShowModal(true);
        setIsSelected(false)
    }

    const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (dateRef.current) dateRef.current.value = '';
        event.preventDefault();
    }

    const fetchEmployeeDetails = async (id: string) => {
        try {
            const response = await axios.get<IFEmployee>(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/workschedule/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }

            });
            setEmployeeDetails(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching employee details:', error);
            setEmployeeDetails(null); // Reset details if there is an error
        }
    };




    // Thêm lịch làm việc
    const handleAddWorkScheduleDate = async (event: FormEvent) => {
        event.preventDefault();
        const offDay = ["30/04","01/05","02/09"];
        const formElement = document.getElementById('form-add-work-date') as HTMLFormElement;
        if (!formElement) {
            console.error('Form element not found');
            return;
        }


        const form = new FormData(formElement);
        const workschedule: WorkSchedule = {
            workdate: form.get('workdate') as string,
            startime: form.get('startime') as string,
            endtime: form.get('endtime') as string
        }

        if (workschedule.workdate.trim() === '') {
            errorSwal("Thất bại", "Vui lòng chọn ngày");
            return;
        }
        const currentDay = new Date(workschedule.workdate).getDay();
        if (currentDay === 0) {
            errorSwal("Thất bại", "Vui lòng không chọn chủ nhật");
            return;
        }
        const clearTime = (date: Date) => {
            date.setHours(0, 0, 0, 0);
            return date;
        };
        const date = new Date();
        const workdDate = new Date(workschedule.workdate);

        if (clearTime(workdDate).getTime() === clearTime(date).getTime()) {
            errorSwal("Thất bại", "Không thể tạo lịch làm việc cho ngày hôm này vui lòng tạo trước 1 ngày");
            return;
        }

        if (clearTime(workdDate).getTime() < clearTime(date).getTime()) {
            errorSwal("Thất bại", "Không thể tạo lịch làm việc ngày trong quá khứ");
            return;
        }
  
        
        if (offDay.includes((workdDate.getDate() < 10 ? "0" + workdDate.getDate() : workdDate.getDate()) + "/" 
        + ((workdDate.getMonth() + 1) < 10 ? "0" + (workdDate.getMonth() + 1) : (workdDate.getMonth() + 1))))
        {
            
            errorSwal('Thất bại',"Không thể chọn vì đây là nghỉ lễ");
            return;
        }
       
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/workschedule`, workschedule, {
                headers: {
                    Authorization: `Bearer ${token}`
                }

            });
            console.log('Response:', response.data.message);
            if (response.status === 400) {
                errorSwal('Thất bại', response.data.message)
                return;
            }
            //  alert("Thêm lịch làm việc thành công");
            Swal.fire({
                title: "Thành công",
                text: `${response.data.message}`,
                icon: "success"
            });
            window.location.reload();
        } catch (error: any) {
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

    // Thêm nhân viên vào ca làm việc
    const handelAddEmployeeWorkSchedule = async (event: FormEvent) => {

        event.preventDefault();
        const formElement = document.getElementById('form-add-employe-work-schedule') as HTMLFormElement;
        if (!formElement) {
            console.error('Form element not found');
            return;
        }

        const form = new FormData(formElement);
        // const ifemployee: newIFEMployee = {
        //     idEmployee: form.get('manv') as string,
        //     workdate: form.get('dateWork') as string,
        //     starTime: form.get('startime') as string,
        //     endTime: form.get('endtime') as string
        // }

        const listEmployeeRequest:ListEmployeeRequest = {
            listEmployee: selected,
            dateWork:form.get('dateWork') as string,
        }


        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/workscheduledetail/add-employees`, listEmployeeRequest, {
                headers: {
                    Authorization: `Bearer ${token}`
                }

            });
            console.log('Response:', response.data.message);
            if (response.status === 400) {
                errorSwal('Thất bại', response.data.message)
                return;
            }
            successSwal("Thành công", response.data.message);
            setIsSelected(false);
            setSelected([]);
            window.location.reload();
        } catch (error: any) {
            if (error.response) {
                // Server đã trả về lỗi với mã lỗi và dữ liệu lỗi
                errorSwal('Thất bại', error.response.data.message)
            }

        }


    }
    const deleteEmployee = async (idemployee: string[], date: string) => {

        const clearTime = (date: Date) => {
            date.setHours(0, 0, 0, 0);
            return date;
        };
        const currentdate = new Date();
        const workdDate = new Date(date);

        const listEmployeeRequest: ListEmployeeRequest= {
            listEmployee:idemployee,
            dateWork:date,
        }

        if (clearTime(currentdate).getTime() >= clearTime(workdDate).getTime()) {
            errorSwal("Thất bại", "Không thể xóa nhân viên khỏi lịch trước đó");
            return;
        }

        const result = await Swal.fire({
            title: 'Xác nhận xóa',
            text: `Bạn có chắc chắn muốn xóa ${selected.join(", ")} khỏi ngày làm việc ${date}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#007bff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
            customClass: {
                popup: 'custom-popup',
                title: 'custom-title',
                confirmButton: 'custom-confirm-button',
                cancelButton: 'custom-cancel-button'
            }
        });

        if (result.isConfirmed) {
            // Thực hiện hành động xóa tại đây
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/workscheduledetail/delete-employees`,listEmployeeRequest,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
    ,
                })
                if (response.data.status === 200) {
                   
                    successSwal('Thành công', response.data.message);
                    // setWorkEmployee(prev => {
                    //     // Loại bỏ mục với idemployee và workdate tương ứng
                    //     return prev.filter(emp => !(emp.idEmployee === idemployee && emp.workdate === date));
                    // });
                     window.location.reload();
                  
                }
               
            } catch (error) {

            }
           
        }

    };



    return (
        <div className={classes.article}>

            <h2>Quản lý lịch làm việc</h2>
            <div className={classes.article_button}>
                <button className={classes.btn_prev} onClick={handlePrevDay}>Trước</button>
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
                        <td>
                            - Cả ngày: 08:00 - 17:00
                            <br />
                            - Ca sáng: 08:00 - 12:00
                            <br />
                            - Ca chiều: 13:00 - 17:00
                        </td>
                        <td><button disabled={isWorkDays(1) ? false : true} className={isWorkDays(1) ? classes.btnDetail : classes.btnDisable} onClick={() => handleDetailWorkSchedule(1)}><FontAwesomeIcon icon={faCircleInfo}

                        /></button>
                            <button disabled={isWorkDays(1) ? false : true} className={isWorkDays(1) ? classes.btnUnDelete : classes.btnDisable} onClick={() => handelDeleteWorkSchedule(1)}><FontAwesomeIcon icon={faTrash} /></button>
                        </td>
                        <td><button disabled={isWorkDays(2) ? false : true} className={isWorkDays(2) ? classes.btnDetail : classes.btnDisable} onClick={() => handleDetailWorkSchedule(2)}><FontAwesomeIcon icon={faCircleInfo} /></button>
                            <button disabled={isWorkDays(2) ? false : true} className={isWorkDays(2) ? classes.btnUnDelete : classes.btnDisable} onClick={() => handelDeleteWorkSchedule(2)}><FontAwesomeIcon icon={faTrash} /></button>
                        </td>
                        <td><button disabled={isWorkDays(3) ? false : true} className={isWorkDays(3) ? classes.btnDetail : classes.btnDisable} onClick={() => handleDetailWorkSchedule(3)}><FontAwesomeIcon icon={faCircleInfo} /></button>
                            <button disabled={isWorkDays(3) ? false : true} className={isWorkDays(3) ? classes.btnUnDelete : classes.btnDisable} onClick={() => handelDeleteWorkSchedule(3)}><FontAwesomeIcon icon={faTrash} /></button>
                        </td>
                        <td><button disabled={isWorkDays(4) ? false : true} className={isWorkDays(4) ? classes.btnDetail : classes.btnDisable} onClick={() => handleDetailWorkSchedule(4)}><FontAwesomeIcon icon={faCircleInfo} /></button>
                            <button disabled={isWorkDays(4) ? false : true} className={isWorkDays(4) ? classes.btnUnDelete : classes.btnDisable} onClick={() => handelDeleteWorkSchedule(4)}><FontAwesomeIcon icon={faTrash} /></button>
                        </td>
                        <td><button disabled={isWorkDays(5) ? false : true} className={isWorkDays(5) ? classes.btnDetail : classes.btnDisable} onClick={() => handleDetailWorkSchedule(5)}><FontAwesomeIcon icon={faCircleInfo} /></button>
                            <button disabled={isWorkDays(5) ? false : true} className={isWorkDays(5) ? classes.btnUnDelete : classes.btnDisable} onClick={() => handelDeleteWorkSchedule(5)}><FontAwesomeIcon icon={faTrash} /></button>
                        </td>
                        <td><button disabled={isWorkDays(6) ? false : true} className={isWorkDays(6) ? classes.btnDetail : classes.btnDisable} onClick={() => handleDetailWorkSchedule(6)}><FontAwesomeIcon icon={faCircleInfo} /></button>
                            <button disabled={isWorkDays(6) ? false : true} className={isWorkDays(6) ? classes.btnUnDelete : classes.btnDisable} onClick={() => handelDeleteWorkSchedule(6)}><FontAwesomeIcon icon={faTrash} /></button>
                        </td>
                        <td><button disabled={isWorkDays(7) ? false : true} className={isWorkDays(7) ? classes.btnDetail : classes.btnDisable} onClick={() => handleDetailWorkSchedule(7)}><FontAwesomeIcon icon={faCircleInfo} /></button>
                            <button disabled={isWorkDays(7) ? false : true} className={isWorkDays(7) ? classes.btnUnDelete : classes.btnDisable} onClick={() => handelDeleteWorkSchedule(7)}><FontAwesomeIcon icon={faTrash} /></button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className={classes.form_add_container}>
                <h2>Thêm lịch làm việc</h2>

                <form id='form-add-work-date'>
                    <div className={classes.form_group}>

                        <label>Ngày làm việc:</label>
                        <input type="date" name='workdate' ref={dateRef} required />
                    </div>

                    <div className={classes.form_time}>
                        <div>
                            <label>Giờ bắt đầu:</label>
                            <input name="startime" type="time" defaultValue="08:00" />
                        </div>

                        <div>
                            <label>Giờ kết thúc:</label>
                            <input name="endtime" type="time" defaultValue="17:00" />
                        </div>
                    </div>

                    <div className={classes.form_btn}>
                        <div className={classes.btn_form_add_work_schedule}>
                            <button className={classes.btnSave} type='submit' onClick={handleAddWorkScheduleDate}>Lưu</button>
                            <button className={classes.btnCancel} type='submit' onClick={handleCancel}>Hủy</button>
                        </div>

                    </div>
                </form>
            </div>

            <div id="modal-root">
                {showModal && (
                    <Modal onClose={handleCloseModal}>
                        {isSelected ? (
                            <>
                                <form id="form-add-employe-work-schedule" className={classes.form_add_work_schedule}>
                                    <div className={classes.form_group}>
                                        <table className={classes.tableEmpContractActive}>
                                            <thead>
                                                <th>
                                                    <input
                                                        type="checkbox"
                                                        checked={selected.length === employee.length}
                                                        onChange={toggleAll}
                                                    />
                                                </th>
                                                <th>Mã nhân viên</th>
                                                <th>Họ</th>
                                                <th>Tên</th>
                                            </thead>

                                            <tbody>
                                                {employee.map((e, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={selected.includes(e.idEmployee!)}
                                                                onChange={() => toggleSelect(e.idEmployee!)}
                                                            />
                                                        </td>
                                                        <td>{e.idEmployee}</td>
                                                        <td>{e.firstName}</td>
                                                        <td>{e.lastName}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                  
                                    <div className={classes.form_group}>

                                        <label>Ngày làm việc:</label>
                                        <input name="dateWork" type="date" value={selectedDate} readOnly />
                                    </div>

                                    <div className={classes.form_time}>
                                        <div>
                                            <label>Giờ bắt đầu:</label>
                                            <input name="startime" type="time" defaultValue="08:00"  />
                                        </div>

                                        <div>
                                            <label>Giờ kết thúc:</label>
                                            <input name="endtime" type="time" defaultValue="17:00"  />
                                        </div>
                                    </div>

                                    <div className={classes.form_group}>
                                        <div className={classes.btn_form_add_work_schedule}>
                                            <button className={classes.btnSave} type='submit' onClick={handelAddEmployeeWorkSchedule}>Lưu</button>
                                            <button className={classes.btnCancel} onClick={handleBack}>Hủy</button>
                                        </div>

                                    </div>

                                    <div>
                                        <strong>Đã chọn:</strong> {selected.join(", ")}
                                    </div>
                                </form>

                             
                            </>
                        ) : (
                            <>
                                    <div style={{display:'flex',justifyContent:'space-between'
                                        ,alignItems:'center'
                                    }}>
                                        <button className={classes.btnAddWorkSchedule} onClick={handleAddWorkSchedule}>
                                            <FontAwesomeIcon icon={faPlus}
                                                style={{ marginRight: "5px" }} />
                                            Thêm nhân viên</button>

                                        <button onClick={() => deleteEmployee(selected, selectedDate)} className={classes.btnCancel}><FontAwesomeIcon icon={faTrash} /></button>
                                    </div>
                              

                                <table className={classes.form_show}>
                                    <thead>
                                        <tr>
                                                <th>
                                                    <input
                                                        type="checkbox"
                                                        checked={selected.length === employee.length}
                                                        onChange={toggleAll}
                                                    />
                                                </th>
                                            <th>Mã nhân viên</th>
                                            <th>Ngày làm việc</th>
                                            <th>Giờ bắt đầu</th>
                                            <th>Giờ kết thúc</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {workEmoloyee.map((item) => (
                                            <tr key={item.idEmployee}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={selected.includes(item.idEmployee!)}
                                                        onChange={() => toggleSelect(item.idEmployee!)}
                                                    />
                                                </td>
                                                <td>{item.idEmployee}</td>
                                                <td>{item.workdate}</td>
                                                <td>{item.startTime}</td>
                                                <td>{item.endTime}</td>
         
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

export default WorkSchedule;