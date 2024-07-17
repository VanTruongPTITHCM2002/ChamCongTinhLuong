
import Image from 'next/image'
import classes from './navbar.module.css'
import Link from 'next/link'
export default function Navbar(){
    return (
        <div className={classes.navbar}>
            <div className={classes.navbar_image}>  
                {/* <img src="/images/nextjs-icon-dark-background.png" alt="Example"  width="50" height= "50"/> */}
                <Image src="/images/nextjs-icon-dark-background.png" alt="Example"  width="50" height= "50"/>
            </div>
        <ul>
            
            <li><Link href="/admin/dashboard">Trang chủ</Link></li>
            <li><Link href="/admin/accounts">Quản lý tài khoản</Link></li>
            <li><Link href="/admin/employees">Quản lý nhân viên</Link></li>
            <li><Link href="/admin/workschedule">Quản lý lịch làm việc</Link></li>
            <li><Link href="/admin/attendance">Quản lý chấm công</Link></li>
            <li><Link href="/admin/payroll">Quản lý tính lương</Link></li>
            <li><Link href="#">Quản lý thưởng phạt</Link></li>
            <li><Link href='#'>Quản lý hợp đồng lao động</Link></li>
        </ul>
    </div>
    )
}