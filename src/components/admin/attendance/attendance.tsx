'use client'
import { FormEvent, useEffect, useRef, useState } from 'react'
import classes from './attendance.module.css'
import axios from 'axios';
import Modal from '@/components/modal';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBorderNone, faCircle, faCirclePlus, faDeleteLeft, faInfoCircle, faPen, faSearch, faTableList } from '@fortawesome/free-solid-svg-icons';
import { errorSwal, successSwal } from '@/custom/sweetalert';
import { Payroll } from '../payroll/payroll';
import { calculateWorkHours } from '@/components/user/attedance/attendance';

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
    idemployee:string;
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
function formatDateString(dateString: string | undefined): string {
 
    if (!dateString) {
        return ''; // Trả về một chuỗi rỗng nếu dateString là undefined
    }

    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  }
export default function AdminAttendancePage(){
    const token =localStorage.getItem('token')
    const [isUpdate,setIsUpdate]= useState(false);
    const [workRecord,setWorkRecord] = useState(false);
    const [attendanceExplain,setAttendanceExplain] = useState(false);
    const [modal,setModal] = useState(false);
    const [changeStatus,setChangeStatus] = useState(false);
    const [attendance,setAttendance] = useState<Attendance[]>([]);
    const [attendaces,setAttendances] = useState<Attendance[]>([]);
    const [attedance_explain,setAttendance_Explain] = useState<Attendance_Explain[]>([]);
    const [option,setOption] = useState<string>('');
    const [selectedEmployee, setSelectedEmployee] = useState<string>('');
    const [idEmployee,setIdEmployee] = useState<IFEmployee[]>([]);
    const [workRecordList,setWorkRecordList] = useState<WorkRecord[]>([]);
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
        {value:'Đi trễ về sớm',label: 'Đi trễ về sớm'}
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
        fetchAttendance();
        getIDemployee();
    },[])


    
    const fetchAttendance = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/attendance`,{
                headers: {
                    Authorization: `Bearer ${token}`  
                  }

            });
            setAttendance([...response.data.data].reverse());
            setAttendances([...response.data.data].reverse());
        } catch (error) {
            console.error('Error fetching employee ID:', error);
           
        }
    };
    const totalPages = Math.ceil(attendance.length / itemsPerPage);
    
    const handlePageChange = (pageNumber:number) => {
      setCurrentPage(pageNumber);
    };
    const currentData = attendance.slice(
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
  
    const handleClickWorkRecord = async()=>{
        try{
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/workrecord`,{
                headers: {
                    Authorization: `Bearer ${token}`  
                  }
            }
);
            if(response.status === 200){
                setWorkRecordList([...response.data.data].reverse());
            }
        }catch(error){
            alert("xảy ra lỗi trong quá trình call API");
        }
        setWorkRecord(true);
        setOption('workrecord');
        setIsUpdate(false);
        setChangeStatus(false);
    }

    const handleBack = (num:number)=>{
        
        setWorkRecord(false);

        setAttendanceExplain(false);
    }

    const handleCliCkAttendanceExplain = async ()=>{
        try{
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/attendance_explain`,{
                headers: {
                    Authorization: `Bearer ${token}`  
                  }
            });
            if(response.status === 200){
                setAttendance_Explain(response.data.data);
            }
        }catch(error){
            alert("Xảy ra lỗi trong quá trình lấy dữ liệu");
        }
        setOption('attedance_explain')
        setAttendanceExplain(true);
        setIsUpdate(false);
        setChangeStatus(false);
   
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
                setAttendance((prevAttendance) => {
                    const newAttendance = [...prevAttendance];
                    newAttendance[index] = updatedAttendance;
                    return newAttendance;
                  });
                  setNum(-1);
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

    const buttonSearch = async (str:string)=>{

        const filter:Filter ={
            idemployee:inputValue
        } 
        try {
            if(str === 'workrecord'){
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/workrecord/filter`, filter,{
                    headers: {
                        Authorization: `Bearer ${token}`  
                      }
                }
    
                );
              
                setWorkRecordList(response.data.data);
            }else if(str === 'attedance_explain'){
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/attendance_explain/filter`, filter,{
                    headers: {
                        Authorization: `Bearer ${token}`  
                      }
                }
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
  
    if(form.get('month') as string === '' || form.get('year') as string=== ''){
        errorSwal('Thất bại','Không được để trống');
        return;
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
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/workrecord`, workRecord,{
            headers: {
                Authorization: `Bearer ${token}`  
              }
        });
        console.log('Response:', response.data.message);
        if(response.status === 400){
           errorSwal('Thất bại',response.data.message)
           return;
        }
        successSwal('Thành công',response.data.message);
    } catch (error:any) {
        if (error.response) {
            
            errorSwal('Thất bại',error.response.data.message)
        }
        
    }
    }

    const handleShowDetail =(reason:string | undefined)=>{
        Swal.fire({
            text:`${reason}`
        })
    }
    const buttonChangeStatus = (index:number)=>{
        setIndexArrray(index);
        setChangeStatus(true);
    }
    const buttonUpdateAttendanceExplain = async (index:number)=>{
        const updatedAttendanceExplain: Attendance_Explain = {
            ...attedance_explain[index],
            status: inputRefs.current[index]?.status?.value || attendance[index].status,
          };
        try{
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/attendance_explain`,updatedAttendanceExplain,{
                headers: {
                    Authorization: `Bearer ${token}`  
                  }
            });
            if(response.status === 200){
           successSwal('Thành công',response.data.message)
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
    const handleSearch = (event:React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value;
        setSearchTerm(term);
      };
      const searchButton = ()=>{
        if(searchTerm === ''){
            setAttendance(attendaces);
           
         }else{
            const filterdata = attendaces.filter(
                (item) =>
                  item.idemployee.includes(searchTerm) ||
                  item.dateattendance?.includes(searchTerm)
                  || item.checkintime.includes(searchTerm)
                  || item.checkouttime?.includes(searchTerm)  
                  || item.attendanceStatusName?.includes(searchTerm)
                  || item.numberwork?.toString().includes(searchTerm)
                
              );
          setAttendance(filterdata);
        }
      }
  
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
            {workRecord?<h2>Quản lý bảng ghi ngày công</h2>
        :attendanceExplain?<h2>Quản lý giải trình</h2>:<h2>Quản lý chấm công</h2> 
        }
           
            <div className={classes.article_option}>
                
                <div className={classes.article_option_select}>
            
            {!workRecord && !attendanceExplain?(
                    <>
                           <input type="text" placeholder='Tìm kiếm...' 
                              value={searchTerm}
                              onChange={handleSearch}
                        />
                        <button onClick={searchButton} className={classes.btn_search}>
                            <FontAwesomeIcon icon={faSearch}/>
                        </button> 
                                    
                    </>
            ):(
                 <>
                    <input style={{ height: '30px',marginRight:'5px'}}   value={inputValue} 
                    placeholder='Tìm kiếm...'
                onChange={handleInputChange}  type='text'/>
                    <button className={classes.btn_search} onClick={()=>buttonSearch(option)}>
                    <FontAwesomeIcon icon={faSearch} />
                       </button>
                 </>   
            )}
         
            </div>
                <div className={classes.article_option_button}>
                    {workRecord ? (
                        <div>
                            <button className={classes.buttonWordRecord}  onClick={handleModalAddWorkRecord}>
                                <FontAwesomeIcon icon={faCirclePlus}/>
                                </button>
                            <button className={classes.buttonBackWordRecord} onClick={()=>handleBack(2)}>
                            <FontAwesomeIcon icon={faDeleteLeft}/>
                                </button>
                        </div>
                    ) : attendanceExplain ? (
                        <div>
                        
                        <button onClick={()=>handleBack(3)}
                            className={classes.buttonBackWordRecord}
                            >
                                <FontAwesomeIcon icon={faDeleteLeft}/>
                            </button>
                    </div>
                    ):(
                        <>
                                <div>
                                    <button className={classes.btnAddAttendance} onClick={addAttendance} title='Thêm chấm công giùm'>
                                        <FontAwesomeIcon icon={faCirclePlus}/>
                                    </button>
                                </div>
                                <div className={classes.article_option_button_workrecord}>
                                    <button onClick={handleClickWorkRecord} title="Bảng ghi ngày công">
                                    <FontAwesomeIcon icon={faTableList}  />
                                    </button>
                                </div>

                                <div className={classes.article_option_button_explain}>
                                    <button onClick={handleCliCkAttendanceExplain}
                                    title="Bảng giải trình"
                                    >
                                    <FontAwesomeIcon icon={faBorderNone} />
                                    </button>
                                </div>
                        </>
                    )}
               
                </div>
            </div>
            {workRecord ?
            ( 
                <>
                <table className={classes.tableWorkRecord}>
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
            <table className={classes.btnTableExplain}>
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

                {changeStatus?
                (
                    <tr key={attedance_explain[indexArray].idemployee}>
                       <td>{attedance_explain[indexArray].idemployee}</td>
                    <td>{attedance_explain[indexArray].date}</td>
                    <td>{attedance_explain[indexArray].checkintime}</td>
                    <td>{attedance_explain[indexArray].checkoutime}</td>
                    <td>
                        <button className={classes.btnDetails} onClick={()=> handleShowDetail(attedance_explain[indexArray].explaination)}>
                            <FontAwesomeIcon icon={faInfoCircle}/>
                         </button>   
                    </td>
                    <td>
                    <select defaultValue={attedance_explain[indexArray].status}
                             ref={(el) => (inputRefs.current[indexArray] = { ...inputRefs.current[indexArray], status: el })}
                             >
                            <option value="Đang chờ duyệt">Đang chờ duyệt</option>
                            <option value="Duyệt">Duyệt</option>
                            <option value="Không duyệt">Không duyệt</option>
                        </select>
                    </td>
                  
                            <td>
                            <div className={classes.button_explain}>
                                <button className={classes.btn_update} onClick={()=>buttonUpdateAttendanceExplain(indexArray)}>Lưu</button>
                                <button className={classes.btn_cancel} onClick={handleCancel}>Hủy</button>
                            </div>
                            </td>
                    </tr>
                   
                ):(

                    attedance_explain.map((e,index)=>(
                        <tr key={index}>
                        <td>{e.idemployee}</td>
                        <td>{formatDateString(e.date)}</td>
                        <td>{e.checkintime}</td>
                        <td>{e.checkoutime}</td>
                        <td>
                        <button className={classes.btnDetails} onClick={()=> handleShowDetail(e.explaination)}>
                            <FontAwesomeIcon icon={faInfoCircle}/>
                         </button>   
                    </td>
                    <td className={e.status === 'Duyệt' ? classes.statusActive : e.status === "Không duyệt"?classes.statusInactive
                        : classes.statusUnActive
                    }>{e.status}</td>
                    <td>
                  
                    <button  disabled={isDateInPayrollMonthYear(e.date?e.date:'')} className={classes.btnUpdateExplain} onClick={()=>buttonChangeStatus(index)}>
                            <FontAwesomeIcon icon={faPen}/>
                          </button>    
               
                
                    </td>
                           
                    </tr>
                )))}

             
            </tbody>
        </table>
        ) :
        ( <table className={classes.tableUpdate}>
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
                                                <option key={employee.idemployee} value={employee.idemployee}>
                                                    {employee.idemployee}
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
                            <button className={classes.btnAdd} onClick={buttonAddWorkRecord}>
                               
                                Thêm
                                
                                </button>
                            <button className={classes.btnCancel} onClick={closeModal}>Hủy</button>
                        </div>
                    </form>
                </Modal>
)}
        </div>
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