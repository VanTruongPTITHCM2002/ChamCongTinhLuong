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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
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
    let email = '';
    if (typeof window !== 'undefined'){
     email = localStorage.getItem('username')!;
    }
    const token = Cookies.get('token');
    let roleDescription = '';
    if(typeof window !== 'undefined'){
      roleDescription = localStorage.getItem('roleDescription')!;
    }
    

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

    
   

    return (
        <div className={classes.header}>
            <div>
            <button className={classes.faceRegisterButton} onClick={toggleCamera}>
        {isCameraVisible ? "Tắt đăng ký" : "Đăng ký khuôn mặt"}
      </button>

      {isCameraVisible && <FaceRegister/>}
            </div>
            <div className={classes.option_title} >
                {/* <button style={{marginRight:"5px", height:"30px",width:"50px",cursor:"pointer",backgroundColor:"purple",border:"none"}}>
                              <FontAwesomeIcon icon={faBell}/>
                            </button> */}
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
        
          <li onClick={handleChangePassword}>Đổi mật khẩu</li>
          <li onClick={handleLogout}>Đăng xuất</li>
        </ul>
      )}
    </div>
 
    
    )
}