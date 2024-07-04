'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare,faTrash } from '@fortawesome/free-solid-svg-icons';
import classes from './employees.module.css'
import Modal from '../modal'
import { useState,FormEvent } from 'react';
import { useRouter } from 'next/navigation';
interface Employee {
    maNV: string;
    hoNV: string;
    tenNV: string;
    gioiTinh: string;
    diaChi: string;
    soDienThoai: string;
    cmnd: string;
    email: string;
    ngayLamViec: string;
    bangCap: string;
    trangThai: string;
}
export default function EmployeesPage(){
    const router = useRouter();
    
  
   
    const [employeesData, setEmployeesData] = useState<Employee[]>([
        {
            maNV: 'NV001',
            hoNV: 'Nguyễn Văn',
            tenNV: 'Trường',
            gioiTinh: 'Nam',
            diaChi: '60/1/2',
            soDienThoai: '08900809890',
            cmnd: '012313123123',
            email: 'trerq@gmail.com',
            ngayLamViec: '2024-07-02',
            bangCap: 'Đại học',
            trangThai: 'Đang làm việc'
        },
        {
            maNV: 'NV002',
            hoNV: 'Lê Thị',
            tenNV: 'Mai',
            gioiTinh: 'Nữ',
            diaChi: '123 Nguyễn Văn Linh',
            soDienThoai: '0987654321',
            cmnd: '0123456789',
            email: 'lethimai@gmail.com',
            ngayLamViec: '2024-06-30',
            bangCap: 'Cao đẳng',
            trangThai: 'Đang làm việc'
        },
        // Thêm các đối tượng nhân viên khác nếu cần
    ]);
   
    const [showModal, setShowModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const handleDeleteEmployee = (maNV: string) => {
        // Tạo mảng mới chỉ chứa những nhân viên không có mã nhân viên bằng maNV
        const updatedEmployees = employeesData.filter(employee => employee.maNV !== maNV);
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
            if (employee.maNV === selectedEmployee?.maNV) {
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
      const handleLogout = ()=>{
          localStorage.removeItem('token');
          router.push('/login');
      }
     
     
    return (
        <div className={classes.container}>
        <div className={classes.navbar}>
            <ul>
                <li><a href="/dashboard">Trang chủ</a></li>
                <li><a href="#">Quản lý tài khoản</a></li>
                <li><a href="/employees">Quản lý nhân viên</a></li>
                <li><a href="#">Quản lý lịch làm việc</a></li>
                <li><a href="#">Quản lý chấm công</a></li>
                <li><a href="#">Quản lý tính lương</a></li>
            </ul>
        </div>

        <div className={classes.maincontainer}>
            <div className={classes.header}>
                <h1>Nguyễn Văn Trường</h1>

                <button onClick={handleLogout}>Đăng xuất</button>
            </div>


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
                                    <td>{employee.maNV}</td>
                                    <td>{employee.hoNV}</td>
                                    <td>{employee.tenNV}</td>
                                    <td>{employee.gioiTinh}</td>
                                    <td>{employee.diaChi}</td>
                                    <td>{employee.soDienThoai}</td>
                                    <td>{employee.cmnd}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.ngayLamViec}</td>
                                    <td>{employee.bangCap}</td>
                                    <td>{employee.trangThai}</td>
                                    <td>
                                        <div className={classes.btn}>
                                            <a onClick={() => handleUpdateClick(employee)}>Cập nhật</a>
                                            <a onClick={() => handleDeleteEmployee(employee.maNV)}>Xóa</a>
                                        </div>
                                    </td>
                                </tr>
                                 ))}
                        </tbody>
                </table>
            </div>
        </div>
        <div id="modal-root"> {showModal && (
                <Modal onClose={handleCloseModal}>
                    {/* Nội dung modal */}
                    {selectedEmployee ? (
                        <form onSubmit={handleFormSubmit}>
                        <h2>Chỉnh sửa thông tin nhân viên</h2>
                        <div>
                          <label>Mã nhân viên:</label>
                          <input type="text" defaultValue={selectedEmployee.maNV} readOnly />
                        </div>
                        <div>
                          <label>Họ nhân viên:</label>
                          <input name = "hoNV" type="text" defaultValue={selectedEmployee.hoNV}  />
                        </div>
                        <div>
                          <label>Tên nhân viên:</label>
                          <input name = "tenNV" type="text" defaultValue={selectedEmployee.tenNV}  />
                        </div>
                        {/* Thêm các trường thông tin khác */}
                        <div>
                          <button type="submit">Lưu</button>
                          <button type="button" onClick={handleCancelEdit}>Hủy</button>
                        </div>
                      </form>
                    ):  <form onSubmit={handleFormSubmit}>
                    <h2>Thêm mới nhân viên</h2>
                    <div>
                        <label>Mã nhân viên:</label>
                        <input name="maNV" type="text" />
                    </div>
                    <div>
                        <label>Họ nhân viên:</label>
                        <input name="hoNV" type="text" />
                    </div>
                    <div>
                        <label>Tên nhân viên:</label>
                        <input name="tenNV" type="text" />
                    </div>
                    {/* Thêm các trường thông tin khác */}
                    <div>
                        <button type="submit">Thêm</button>
                        <button type="button" onClick={handleCancelEdit}>Hủy</button>
                    </div>
                </form>}
                </Modal>
            )}</div>
       
    </div>
    )
}