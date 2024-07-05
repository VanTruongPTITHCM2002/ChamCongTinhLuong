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
    hiredate: string;
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
                <th>Địa chỉ</th>
                <th>Số điện thoại</th>
                <th>CMND</th>
                <th>Email</th>
                <th>Ngày làm việc</th>
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
                            <td>{employee.address}</td>
                            <td>{employee.phonenumber}</td>
                            <td>{employee.cmnd}</td>
                            <td>{employee.email}</td>
                            <td>{employee.hiredate}</td>
                            <td>{employee.degree}</td>
                            <td>{employee.status}</td>
                            <td>
                                <div className={classes.btn}>
                                    <a onClick={() => handleUpdateClick(employee)}>Cập nhật</a>
                                    <a onClick={() => handleDeleteEmployee(employee.idemployee)}>Xóa</a>
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
                        <form onSubmit={handleFormSubmit}>
                        <h2>Chỉnh sửa thông tin nhân viên</h2>
                        <div>
                          <label>Mã nhân viên:</label>
                          <input type="text" defaultValue={selectedEmployee.idemployee} readOnly />
                        </div>
                        <div>
                          <label>Họ nhân viên:</label>
                          <input name = "hoNV" type="text" defaultValue={selectedEmployee.firstname}  />
                        </div>
                        <div>
                          <label>Tên nhân viên:</label>
                          <input name = "tenNV" type="text" defaultValue={selectedEmployee.lastname}  />
                        </div>
                        {/* Thêm các trường thông tin khác */}
                        <div>
                          <button type="submit">Lưu</button>
                          <button type="button" onClick={handleCancelEdit}>Hủy</button>
                        </div>
                      </form>
                    ):  <form className={classes.form_add_emp} onSubmit={handleFormSubmit}>
                    <h2>Thêm mới nhân viên</h2>
                            <div  className={classes.form_group}>
                                <label>Mã nhân viên:</label>
                                <input name="maNV" type="text" required/>
                            </div>
                            <div  className={classes.form_group}>
                                <label>Họ nhân viên:</label>
                                <input name="hoNV" type="text" required/>
                            </div>
                            <div  className={classes.form_group}>
                                <label>Tên nhân viên:</label>
                                <input name="tenNV" type="text" required/>
                            </div>
                            <div>
                                <div className={classes.form_group}>
                                    <label htmlFor="gioiTinh">Giới Tính:</label>
                                    <select id="gioiTinh" name="gioiTinh" required>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                </div>
                                <div className={classes.form_group}>
                                    <label htmlFor="diaChi">Địa Chỉ:</label>
                                    <input type="text" id="diaChi" name="diaChi" required/>
                                </div>
                                <div className={classes.form_group}>
                                    <label htmlFor="soDienThoai">Số Điện Thoại:</label>
                                    <input type="text" id="soDienThoai" name="soDienThoai" required/>
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
                                    <label htmlFor="ngayLamViec">Ngày Làm Việc:</label>
                                    <input type="date" id="ngayLamViec" name="ngayLamViec" required/>
                                </div>
                                <div className={classes.form_group}>
                                    <label htmlFor="bangCap">Bằng Cấp:</label>
                                    <select id="bangCap" name="bangCap" required>
                                        <option value="1">Đại học</option>
                                        <option value="2">Cao đẳng</option>
                                        <option value="3">Thạc sĩ</option>
                                        <option value="4">Tiến sĩ</option>
                                    </select>
                                </div>
                                <div className={classes.form_group}>
                                    <label htmlFor="trangThai">Trạng Thái:</label>
                                    <select id="trangThai" name="trangThai" required>
                                        <option value="1">Đang làm việc</option>
                                        <option value="0">Ngưng hoạt động</option>
                                    </select>
                                </div>

                            </div>
                            <div className={classes.form_group_button}>
                                <button className={classes.btn_submit} type="submit">Thêm</button>
                                <button className={classes.btn_cancel} type="button" onClick={handleCancelEdit}>Hủy</button>
                            </div>
                </form>}
                </Modal>
            )}</div>
    </div>
    )
}