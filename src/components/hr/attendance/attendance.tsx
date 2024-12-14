'use client'
import { FormEvent, useEffect, useRef, useState } from 'react'
import classes from './attendance.module.css'
import axios from 'axios';
import Modal from '@/components/modal';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBorderNone, faCircle, faCirclePlus, faDeleteLeft, faInfoCircle, faPen, faSearch, faTableList } from '@fortawesome/free-solid-svg-icons';
import { errorSwal, successSwal } from '@/custom/sweetalert';

import { calculateWorkHours } from '@/components/user/attedance/attendance';
import Cookies from 'js-cookie';
import { Payroll } from '@/pages/api/admin/apiPayroll';


interface IFEmployee{
    idemployee:string;
}

interface Filter{
    idemployee:string;
}


function formatDateString(dateString: string | undefined): string {
 
    if (!dateString) {
        return ''; // Trả về một chuỗi rỗng nếu dateString là undefined
    }

    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  }
const HR_AttendancePage:React.FC<{attendance:Attendance[]}> =({attendance})=>{
    const token =Cookies.get('token')
    const [isUpdate,setIsUpdate]= useState(false);
    const [changeStatus,setChangeStatus] = useState(false);
    const [attendaces,setAttendances] = useState<Attendance[]>([]);
    const [option,setOption] = useState<string>('');
    const [selectedEmployee, setSelectedEmployee] = useState<string>('');
    const [idEmployee,setIdEmployee] = useState<IFEmployee[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const inputRefs = useRef<Record<number, any>>({});
    const [num,setNum] = useState(-1);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [indexArray,setIndexArrray] = useState(-1);
    const customModalStyles = {
        width: '50%', // Tùy chỉnh độ rộng của modal
        height: '50%', // Tùy chỉnh chiều cao của modal
    };
    const [showPayroll,setShowPayroll] = useState<Payroll[]>([]);
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
        { value: 'Công tác', label: 'Công tác' },
        {value:'Đi trễ về sớm',label: 'Đi trễ về sớm'},
        {value:'Không đi làm',label:'Không đi làm'},
      ];
      const fetchPayroll = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/payroll`,{
                headers: {
                    Authorization: `Bearer ${token}`  
                  }

            });
            setShowPayroll(response.data.data);
            
        } catch (error) {
            console.error('Error fetching payroll data:', error);
        }
    };
    
    const isDateInPayrollMonthYear = (dateattendance: string): boolean => {
        const [yearFromDate, monthFromDate] = dateattendance.split('-').map(Number);
        const isInPayroll = showPayroll.some(payroll => {
            return payroll.month === monthFromDate && payroll.year === yearFromDate;
        });
        return isInPayroll;
    };
    useEffect(()=>{
         
        fetchPayroll();
        getIDemployee();
    },[])



    const totalPages = Math.ceil(attendance.length / itemsPerPage);
    
    const handlePageChange = (pageNumber:number) => {
      setCurrentPage(pageNumber);
    };
    const currentData =searchTerm ? attendance.filter(
        (item) =>
          item.idemployee.includes(searchTerm) ||
          item.dateattendance?.includes(searchTerm)
          || item.checkintime.includes(searchTerm)
          || item.checkouttime?.includes(searchTerm)  
          || item.attendanceStatusName?.includes(searchTerm)
          || item.numberwork?.toString().includes(searchTerm)
        
      ).slice((currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage) : attendance.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );
    const getIDemployee = async ()=>{
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/workrecord/getid`,{
                headers: {
                    Authorization: `Bearer ${token}`  
                  }
            }
);
            console.log(response.data);
            setIdEmployee(response.data);
        
        } catch (error) {
            console.error('Error fetching id employee:', error);
        }
    
    }
  
    
    
    const handleCancel = ()=>{
        setIsUpdate(false);
        setChangeStatus(false);
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
        
        //   setAttendance(response.data.data);
         
        
        } catch (error) {
          console.error('There was an error fetching the data!', error);
        }
        
    }

    const handleClickUpdate = (a:number)=>{
        setIsUpdate(true);
        setNum(a);
    }
    const handleClickSave = async (index:number)=>{
        const updatedAttendance: Attendance = {
            ...attendance[index],
            checkintime: inputRefs.current[index]?.checkintime?.value || attendance[index].checkintime,
            checkouttime: inputRefs.current[index]?.checkouttime?.value || attendance[index].checkouttime,
            status: inputRefs.current[index]?.status?.value || attendance[index].status,
            attendanceStatusName: inputRefs.current[index]?.status?.value || attendance[index].status,
            numberwork:inputRefs.current[index]?.numberwork?.value || attendance[index].numberwork ||0
          };
        try{
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/attendance/admin`,updatedAttendance,{
                headers: {
                    Authorization: `Bearer ${token}`  
                  }
            });
            if(response.status === 200){
                successSwal('Thành công',response.data.message);
                // setAttendance((prevAttendance) => {
                //     const newAttendance = [...prevAttendance];
                //     newAttendance[index] = updatedAttendance;
                //     return newAttendance;
                //   });
                  setNum(-1);
                window.location.reload();
            }
        }catch(error:any){
           
            errorSwal('Thất bại', error.response.data.message)
        }
        setIsUpdate(false);
    }

    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event:any) => {
        setInputValue(event.target.value);
    };

    const handleSearch = (event:React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value;
        setSearchTerm(term);
      };

   
      
      
  
        
      
  
      const addAttendance = async () => {
        const employeeOptions = idEmployee.map(employee => 
            `<option key="${employee.idemployee}" value="${employee.idemployee}">
                ${employee.idemployee}
            </option>`
        ).join('');
        const { value: formValues } = await Swal.fire({
          title: 'Thêm chấm công',
          html: `
            <div class="${classes.formGrid}">
              <div class="${classes.formGroup}">
                <label for="idemployee"><strong>Mã nhân viên:</strong></label>
             <select id="manv" name="manv" class="${classes.swalInput}" required>
                        <option value="">Chọn mã nhân viên</option> <!-- Tùy chọn mặc định -->
                        ${employeeOptions}
                    </select>
              </div>
              <div class="${classes.formGroup}">
                <label for="dateattendance"><strong>Ngày chấm công:</strong></label>
                <input type="date" class="${classes.swalInput}" id="dateattendance" placeholder="dd-mm-yyyy">
              </div>
              <div class="${classes.formGroup}">
                <label for="checkintime"><strong>Thời gian vào:</strong></label>
                <input type="time" class="${classes.swalInput}" value="08:00" id="checkintime" placeholder="hh:mm">
              </div>
              <div class="${classes.formGroup}">
                <label for="checkouttime"><strong>Thời gian ra:</strong></label>
                <input type="time" class="${classes.swalInput}" value="17:00" id="checkouttime" placeholder="hh:mm">
              </div>
              <div class="${classes.formGroup}">
                <label for="status"><strong>Trạng thái:</strong></label>
                <select class="${classes.swalInput}" id="status">
                  ${statusOptions.map(option => `<option value="${option.value}">${option.label}</option>`).join('')}
                </select>
              </div>
              <div class="${classes.formGroup}">
                <label for="numberwork"><strong>Số công:</strong></label>
                <input type="number" class="${classes.swalInput}"  id="numberwork" step="0.1" min="0" placeholder="Nhập số công">
              </div>
            </div>
          `,
          showCancelButton: true,
          confirmButtonColor: '#007bff',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Thêm',
          cancelButtonText: 'Hủy',
          customClass: {
            popup: classes.customSwalPopup,
            title: classes.customSwalTitle,
            htmlContainer: classes.customSwalHtml
          },

          didOpen: () => {
            const checkInTimeInput = document.getElementById('checkintime') as HTMLInputElement | null;
            const checkOutTimeInput = document.getElementById('checkouttime') as HTMLInputElement | null;
            const numberWorkInput = document.getElementById('numberwork') as HTMLInputElement | null;
        
            // Định nghĩa hàm cập nhật số công
            function updateWorkHours() {
                if (checkInTimeInput && checkOutTimeInput && numberWorkInput) {
                    const checkInTime = checkInTimeInput.value;
                    const checkOutTime = checkOutTimeInput.value;
        
                    if (!checkInTime || !checkOutTime) {
                        numberWorkInput.value = '0';
                        return;
                    }
        
                    const workHours = calculateWorkHours(checkInTime, checkOutTime);
                    numberWorkInput.value = workHours.toFixed(3); // Đảm bảo định dạng số thập phân chính xác
                }
            }
        
            // Thêm sự kiện cho các trường thời gian nếu phần tử tồn tại
            if (checkInTimeInput) {
                checkInTimeInput.addEventListener('input', updateWorkHours);
            }
        
            if (checkOutTimeInput) {
                checkOutTimeInput.addEventListener('input', updateWorkHours);
            }
        
            // Tính số công ban đầu khi mở popup
            updateWorkHours();
        }
        });
         
        if (formValues) {
            
        
          // Lấy dữ liệu từ các trường nhập liệu sau khi nhấn "Lưu"
          const attendanceData = {
            idemployee: (document.getElementById('manv') as HTMLSelectElement)?.value ?? '',
            dateattendance: (document.getElementById('dateattendance') as HTMLInputElement)?.value ?? '',
            checkintime: (document.getElementById('checkintime') as HTMLInputElement)?.value ?? '',
            checkouttime: (document.getElementById('checkouttime') as HTMLInputElement)?.value ?? '',
            status: (document.getElementById('status') as HTMLSelectElement)?.value ?? '',
            numberwork: parseFloat((document.getElementById('numberwork') as HTMLInputElement)?.value ?? '0')
          };

         
      
          if(attendanceData.idemployee.trim() === '' || attendanceData.numberwork.toString().trim() === ''){
            errorSwal('Thất bại',"Không được bỏ trống");
            return;
          }
      
          try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/attendance/admin/add-attendance`, attendanceData,{
                headers: {
                    Authorization: `Bearer ${token}`  
                  }
            });
            
            if (response.status === 201) {
              Swal.fire('Thành công', response.data.message, 'success');
            }
            if(response.data.status === 404){
                errorSwal('Thất bại',response.data.message)
                return;
            }
            if(response.data.status === 400){
                errorSwal('Thất bại',response.data.message)
                return;
            }
          } catch (error: any) {
            Swal.fire('Thất bại', error.response?.data?.message || 'Đã có lỗi xảy ra', 'error');
          }
        } else {
          Swal.fire('Hủy', 'Bạn đã hủy việc thêm chấm công.', 'info');
        }
      };


    return (
        <div className={classes.article}>
         <h2>Quản lý chấm công</h2> 
      
           
            <div className={classes.article_option}>
                <input type="text" placeholder='Tìm kiếm...'
                    value={searchTerm}
                    onChange={handleSearch}
                />

                <button className={classes.btnAddAttendance} onClick={addAttendance} title='Thêm chấm công giùm'>
                    <FontAwesomeIcon icon={faCirclePlus} />
                </button>
            </div>
          
      
        <table className={classes.tableUpdate}>
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

                {isUpdate?(
                        <tr key={currentData[num].idemployee}>
                            <td>{currentData[num].idemployee}</td>
                            <td>{currentData[num].dateattendance}</td>
                            <td>
                  <input
                    type="time"
                    defaultValue={currentData[num].checkintime}
                    ref={(el) => (inputRefs.current[num] = { ...inputRefs.current[num], checkintime: el })}
                  />
                </td>
                <td>
                  <input
                    type="time"
                    defaultValue={currentData[num].checkouttime}
                    ref={(el) => (inputRefs.current[num] = { ...inputRefs.current[num], checkouttime: el })}
                  />
                </td>
                <td>
                <select
                defaultValue={currentData[num].attendanceStatusName}
                ref={(el) => (inputRefs.current[num] = { ...inputRefs.current[num], status: el })}
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
                    step="0.1"
                    
                    defaultValue={currentData[num]?.numberwork || 0}
                    ref={(el) => (inputRefs.current[num] = { ...inputRefs.current[num], numberwork: el })}
                  />
                </td>
                <td>
                    <button  className={classes.btn_update} onClick={() => handleClickSave((currentPage - 1) * itemsPerPage + num)}>Lưu</button>

                    <button  className={classes.btn_cancel} onClick={handleCancel}>Hủy</button>
                </td>
                        </tr>
                )
                    :(
                        currentData.map((attend,index) => (
                            <tr key={index}>
                                <td>{attend.idemployee}</td>
                                <td>{formatDateString(attend.dateattendance)}</td>
                                <td>{attend.checkintime}</td>
                        <td>{attend.checkouttime}</td>
                        <td>{attend.attendanceStatusName}</td>
                        <td>{attend.numberwork}</td>
                        <td><button    disabled={isDateInPayrollMonthYear(attend.dateattendance?attend.dateattendance:'')} className={classes.btnUpdate} onClick={()=>handleClickUpdate(index)}>
                            <FontAwesomeIcon icon={faPen}/>
                            </button></td>
                            </tr>
                    )
                 )
                )
                }

           
              
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

export default HR_AttendancePage;