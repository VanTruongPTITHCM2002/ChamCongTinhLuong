
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
    const decoded:any = jwt.verify(String(localStorage.getItem('token')), String(process.env.NEXT_PUBLIC_SECRET_KEY));

  
    // Lấy email từ payload
    const email = decoded.email;
    console.log(email);
    const router = useRouter();
    const handleLogout = ()=>{
        localStorage.removeItem('token');
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