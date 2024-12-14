
'use client'
import { useRouter } from "next/navigation";
import classes from "./header.module.css";
import Image from 'next/image'
import { useEffect, useState } from "react";
import jwt from 'jsonwebtoken'
import Modal from "@/components/modal";
import { getEmpIdemployee } from "@/pages/api/admin/apiEmployee";

export default function UserHeader(){
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [nameEmployee,setNameEmployee] = useState('');
   
 
    
    const toggleMenu = () => {
      if(isMenuVisible){
        setIsMenuVisible(false);
      }
      setIsMenuVisible(!isMenuVisible);
    };
    

  
    // Lấy email từ payload
    let username = '';
    if (typeof window !== 'undefined'){
     username = localStorage.getItem('username')!;

    }
    const router = useRouter();
    const handleLogout = ()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        router.push('/login');
    }

    const handleChangePassword = ()=>{
      router.push(`/${username}/changepassword`);
    }
    return (
        <div className={classes.header}>
          <div>
             <h3>Ứng dụng chấm công và tính lương dành cho nhân viên</h3>
          </div>
           <div className={classes.option_title}>
           <h5>Xin chào, {username}</h5>
            {/* <img src="/images/download.jpg" alt="Avatar" className={classes.avatar}></img> */}
            <Image src="/images/download.jpg" alt="Example"  className={classes.avatar} width="50" height= "50"
            onClick={toggleMenu}
            />
        {/* <button type="submit" className={classes.btn_logout} onClick={handleLogout}>Đăng xuất</button> */}
        {isMenuVisible && (
        <ul className={classes.dropdownMenu}>
          <li onClick={handleChangePassword}>Đổi mật khẩu</li>
          <li onClick={handleLogout}>Đăng xuất</li>
        </ul>
      )}
           </div>

            

        
     
                  </div>
 
    
    )
}