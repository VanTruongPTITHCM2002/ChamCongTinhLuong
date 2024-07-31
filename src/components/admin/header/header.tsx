
'use client'
import { useRouter } from "next/navigation";
import classes from "./header.module.css";
import Image from 'next/image'
import { useState } from "react";
import jwt from 'jsonwebtoken'
import Modal from "@/components/modal";

export default function Header(){
    const [isMenuVisible, setIsMenuVisible] = useState(false);
   
    
    const toggleMenu = () => {
      if(isMenuVisible){
        setIsMenuVisible(false);
      }
      setIsMenuVisible(!isMenuVisible);
    };
    

  
    // Lấy email từ payload
    const email = localStorage.getItem('username');
   
    const router = useRouter();
    const handleLogout = ()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        router.push('/login');
    }

    const handleChangePassword = ()=>{
      router.push('/admin/changepassword');
    }
    return (
        <div className={classes.header}>
            <h5>Xin chào, {email}</h5>
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
 
    
    )
}