'use client'
import { FormEvent, useEffect, useState } from 'react';
import classes from './employees.module.css'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Modal from '@/components/modal';


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
export default function AdminEmployeesPage(){
    const router = useRouter();
    const [employeesData, setEmployeesData] = useState<Employee[]>([]);
    useEffect(()=>{
         
        axios.get('http://localhost:8080/api/v1/employee')
        .then(response => {
            setEmployeesData(response.data.data);
            console.log('Dữ liệu nhân viên:', employeesData);
        })
        .catch(error => {
            console.error('Lỗi khi lấy dữ liệu từ API:', error);
        });
 

    },[])

    const degreeToString = (degree: number | string): string => {
        switch (degree) {
            case 1:
                return 'Đại học';
            case 2:
                return 'Cao đẳng';
            case 3:
                return 'Thạc sĩ';
            case 4:
                return 'Tiến sĩ';
            default:
                return '';
        }
    };

    const statusToString = (status: number | string): string => {
        switch (status) {
            case 1:
                return 'Đang làm việc';
            case 0:
                return 'Ngưng làm việc';
            default:
                return '';
        }
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
            const response = await axios.get('http://localhost:8080/api/v1/employee/generateId');
            setEmployeeId(response.data.data);
        } catch (error) {
            console.error('Error fetching employee ID:', error);
        }
    };

    
    const handleAddEmployee = async (event:FormEvent) =>{
        event.preventDefault();
        const formElement = document.getElementById('employeeForm') as HTMLFormElement;
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
            degree: Number(form.get('degree')), // Parsing as number
            status: Number(form.get('status')), // Parsing as number
        };
    
        try {
            const response = await axios.post('http://localhost:8080/api/v1/employee', employee);
            console.log('Response:', response.data.message);
            if(response.status === 400){
                console.log(response.data.message);
            }
        } catch (error) {
            console.error('Error submitting employee data:', error);
        }
        setEmployeesData(prevEmployees => [...prevEmployees, employee]);
        
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
            degree: Number(form.get('degree')), // Parsing as number
            status: Number(form.get('status')), // Parsing as number
        };
        const id = employee.idemployee;
        try {
            const response = await axios.put(`http://localhost:8080/api/v1/employee/${id}`, employee);
            console.log('Response:', response.data.message);
        } catch (error) {
            console.error('Error submitting employee data:', error);
        }
        setEmployeesData(prevEmployees => {
            const updatedEmployees = prevEmployees.map(emp => {
                if (emp.idemployee === employee.idemployee) {
                    return { ...emp, ...employee };
                }
                return emp;
            });
            return updatedEmployees;
        });
   
    setShowModal(false);
    setSelectedEmployee(null); 
    }

    const handleFormSubmit = (event: FormEvent) => {
        event.preventDefault();
    
        const form = new FormData(event.target as HTMLFormElement);
        const updatedHoNV = form.get('hoNV') as string;
        const updatedTenNV = form.get('tenNV') as string;
    
        const updatedEmployees = employeesData.map(employee => {
            if (employee.idemployee === selectedEmployee?.idemployee) {
                // Nếu tìm thấy nhân viên được chọn, cập nhật họ và tên
                return {
                    ...employee,
                    hoNV: updatedHoNV,
                    tenNV: updatedTenNV
                };
            }
            return employee; // Trả về nguyên vẹn nhân viên khác
        });
    
        // Cập nhật lại danh sách nhân viên và đóng modal
        setEmployeesData(updatedEmployees);
    
        setSelectedEmployee(null); // Reset lại trạng thái sau khi cập nhật
        setShowModal(false);
      };
    return (
        <div className={classes.article}>
               <button className={classes.btn_add_emp} onClick={handleClickAdd}>Thêm nhân viên</button>
        <table>
            <thead>
                <tr>
                <th>Mã nhân viên</th>
                <th>Họ nhân viên</th>
                <th>Tên nhân viên</th>
                <th>Giới tính</th>
                <th>Ngày sinh</th>
                <th>Địa chỉ</th>
                <th>Số điện thoại</th>
                <th>CMND</th>
                <th>Email</th>
                <th>Bằng cấp</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
                </tr>
            </thead>

            <tbody>
                    {employeesData.map((employee, index) => (
                        <tr key={index}>
                            <td>{employee.idemployee}</td>
                            <td>{employee.firstname}</td>
                            <td>{employee.lastname}</td>
                            <td>{employee.gender}</td> 
                            <td>{employee.birthdate}</td>
                            <td>{employee.address}</td>
                            <td>{employee.phonenumber}</td>
                            <td>{employee.cmnd}</td>
                            <td>{employee.email}</td>
                            <td>{degreeToString(employee.degree)}</td>
                            <td>{statusToString(employee.status)}</td>
                            
                            <td>
                                <div className={classes.btn}>
                                    <button className={classes.btn_update} onClick={() => handleUpdateClick(employee)}>Cập nhật</button>
                                    {/* <a onClick={() => handleDeleteEmployee(employee.idemployee)}>Xóa</a> */}
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
                        <form id='employeeFormUpdate' className={classes.form_update} onSubmit={handleFormSubmit}>
                        <h2>Chỉnh sửa thông tin nhân viên</h2>
                        <div  className={classes.form_group}>
                                <label>Mã nhân viên:</label>
                                <input name="idemployee" type="text" defaultValue={selectedEmployee.idemployee} readOnly/>
                            </div>
                            <div  className={classes.form_group}>
                                <label>Họ nhân viên:</label>
                                <input name="firstname" type="text" required defaultValue={selectedEmployee.firstname}/>
                            </div>
                            <div  className={classes.form_group}>
                                <label>Tên nhân viên:</label>
                                <input name="lastname" type="text" required defaultValue={selectedEmployee.lastname}/>
                            </div>
                            
                                <div className={classes.form_group}>
                                    <label htmlFor="gender">Giới Tính:</label>
                                    <select id="gender" name="gender" required defaultValue={selectedEmployee.gender}>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                </div>
                                <div className={classes.form_group}>
                                    <label htmlFor="address">Địa Chỉ:</label>
                                    <input type="text" id="address" name="address" required defaultValue={selectedEmployee.address}/>
                                </div>
                                <div className={classes.form_group}>
                                    <label htmlFor="phonenumber">Số Điện Thoại:</label>
                                    <input type="text" id="phonenumber" name="phonenumber" required defaultValue={selectedEmployee.phonenumber}/>
                                </div>
                                <div className={classes.form_group}>
                                    <label htmlFor="cmnd">CMND:</label>
                                    <input type="text" id="cmnd" name="cmnd" required defaultValue={selectedEmployee.cmnd}/>
                                </div>
                                <div className={classes.form_group}>
                                    <label htmlFor="email">Email:</label>
                                    <input type="email" id="email" name="email" required defaultValue={selectedEmployee.email}/>
                                </div>
                                <div className={classes.form_group}>
                                    <label htmlFor="birthdate">Ngày sinh:</label>
                                    <input type="date" id="birthdate" name="birthdate" required defaultValue={selectedEmployee.birthdate}/>
                                </div>
                                <div className={classes.form_group}>
                                    <label htmlFor="degree">Bằng Cấp:</label>
                                    <select id="degree" name="degree" required defaultValue={selectedEmployee.degree}>
                                        <option value="1">Đại học</option>
                                        <option value="2">Cao đẳng</option>
                                        <option value="3">Thạc sĩ</option>
                                        <option value="4">Tiến sĩ</option>
                                    </select>
                                </div>
                                <div className={classes.form_group}>
                                    <label htmlFor="status">Trạng Thái:</label>
                                    <select id="status" name="status" required defaultValue={selectedEmployee.status}>
                                        <option value="1">Đang làm việc</option>
                                        <option value="0">Ngưng hoạt động</option>
                                    </select>
                                </div>
                        {/* Thêm các trường thông tin khác */}
                        <div className={classes.form_group_button}>
                          <button type="submit" className={classes.btn_submit} onClick={handleUpdateEmployee}>Lưu</button>
                          <button type="button"  className={classes.btn_cancel} onClick={handleCancelEdit}>Hủy</button>
                        </div>
                      </form>
                    ):  <form  id='employeeForm' className={classes.form_add_emp} onSubmit={handleFormSubmit}>
                    <h2>Thêm mới nhân viên</h2>
                            <div  className={classes.form_group}>
                                <label>Mã nhân viên:</label>
                                <input name="idemployee" type="text" defaultValue={employeeId} readOnly/>
                            </div>
                            <div  className={classes.form_group}>
                                <label>Họ nhân viên:</label>
                                <input name="firstname" type="text" required/>
                            </div>
                            <div  className={classes.form_group}>
                                <label>Tên nhân viên:</label>
                                <input name="lastname" type="text" required/>
                            </div>
                            <div>
                                <div className={classes.form_group}>
                                    <label htmlFor="gender">Giới Tính:</label>
                                    <select id="gender" name="gender" required>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                </div>
                                <div className={classes.form_group}>
                                    <label htmlFor="address">Địa Chỉ:</label>
                                    <input type="text" id="address" name="address" required/>
                                </div>
                                <div className={classes.form_group}>
                                    <label htmlFor="phonenumber">Số Điện Thoại:</label>
                                    <input type="text" id="phonenumber" name="phonenumber" required/>
                                </div>
                                <div className={classes.form_group}>
                                    <label htmlFor="cmnd">CMND:</label>
                                    <input type="text" id="cmnd" name="cmnd" required/>
                                </div>
                                <div className={classes.form_group}>
                                    <label htmlFor="email">Email:</label>
                                    <input type="email" id="email" name="email" required/>
                                </div>
                                <div className={classes.form_group}>
                                    <label htmlFor="birthdate">Ngày sinh:</label>
                                    <input type="date" id="birthdate" name="birthdate" required/>
                                </div>
                                <div className={classes.form_group}>
                                    <label htmlFor="degree">Bằng Cấp:</label>
                                    <select id="degree" name="degree" required>
                                        <option value="1">Đại học</option>
                                        <option value="2">Cao đẳng</option>
                                        <option value="3">Thạc sĩ</option>
                                        <option value="4">Tiến sĩ</option>
                                    </select>
                                </div>
                                <div className={classes.form_group}>
                                    <label htmlFor="status">Trạng Thái:</label>
                                    <select id="status" name="status" required>
                                        <option value="1">Đang làm việc</option>
                                        <option value="0">Ngưng hoạt động</option>
                                    </select>
                                </div>

                            </div>
                            <div className={classes.form_group_button}>
                                <button className={classes.btn_submit} type="submit" onClick={handleAddEmployee}>Thêm</button>
                                <button className={classes.btn_cancel} type="button" onClick={handleCancelEdit}>Hủy</button>
                            </div>
                </form>}
                </Modal>
            )}</div>
    </div>
    )
}