'use client'
import { useRouter } from "next/navigation";
import classes from "./header.module.css";
import Image from 'next/image'
import { useState } from "react";
import Cookies from "js-cookie";
import { Employee } from "@/pages/api/admin/apiEmployee";
import { addAuditLogServer } from "@/pages/api/admin/apiAuditLog";
import { format } from "date-fns";

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
    const token = localStorage.getItem('token');
    const roleDescription = localStorage.getItem('roleDescription');

    const router = useRouter();
    const handleLogout = async ()=>{
        Cookies.remove('token');
        localStorage.removeItem('username');
        localStorage.removeItem('roleDescription');
        await addAuditLogServer({
          username:email!,
          action:"Đăng xuất",
          description:(email === 'admin' ? email: "Nhân viên " + email ) + " đã đăng xuất hệ thống",
          createtime:format(new Date(), 'dd/MM/yyyy HH:mm:ss')
      })
        router.push('/login');
    }


    const handleChangePassword = ()=>{
      router.push('/admin/changepassword');
    }

    
  

    return (
        <div className={classes.header}>
            <div>
         
            </div>
            <div className={classes.option_title}>
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