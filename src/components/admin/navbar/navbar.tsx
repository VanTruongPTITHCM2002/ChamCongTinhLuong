
import Image from 'next/image'
import classes from './navbar.module.css'
export default function Navbar(){
    return (
        <div className={classes.navbar}>
            <div className={classes.navbar_image}>  
                <img src="/images/nextjs-icon-dark-background.png" alt="Example"  width="50" height= "50"/>
            </div>
        <ul>
            
            <li><a href="/admin/dashboard">Trang chủ</a></li>
            <li><a href="/admin/accounts">Quản lý tài khoản</a></li>
            <li><a href="/admin/employees">Quản lý nhân viên</a></li>
            <li><a href="#">Quản lý lịch làm việc</a></li>
            <li><a href="#">Quản lý chấm công</a></li>
            <li><a href="#">Quản lý tính lương</a></li>
            <li><a href="#">Quản lý thưởng phạt</a></li>
        </ul>
    </div>
    )
}