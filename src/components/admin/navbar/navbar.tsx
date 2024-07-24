
import Image from 'next/image'
import classes from './navbar.module.css'
import Link from 'next/link'
export default function Navbar({ currentPath } : any){
    
    return (
        <div className={classes.navbar}>
            <div className={classes.navbar_image}>  
                {/* <img src="/images/nextjs-icon-dark-background.png" alt="Example"  width="50" height= "50"/> */}
                <Image src="/images/nextjs-icon-dark-background.png" alt="Example"  width="50" height= "50"/>
            </div>
            <ul>
                <li className={currentPath === "/admin/dashboard" ? classes.active : ""}>
                    <Link href="/admin/dashboard">Trang chủ</Link>
                </li>
                <li className={currentPath === "/admin/accounts" ? classes.active : ""}>
                    <Link href="/admin/accounts">Quản lý tài khoản</Link>
                </li>
                <li className={currentPath === "/admin/employees" ? classes.active : ""}>
                    <Link href="/admin/employees">Quản lý nhân viên</Link>
                </li>
                <li className={currentPath === "/admin/workschedule" ? classes.active : ""}>
                    <Link href="/admin/workschedule">Quản lý lịch làm việc</Link>
                </li>
                <li className={currentPath === "/admin/attendance" ? classes.active : ""}>
                    <Link href="/admin/attendance">Quản lý chấm công</Link>
                </li>
                <li className={currentPath === "/admin/payroll" ? classes.active : ""}>
                    <Link href="/admin/payroll">Quản lý tính lương</Link>
                </li>
                <li className={currentPath === "/admin/rewardpunish" ? classes.active : ""}>
                    <Link href="/admin/rewardpunish">Quản lý thưởng phạt</Link>
                </li>
                <li className={currentPath === "/admin/contract" ? classes.active : ""}>
                    <Link href="/admin/contract">Quản lý hợp đồng lao động</Link>
                </li>
            </ul>
    </div>
    )
}