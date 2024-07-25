'use client'
import Image from 'next/image'
import classes from './navbar.module.css'
import Link from 'next/link'
export default function UserNavbar({ currentPath } : any){
    const username = localStorage.getItem('username');
    return (
        <div className={classes.navbar}>
            <div className={classes.navbar_image}>  
                <Image src="/images/nextjs-icon-dark-background.png" alt="Example"  width="50" height= "50"/>
            </div>
            <ul>
                <li className={currentPath === `dashboard` ? classes.active : ""}>
                <Link href={`/${username}/dashboard`}>Trang chủ</Link>
                </li>
                <li className={currentPath === `profile` ? classes.active : ""}>
                    <Link href={`/${username}/profile`}>Thông tin cá nhân</Link>
                </li>
                <li className={currentPath === `timesheet` ? classes.active : ""}>
                    <Link href={`/${username}/timesheet`}>Lịch làm việc</Link>
                </li>
                <li className={currentPath === `attendance` ? classes.active : ""}>
                    <Link href={`/${username}/attendance`}>Chấm công</Link>
                </li>
                <li className={currentPath === `/${username}/payroll` ? classes.active : ""}>
                    <Link href={`/${username}/payroll`}>Bảng lương</Link>
                </li>
                <li className={currentPath === `/${username}/rewardpunish` ? classes.active : ""}>
                    <Link href={`/${username}/rewardpunish`}>Bảng thưởng phạt</Link>
                </li>
                <li className={currentPath === `/${username}/contract` ? classes.active : ""}>
                    <Link href={`/${username}/contract`}>Hợp đồng lao động</Link>
                </li>
            </ul>
    </div>
    )
}