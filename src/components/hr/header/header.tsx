'use client'
import { useRouter } from "next/navigation";
import classes from "./header.module.css";
import Image from 'next/image'
import { useEffect, useState } from "react";

import { Employee } from "@/pages/api/admin/apiEmployee";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from 'js-cookie';
import FaceRegister from "@/components/cameraCapture/FaceRegister";
export default function HR_Header(){
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [employee,setEmployee] = useState<Employee>();
    const [isCameraVisible, setIsCameraVisible] = useState(false);

    const toggleCamera = () => {
      setIsCameraVisible(!isCameraVisible);
    };

    
   
    
    const toggleMenu = () => {
        setIsMenuVisible((prev) => !prev);
      };
    

  
    // Lấy email từ payload
    const email = localStorage.getItem('username');
    const token = Cookies.get('token');
    const roleDescription = localStorage.getItem('roleDescription');

    const router = useRouter();
    const handleLogout = ()=>{
        Cookies.remove('token');
        localStorage.removeItem('username');
        localStorage.removeItem('roleDescription');
        router.push('/login');
    }


    const handleChangePassword = ()=>{
      router.push('/hr/changepassword');
    }

    
   const handleDetailClick = async () => {
 
        try{
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/employee/${email}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                  }
            }
        );
        setEmployee(response.data.data);
        console.log("adasda");
        }catch(error){
          console.log("adadsdsda");
        }
      
      Swal.fire({
          title: `<strong>Chi tiết nhân viên</strong>`,
          html: `
              <div class="${classes.employeeDetails}">
      
                    <div class="${classes.formGroup}">
                      <label><strong>Hình ảnh:</strong></label>
                      <img  src="${`data:image/jpeg;base64,${employee!.image!}`}" alt=''
                                  width="100" height="100"/>
                  </div>
                  <div class="${classes.formGroup}"></div>
                  <div class="${classes.formGroup}">
                      <label><strong>Mã nhân viên:</strong></label>
                      <input type="text" value="${employee!.idEmployee}" readonly class="${classes.input}"/>
                  </div>
                  <div class="${classes.formGroup}">
                      <label><strong>Họ:</strong></label>
                      <input type="text" value="${employee!.firstName}" readonly class="${classes.input}"/>
                  </div>
                  <div class="${classes.formGroup}">
                      <label><strong>Tên:</strong></label>
                      <input type="text" value="${employee!.lastName}" readonly class="${classes.input}"/>
                  </div>
                  <div class="${classes.formGroup}">
                      <label><strong>Giới tính:</strong></label>
                      <input type="text" value="${employee!.gender}" readonly class="${classes.input}"/>
                  </div>
                  <div class="${classes.formGroup}">
                      <label><strong>Ngày sinh:</strong></label>
                      <input type="text" value="${employee!.birthDate}" readonly class="${classes.input}"/>
                  </div>
                  <div class="${classes.formGroup}">
                      <label><strong>Địa chỉ:</strong></label>
                      <input type="text" value="${employee!.address}" readonly class="${classes.input}"/>
                  </div>
                  <div class="${classes.formGroup}">
                      <label><strong>Số điện thoại:</strong></label>
                      <input type="text" value="${employee!.phoneNumber}" readonly class="${classes.input}"/>
                  </div>
                  <div class="${classes.formGroup}">
                      <label><strong>CMND:</strong></label>
                      <input type="text" value="${employee!.idCard}" readonly class="${classes.input}"/>
                  </div>
                  <div class="${classes.formGroup}">
                      <label><strong>Email:</strong></label>
                      <input type="text" value="${employee!.email}" readonly class="${classes.input}"/>
                  </div>
                   <div class="${classes.formGroup}">
                      <label><strong>Phòng ban:</strong></label>
                      <input type="text" value="${employee!.department}" readonly class="${classes.input}"/>
                  </div>
                   <div class="${classes.formGroup}">
                      <label><strong>Chức vụ:</strong></label>
                      <input type="text" value="${employee!.position}" readonly class="${classes.input}"/>
                  </div>
                  <div class="${classes.formGroupPair}">
                      <div class="${classes.formGroup}">
                          <label><strong>Bằng cấp:</strong></label>
                          <input type="text" value="${employee!.degree}" readonly class="${classes.input}"/>
                      </div>
                      <div class="${classes.formGroup}">
                          <label><strong>Trạng thái:</strong></label>
                          <input type="text" value="${employee!.status}" readonly class="${classes.input}"/>
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

    return (
        <div className={classes.header}>
            <div>
            <button className={classes.faceRegisterButton} onClick={toggleCamera}>
        {isCameraVisible ? "Tắt đăng ký" : "Đăng ký khuôn mặt"}
      </button>

      {isCameraVisible && <FaceRegister/>}
            </div>
            <div className={classes.option_title} >
            <h5>Xin chào, {email}</h5>
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
          <li onClick={handleDetailClick}>Thông tin cá nhân</li>
          <li onClick={handleChangePassword}>Đổi mật khẩu</li>
          <li onClick={handleLogout}>Đăng xuất</li>
        </ul>
      )}
    </div>
 
    
    )
}