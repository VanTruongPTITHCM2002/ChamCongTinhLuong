'use client'
import { useRouter } from "next/navigation";
import classes from "./header.module.css";
import Image from 'next/image'
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { successSwal } from "@/custom/sweetalert";
import Cookies from "js-cookie";
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
export default function Header(){
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [admin,setAdmin] = useState<Employee>();
    
    const toggleMenu = () => {
      if(isMenuVisible){
        setIsMenuVisible(false);
      }
      setIsMenuVisible(!isMenuVisible);
    };
    

  
    // Lấy email từ payload
    const email = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    const roleDescription = localStorage.getItem('roleDescription');
    const defaultEmployee: Employee = {
      idemployee: '',
      firstname: '',
      lastname: '',
      gender: '',
      birthdate: '',
      cmnd: '',
      email: '',
      phonenumber: '',
      address: '',
      degree: '',
      status: '',
  };
  const employeeToUse = admin || defaultEmployee;
    const router = useRouter();
    const handleLogout = ()=>{
        localStorage.removeItem('token');
        Cookies.remove('token');
        localStorage.removeItem('username');
        router.push('/login');
    }
//     const getEmployeeById = async () => {
//       try {
//           const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/employee/${email}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                   }
//             }
//           );
//           if (response.status === 200) {
//               // successSwal("Thành công",`${response.data.message}`);
//               setAdmin(response.data.data);
//           }
//       } catch (error) {

//       }
//   }
//   useEffect(() => {
//       getEmployeeById();
//   }, [])

    const handleChangePassword = ()=>{
      router.push('/admin/changepassword');
    }

    const ShowAndUpdateProfile = (admin: Employee) => {
      Swal.fire({
          title: `<strong>Chi tiết nhân viên</strong>`,
          html: `
              <div class="${classes.employeeDetails}">
                  <div class="${classes.formGroup}">
                      <label><strong>Mã nhân viên:</strong></label>
                      <input type="text" value="${admin.idemployee}" readonly class="${classes.input}" id="idemployee"/>
                  </div>
                  <div class="${classes.formGroup}">
                      <label><strong>Họ:</strong></label>
                      <input type="text" value="${admin.firstname}" readonly class="${classes.input}" id="firstname"/>
                  </div>
                  <div class="${classes.formGroup}">
                      <label><strong>Tên:</strong></label>
                      <input type="text" value="${admin.lastname}" readonly class="${classes.input}" id="lastname"/>
                  </div>
                  <div class="${classes.formGroup}">
                      <label><strong>Giới tính:</strong></label>
                      <input type="text" value="${admin.gender}" readonly class="${classes.input}" id="gender"/>
                  </div>
                  <div class="${classes.formGroup}">
                      <label><strong>Ngày sinh:</strong></label>
                      <input type="text" value="${admin.birthdate}" readonly class="${classes.input}" id="birthdate"/>
                  </div>
                  <div class="${classes.formGroup}">
                      <label><strong>Địa chỉ:</strong></label>
                      <input type="text" value="${admin.address}" readonly class="${classes.input}" id="address"/>
                  </div>
                  <div class="${classes.formGroup}">
                      <label><strong>Số điện thoại:</strong></label>
                      <input type="text" value="${admin.phonenumber}" readonly class="${classes.input}" id="phonenumber"/>
                  </div>
                  <div class="${classes.formGroup}">
                      <label><strong>CMND:</strong></label>
                      <input type="text" value="${admin.cmnd}" readonly class="${classes.input}" id="cmnd"/>
                  </div>
                  <div class="${classes.formGroup}">
                      <label><strong>Email:</strong></label>
                      <input type="text" value="${admin.email}" readonly class="${classes.input}" id="email"/>
                  </div>
                  <div class="${classes.formGroup}">
                      <label><strong>Bằng cấp:</strong></label>
                      <input type="text" value="${admin.degree}" readonly class="${classes.input}" id="degree"/>
                  </div>
                  <div class="${classes.formGroup}">
                      <label><strong>Trạng thái:</strong></label>
                      <input type="text" value="${admin.status}" readonly class="${classes.input}" id="status"/>
                  </div>
              </div>
          `,
          width: 700,
          padding: '10px',
          background: '#f9f9f9',
          showCancelButton: true,
          confirmButtonColor: '#007bff',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Thay đổi',
          cancelButtonText: 'Hủy',
          customClass: {
              popup: classes.customSwalPopup,
              title: classes.customSwalTitle,
              htmlContainer: classes.customSwalHtml
          },
          preConfirm: () => {
              // Chức năng khi bấm "Thay đổi"
              const editableFields = document.querySelectorAll('.swal2-html-container input');
              editableFields.forEach(field => field.removeAttribute('readonly'));
  
              // Sau khi người dùng bấm "Thay đổi", cập nhật các trường để cho phép chỉnh sửa
              Swal.fire({
                  title: 'Cập nhật thông tin',
                  html: `
                      <div class="${classes.employeeDetails}">
                          <div class="${classes.formGroup}">
                              <label><strong>Mã nhân viên:</strong></label>
                              <input type="text" value="${admin.idemployee}" readonly class="${classes.input}" id="idemployee"/>
                          </div>
                          <div class="${classes.formGroup}">
                              <label><strong>Họ:</strong></label>
                              <input type="text" value="${admin.firstname}" class="${classes.input}" id="firstname"/>
                          </div>
                          <div class="${classes.formGroup}">
                              <label><strong>Tên:</strong></label>
                              <input type="text" value="${admin.lastname}" class="${classes.input}" id="lastname"/>
                          </div>
                          <div class="${classes.formGroup}">
                              <label><strong>Giới tính:</strong></label>
                              <select class="${classes.input}" id="gender">
                                  <option value="Nam" ${admin.gender === 'Nam' ? 'selected' : ''}>Nam</option>
                                  <option value="Nữ" ${admin.gender === 'Nữ' ? 'selected' : ''}>Nữ</option>
                              </select>
                          </div>
                          <div class="${classes.formGroup}">
                              <label><strong>Ngày sinh:</strong></label>
                              <input type="date" value="${admin.birthdate}" class="${classes.input}" id="birthdate"/>
                          </div>
                          <div class="${classes.formGroup}">
                              <label><strong>Địa chỉ:</strong></label>
                              <input type="text" value="${admin.address}" class="${classes.input}" id="address"/>
                          </div>
                          <div class="${classes.formGroup}">
                              <label><strong>Số điện thoại:</strong></label>
                              <input type="text" value="${admin.phonenumber}" class="${classes.input}" id="phonenumber"/>
                          </div>
                          <div class="${classes.formGroup}">
                              <label><strong>CMND:</strong></label>
                              <input type="text" value="${admin.cmnd}" class="${classes.input}" id="cmnd"/>
                          </div>
                          <div class="${classes.formGroup}">
                              <label><strong>Email:</strong></label>
                              <input type="text" value="${admin.email}" class="${classes.input}" id="email"/>
                          </div>
                          <div class="${classes.formGroupPair}">
                              <div class="${classes.formGroup}">
                                  <label><strong>Bằng cấp:</strong></label>
                                
                                   <select class="${classes.input}" id="degree">
                                  <option value="Đại học" ${admin.degree === 'Đại học' ? 'selected' : ''}>Đại học</option>
                                  <option value="Cao đẳng" ${admin.degree === 'Cao đẳng' ? 'selected' : ''}>Cao đẳng</option>
                                  <option value="Thạc sĩ" ${admin.degree === 'Thạc sĩ' ? 'selected' : ''}>Thạc sĩ</option>
                                  <option value="Tiến sĩ" ${admin.degree === 'Tiến sĩ' ? 'selected' : ''}>Tiến sĩ</option>
                              </select>
                              </div>
                              <div class="${classes.formGroup}">
                                  <label><strong>Trạng thái:</strong></label>
                                  <input type="text" value="${admin.status}" readonly class="${classes.input}" id="status"/>
                              </div>
                          </div>
                      </div>
                  `,
                  showCancelButton: true,
                  confirmButtonColor: '#007bff',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Lưu',
                  cancelButtonText: 'Hủy',
                  customClass: {
                      popup: classes.customSwalPopup,
                      title: classes.customSwalTitle,
                      htmlContainer: classes.customSwalHtml
                  }
              }).then(async (result) => {
                  if (result.isConfirmed) {
                      // Lấy dữ liệu từ các trường nhập liệu sau khi nhấn "Lưu"
                      const updatedEmployee = {
                          idemployee: (document.getElementById('idemployee') as HTMLInputElement)?.value ?? '',
                          firstname: (document.getElementById('firstname') as HTMLInputElement)?.value ?? '',
                          lastname: (document.getElementById('lastname') as HTMLInputElement)?.value ?? '',
                          gender: (document.getElementById('gender') as HTMLSelectElement)?.value ?? '',
                          birthdate: (document.getElementById('birthdate') as HTMLInputElement)?.value ?? '',
                          address: (document.getElementById('address') as HTMLInputElement)?.value ?? '',
                          phonenumber: (document.getElementById('phonenumber') as HTMLInputElement)?.value ?? '',
                          cmnd: (document.getElementById('cmnd') as HTMLInputElement)?.value ?? '',
                          email: (document.getElementById('email') as HTMLInputElement)?.value ?? '',
                          degree: (document.getElementById('degree') as HTMLInputElement)?.value ?? '',
                          status: (document.getElementById('status') as HTMLInputElement)?.value ?? ''
                      };
                      
                      try {
                          const response = await axios.put(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/employee/${updatedEmployee.idemployee}`, updatedEmployee,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                  }
                            }
                          );
                          if (response.status === 200) {
                              Swal.fire('Thành công', `${response.data.message}`, 'success');
                              setAdmin(updatedEmployee);
                              // Refresh hoặc chuyển hướng nếu cần
                          }
                      } catch (error) {
                          Swal.fire('Thất bại', 'Đã có lỗi xảy ra', 'error');
                      }
                  }
              });
          }
      });
  };
  
  

    return (
        <div className={classes.header}>
            <div>
         
            </div>
            <div className={classes.option_title}>
            <h5>Xin chào, {email}</h5>
            
            {/* <img src="/images/download.jpg" alt="Avatar" className={classes.avatar}></img> */}
            <Image src="/images/download.jpg" alt="Example"  className={classes.avatar} width="50" height= "50"
            onClick={toggleMenu}
            />
            
            <div className={classes.option_title_sub}>
                <h6>{roleDescription}</h6>
            </div>  

            </div>
        
           
        {/* <button type="submit" className={classes.btn_logout} onClick={handleLogout}>Đăng xuất</button> */}
        {isMenuVisible && (
        <ul className={classes.dropdownMenu}>
          <li onClick={()=>ShowAndUpdateProfile(employeeToUse)}>Thông tin cá nhân</li>
          <li onClick={handleChangePassword}>Đổi mật khẩu</li>
          <li onClick={handleLogout}>Đăng xuất</li>
        </ul>
      )}

        
     
                  </div>
 
    
    )
}