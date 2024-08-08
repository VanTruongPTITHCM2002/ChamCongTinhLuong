'use client'
import { FormEvent, useEffect, useRef, useState } from 'react';
import classes from './employees.module.css'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Modal from '@/components/modal';
import Swal from 'sweetalert2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faInfoCircle, faPen, faPlus, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { errorSwal } from '@/components/user/custom/sweetalert';

interface Employee {
    idemployee: string;
    firstname: string;
    lastname: string;
    gender: string;
    birthdate: string;
    cmnd: string;
    email: string;
    phonenumber: string;
    address: string;
    degree: number | string;
    status: number | string;
}

function formatDateString(dateString: string): string {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  }

export default function AdminEmployeesPage(){
    const router = useRouter();
    const token = localStorage.getItem('token')
    const [employeesData, setEmployeesData] = useState<Employee[]>([]);
    const [employees,setEmployees] = useState<Employee[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const initialInputValue = useRef<string>('');
    useEffect(()=>{
         
        axios.get( `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/employee`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                  }
            }
        )
        .then(response => {
            setEmployeesData(response.data.data);
            setEmployees(response.data.data);

        })
        .catch(error => {
            console.error('Lỗi khi lấy dữ liệu từ API:', error);
        });
 

    },[])
    const totalPages = Math.ceil(employeesData.length / itemsPerPage);
    
    const handlePageChange = (pageNumber:number) => {
      setCurrentPage(pageNumber);
    };
    
   
    const [showModal, setShowModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const handleDeleteEmployee = (maNV: string) => {
        // Tạo mảng mới chỉ chứa những nhân viên không có mã nhân viên bằng maNV
        const updatedEmployees = employeesData.filter(employee => employee.idemployee !== maNV);
        // Cập nhật lại danh sách nhân viên
        setEmployeesData(updatedEmployees);
    };
    const handleUpdateClick = (employee: Employee) => {
        setSelectedEmployee(employee); // Lưu thông tin nhân viên được chọn
        setShowModal(true); // Hiển thị modal
    };
     // Xử lý hàm đóng modal
     const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleCancelEdit = () => {
        setSelectedEmployee(null);
        setShowModal(false);
      };
    

    const handleClickAdd = ()=>{
        setShowModal(true);
        setSelectedEmployee(null);
    }
    const [employeeId, setEmployeeId] = useState<string>('');

    useEffect(() => {
        fetchEmployeeId();
    }, []);

    const fetchEmployeeId = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/employee/generateId`,  {
                headers: {
                    Authorization: `Bearer ${token}`
                  }
            });
            setEmployeeId(response.data.data);
        } catch (error) {
            console.error('Error fetching employee ID:', error);
        }
    };

    
    if(!localStorage.getItem('username') && !localStorage.getItem('token')){
        router.push('/login');
        return null;
    }

    const handleAddEmployee = async (event:FormEvent) =>{
        event.preventDefault();
        const formElement = document.getElementById('employeeForm') as HTMLFormElement;
        if (!formElement) {
            console.error('Form element not found');
            return;
        }
    
     
        const form = new FormData(formElement);
        let hasErrors = false;
        let errorMessages: string = '';
        for (const [key, value] of form.entries()) {
            if (!value) {
                const inputElement = document.querySelector(`[name="${key}"]`);
        
                // Tìm label tương ứng với input
                const label =  inputElement?.previousElementSibling;
                if (label && label.tagName === 'LABEL') {
                    errorMessages = `${label.textContent} không được để trống.`;
                }
                hasErrors = true;
                break; // Ngắt vòng lặp sớm
            }
        }
        if (hasErrors) {
          errorSwal('Thất bại',errorMessages);
            setShowModal(true); // Hiển thị modal nếu cần
            return;
        }
    
        const employee: Employee = {
            idemployee: form.get('idemployee') as string,
            firstname: form.get('firstname') as string,
            lastname: form.get('lastname') as string,
            gender: form.get('gender') as string,
            birthdate: form.get('birthdate') as string,
            cmnd: form.get('cmnd') as string,
            email: form.get('email') as string,
            phonenumber: form.get('phonenumber') as string,
            address: form.get('address') as string,
            degree: form.get('degree') as string, // Parsing as number
            status: form.get('status') as string,
        };
    
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/employee`, employee,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                      }
                }
            );
            console.log('Response:', response.data.message);
           
                if(response.data.status === 201){
                    Swal.fire({
                        title: "Thành công",
                        text: `${response.data.message}`,
                        icon: "success"
                      });
                      setEmployeesData(prevEmployees => [...prevEmployees, employee]);
                      fetchEmployeeId();
            }
         //   alert("Thêm nhân viên thành công");
        } catch (error) {
            console.error('Error submitting employee data:', error);
        }
       setShowModal(false);
        
    }

    const handleUpdateEmployee = async (event:FormEvent)=>{
        event.preventDefault();
        const formElement = document.getElementById('employeeFormUpdate') as HTMLFormElement;
        if (!formElement) {
            console.error('Form element not found');
            return;
        }
        const form = new FormData(formElement);
      
        const employee: Employee = {
            idemployee: form.get('idemployee') as string,
            firstname: form.get('firstname') as string,
            lastname: form.get('lastname') as string,
            gender: form.get('gender') as string,
            birthdate: form.get('birthdate') as string,
            cmnd: form.get('cmnd') as string,
            email: form.get('email') as string,
            phonenumber: form.get('phonenumber') as string,
            address: form.get('address') as string,
            degree: form.get('degree') as string, // Parsing as number
            status: form.get('status') as string,
        };
        const id = employee.idemployee;
        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/employee/${id}`, employee
                ,  {
                    headers: {
                        Authorization: `Bearer ${token}`
                      }
                }
            );
            if(response.data.status === 200){
                Swal.fire({
                    title: "Thành công",
                    text: `${response.data.message}`,
                    icon: "success"
                  });

                  setEmployeesData(prevEmployees => {
                    const updatedEmployees = prevEmployees.map(emp => {
                        if (emp.idemployee === employee.idemployee) {
                            return { ...emp, ...employee };
                        }
                        return emp;
                    });
                    return updatedEmployees;
                });
            }
            
        } catch (error) {
            console.error('Error submitting employee data:', error);
        }
        
   
    setShowModal(false);
    setSelectedEmployee(null); 
    }

    

    const handleDetailClick = (employee:Employee) => {
        Swal.fire({
            title: `<strong>Chi tiết nhân viên</strong>`,
            html: `
                <div class="${classes.employeeDetails}">
                    <div class="${classes.formGroup}">
                        <label><strong>Mã nhân viên:</strong></label>
                        <input type="text" value="${employee.idemployee}" readonly class="${classes.input}"/>
                    </div>
                    <div class="${classes.formGroup}">
                        <label><strong>Họ:</strong></label>
                        <input type="text" value="${employee.firstname}" readonly class="${classes.input}"/>
                    </div>
                    <div class="${classes.formGroup}">
                        <label><strong>Tên:</strong></label>
                        <input type="text" value="${employee.lastname}" readonly class="${classes.input}"/>
                    </div>
                    <div class="${classes.formGroup}">
                        <label><strong>Giới tính:</strong></label>
                        <input type="text" value="${employee.gender}" readonly class="${classes.input}"/>
                    </div>
                    <div class="${classes.formGroup}">
                        <label><strong>Ngày sinh:</strong></label>
                        <input type="text" value="${employee.birthdate}" readonly class="${classes.input}"/>
                    </div>
                    <div class="${classes.formGroup}">
                        <label><strong>Địa chỉ:</strong></label>
                        <input type="text" value="${employee.address}" readonly class="${classes.input}"/>
                    </div>
                    <div class="${classes.formGroup}">
                        <label><strong>Số điện thoại:</strong></label>
                        <input type="text" value="${employee.phonenumber}" readonly class="${classes.input}"/>
                    </div>
                    <div class="${classes.formGroup}">
                        <label><strong>CMND:</strong></label>
                        <input type="text" value="${employee.cmnd}" readonly class="${classes.input}"/>
                    </div>
                    <div class="${classes.formGroup}">
                        <label><strong>Email:</strong></label>
                        <input type="text" value="${employee.email}" readonly class="${classes.input}"/>
                    </div>
                    <div class="${classes.formGroupPair}">
                        <div class="${classes.formGroup}">
                            <label><strong>Bằng cấp:</strong></label>
                            <input type="text" value="${employee.degree}" readonly class="${classes.input}"/>
                        </div>
                        <div class="${classes.formGroup}">
                            <label><strong>Trạng thái:</strong></label>
                            <input type="text" value="${employee.status}" readonly class="${classes.input}"/>
                        </div>
                    </div>
                </div>
            `,
            width: 700,
            padding: '1em',
            background: '#f9f9f9',
            confirmButtonColor: '#007bff',
            customClass: {
                popup: classes.customSwalPopup,
                title: classes.customSwalTitle,
                htmlContainer: classes.customSwalHtml
            }
        });
        
        
    };

    const handleDeleteClick = async(employee:Employee)=>{
        Swal.fire({
            title: "Bạn có chắc chắn muốn xóa nhân viên này?",
            text: "Bạn sẽ không thể khôi phục lại dữ liệu đã xóa",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có",
            cancelButtonText:"Hủy",
          }).then(async (result) => {
            if (result.isConfirmed) {
               
                try {
                    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/employee/${employee.idemployee}`
                        , {
                            headers: {
                                Authorization: `Bearer ${token}`
                              }
                        }
                    );
                    if(response.data.status === 200){
                        Swal.fire({
                            title: "Thành công",
                            text: `${response.data.message}`,
                            icon: "success"
                          });
        
                          setEmployeesData(prevEmployees => {
                            // Loại bỏ nhân viên với idemployee tương ứng
                            const updatedEmployees = prevEmployees.filter(emp => emp.idemployee !== employee.idemployee);
                            return updatedEmployees;
                        });
                        return;
                    }
        
                    if(response.data.status === 400){
                        errorSwal('Thất bại',`${response.data.message}`);
                        return;
                    }
                    
                } catch (error) {
                    console.error('Error submitting employee data:', error);
                }
            }
          });
       
    }
    const currentData = employeesData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

      const searchButton = ()=>{
        if(searchTerm === ''){
            setEmployeesData(employees);
           
         }else{
            const filterdata = employees.filter(
                (item) =>
                  item.idemployee.includes(searchTerm) ||
                  item.firstname.includes(searchTerm)
                  || item.lastname.includes(searchTerm) ||
                  item.email.includes(searchTerm) ||
                  item.gender.includes(searchTerm)
                  || item.birthdate.includes(searchTerm)
                  || item.status.toString().includes(searchTerm)
                
              );
          setEmployeesData(filterdata);
        }
      }
      const handleSearch = (event:React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value;
        setSearchTerm(term);
      };
     

    
  
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          const regex = /^[a-zA-Z0-9\p{L}\p{M}]+(?:\s[a-zA-Z0-9\p{L}\p{M}]+)*$/u;
          const normalizedValue = value.trim();

            if(normalizedValue ===''){
                errorSwal('Lỗi','Không được để khoảng trắng')
               
                return;
            }
            if (!regex.test(normalizedValue)) {
                errorSwal('Lỗi','Tên chỉ được chứa các ký tự chữ cái hoặc số!');
                return;
            } 
          
        
      };
      const handleAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const regex = /^[a-zA-Z0-9\p{L}\p{M}\s,./]+$/u;

          if(value.trim() ===''){
              return;
          }
          if (!regex.test(value)) {
              errorSwal('Lỗi','Vui lòng không nhập địa chỉ chứa kí tự đặc biệt ngoài /');
          } 
      
    };
      const checkNumber =(e: React.ChangeEvent<HTMLInputElement>) => {

        const value = e.target.value;
        const regex = /^[0-9]+$/
        if(value.trim() ===''){
            return;
        }
       
        if(!regex.test(value)){
        
            errorSwal('Lỗi','Không được nhập chữ');
        }
       
      }
  
      
    return (
        <div className={classes.article}>
             
            <h2>Bảng danh sách nhân viên</h2>
            <div className={classes.article_button}>

                <div>
                      <input type="text" placeholder='Tìm kiếm...' 
                              value={searchTerm}
                              onChange={handleSearch}
                        />
                        <button onClick={searchButton}>
                            <FontAwesomeIcon icon={faSearch} />
                        </button> 
                </div>
            

                        <button className={classes.btn_add_emp} onClick={handleClickAdd}><FontAwesomeIcon icon={faPlus} style={{ display: "inline-block", /* Đảm bảo thẻ <i> có thể nhận kích thước */
                width: "12px",
                height: "12px",
                overflow: "visible",
                margin:"0",
                padding:"0",
                boxSizing: "border-box",
                overflowClipMargin: "initial",
                verticalAlign: "initial"
            }} /></button>
             </div>
             
        <table>
            <thead>
                <tr>
                <th>Mã nhân viên</th>
                <th>Họ nhân viên</th>
                <th>Tên nhân viên</th>
                <th>Giới tính</th>
                <th>Ngày sinh</th>
                <th>Trạng thái</th>
                {/* <th>Số điện thoại</th>
                <th>CMND</th>
                <th>Email</th>
                <th>Bằng cấp</th>
                <th>Trạng thái</th> */}
                <th>Hành động</th>
                </tr>
            </thead>

            <tbody>
                    {currentData.map((employee, index) => (
                        <tr key={index}>
                            <td>{employee.idemployee}</td>
                            <td>{employee.firstname}</td>
                            <td>{employee.lastname}</td>
                            <td>{employee.gender}</td> 
                            <td>{ formatDateString(employee.birthdate)}</td>
                            <td className={employee.status === 'Đang hoạt động' ? classes.statusActive : classes.statusInactive}>
        {employee.status === 'Đang hoạt động' ? 'Đang hoạt động' : 'Ngưng hoạt động'}
      </td>
                            {/* <td>{employee.address}</td> */}
                            {/* <td>{employee.phonenumber}</td>
                            <td>{employee.cmnd}</td>
                            <td>{employee.email}</td>
                            <td>{employee.degree}</td>
                            <td>{employee.status}</td> */}
                            
                            <td>
                                <div className={classes.btn}>
                                    <button className={classes.btn_update} onClick={() => handleUpdateClick(employee)}><FontAwesomeIcon icon={faPen}/></button>
                                   
                                   
                                    <button className={classes.btn_detail} onClick={() => handleDetailClick(employee)}>
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                </button> {/* <a onClick={() => handleDeleteEmployee(employee.idemployee)}>Xóa</a> */}

                                <button className = {classes.btn_delete} onClick={()=>handleDeleteClick(employee)} ><FontAwesomeIcon icon={faTrash}/></button>
                                </div>
                            </td>
                        </tr>
                         ))}
                </tbody>
        </table>
        <div id="modal-root"> {showModal && (
                <Modal onClose={handleCloseModal}>
                    {/* Nội dung modal */}
                    {selectedEmployee ? (
                        <form id='employeeFormUpdate' className={classes.employeeDetails}>
                        
                            <h2 className={classes.centeredHeading}>Chỉnh sửa thông tin nhân viên</h2>
                        <div  className={classes.formGroup}>
                                <label>Mã nhân viên:</label>
                                <input name="idemployee" type="text" defaultValue={selectedEmployee.idemployee} readOnly/>
                            </div>
                            <div  className={classes.formGroup}>
                                <label>Họ nhân viên:</label>
                                <input name="firstname" type="text" required defaultValue={selectedEmployee.firstname}
                                onChange={handleChange}/>
                            </div>
                            <div  className={classes.formGroup}>
                                <label>Tên nhân viên:</label>
                                <input name="lastname" type="text" required defaultValue={selectedEmployee.lastname}
                                onChange={handleChange}/>
                            </div>
                            
                                <div className={classes.formGroup}>
                                    <label htmlFor="gender">Giới Tính:</label>
                                    <select id="gender" name="gender" required defaultValue={selectedEmployee.gender}>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                </div>
                                <div className={classes.formGroup}>
                                    <label htmlFor="address">Địa Chỉ:</label>
                                    <input type="text" id="address" name="address" required defaultValue={selectedEmployee.address}
                                    onChange={handleAddress}
                                    />
                                </div>
                                <div className={classes.formGroup}>
                                    <label htmlFor="phonenumber">Số Điện Thoại:</label>
                                    <input type="text" id="phonenumber" name="phonenumber" required defaultValue={selectedEmployee.phonenumber}
                                    onChange={checkNumber}
                                    />
                                </div>
                                <div className={classes.formGroup}>
                                    <label htmlFor="cmnd">CMND:</label>
                                    <input type="text" id="cmnd" name="cmnd" required defaultValue={selectedEmployee.cmnd}/>
                                </div>
                                <div className={classes.formGroup}>
                                    <label htmlFor="email">Email:</label>
                                    <input type="email" id="email" name="email" required defaultValue={selectedEmployee.email}/>
                                </div>
                                <div className={classes.formGroup}>
                                    <label htmlFor="birthdate">Ngày sinh:</label>
                                    <input type="date" id="birthdate" name="birthdate" required defaultValue={selectedEmployee.birthdate}/>
                                </div>
                                <div className={classes.formGroup}>
                                    <label htmlFor="degree">Bằng Cấp:</label>
                                    <select id="degree" name="degree" required defaultValue={selectedEmployee.degree}>
                                        <option value="Đại học">Đại học</option>
                                        <option value="Cao đẳng">Cao đẳng</option>
                                        <option value="Thạc sĩ">Thạc sĩ</option>
                                        <option value="Tiễn sĩ">Tiến sĩ</option>
                                    </select>
                                </div>
                                <div className={classes.formGroup}>
                                    <label htmlFor="status">Trạng Thái:</label>
                                    <select id="status" name="status" required defaultValue={selectedEmployee.status}>
                                        <option value="Đang hoạt động">Đang hoạt động</option>
                                        <option value="Ngưng hoạt động">Ngưng hoạt động</option>
                                    </select>
                                </div>
                                <div className={classes.formGroup}>

                                </div>
                        {/* Thêm các trường thông tin khác */}
                        <div className={classes.formGroupButton}>
                          <button type="submit" className={classes.btn_submit} onClick={handleUpdateEmployee}>Lưu</button>
                          <button type="button"  className={classes.btn_cancel} onClick={handleCancelEdit}>Hủy</button>
                        </div>
                      </form>
                    ):  <form  id='employeeForm' className={classes.employeeDetails} >
                    <h2 className={classes.centeredHeading}>Thêm mới nhân viên</h2>
                            <div  className={classes.formGroup}>
                                <label>Mã nhân viên:</label>
                                <input name="idemployee" type="text" defaultValue={employeeId} readOnly/>
                            </div>
                            <div className={classes.formGroup}>
                                <label>Họ nhân viên:</label>
                                <input name="firstname"   ref={inputRef} type="text" required
                              
                                onChange={handleChange}
                             />
                             
                            </div>
                            <div  className={classes.formGroup}>
                                <label>Tên nhân viên:</label>
                                <input name="lastname" ref={inputRef} type="text" required
                                 onChange={handleChange}
                                />
                            </div>
                            
                                <div className={classes.formGroup}>
                                    <label htmlFor="gender">Giới Tính:</label>
                                    <select id="gender" name="gender" required>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                </div>
                                <div className={classes.formGroup}>
                                    <label htmlFor="address">Địa Chỉ:</label>
                                    <input type="text" id="address" name="address" required
                                     onChange={handleAddress}
                                    />
                                </div>
                                <div className={classes.formGroup}>
                                    <label htmlFor="phonenumber">Số Điện Thoại:</label>
                                    <input type="text" id="phonenumber" name="phonenumber" required
                                    onChange={checkNumber}
                                    />
                                </div>
                                <div className={classes.formGroup}>
                                    <label htmlFor="cmnd">CMND:</label>
                                    <input type="text" id="cmnd" name="cmnd" required/>
                                </div>
                                <div className={classes.formGroup}>
                                    <label htmlFor="email">Email:</label>
                                    <input type="email" id="email" name="email" required/>
                                </div>
                                <div className={classes.formGroup}>
                                    <label htmlFor="birthdate">Ngày sinh:</label>
                                    <input type="date" id="birthdate" name="birthdate" required/>
                                </div>
                                <div className={classes.formGroup}>
                                    <label htmlFor="degree">Bằng Cấp:</label>
                                    <select id="degree" name="degree" required>
                                    <option value="Đại học">Đại học</option>
                                        <option value="Cao đẳng">Cao đẳng</option>
                                        <option value="Thạc sĩ">Thạc sĩ</option>
                                        <option value="Tiễn sĩ">Tiến sĩ</option>
                                    </select>
                                </div>
                                <div className={classes.formGroup}>
                                    <label htmlFor="status">Trạng Thái:</label>
                                    <select id="status" name="status" required>
                                    <option value="Đang hoạt động">Đang hoạt động</option>
                                    <option value="Ngưng hoạt động">Ngưng hoạt động</option>
                                    </select>
                                </div>
                              

                         
                            <div className={classes.formGroupButton}>
                                <button className={classes.btn_submit} type="submit" onClick={handleAddEmployee}>Thêm</button>
                                <button className={classes.btn_cancel} type="button" onClick={handleCancelEdit}>Hủy</button>
                            </div>
                </form>}
                </Modal>
            )}</div>

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