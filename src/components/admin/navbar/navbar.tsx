'use client'
import Image from 'next/image'
import classes from './navbar.module.css'
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronDown, faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';
export default function Navbar({ currentPath } : any){
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(prevState => !prevState); // Đảo ngược trạng thái khi click
    };
    const handleSubItemClick = (e : any) => {
        e.stopPropagation(); // Ngừng sự kiện click để không ảnh hưởng đến toggle menu
    };
    return (
        <div className={classes.navbar}>
            <div className={classes.navbar_image}>
                <Image src="/images/nextjs-icon-dark-background.png" alt="Example" width="50" height="50" />
            </div>
            <ul>
                <li className={`${classes.listOptionMenu} ${currentPath === "/admin/dashboard" ? classes.active : ""}`}>
                    <Link href="/admin/dashboard">Trang chủ</Link>
                </li>
                <li className={`${classes.subMenu} ${classes.listOptionMenu}`} onClick={toggleMenu}>
                    <a className={classes.subDrop}>
                        <span>Quản lý tài khoản</span>
                        <span className={classes.arrowList}>
                            {isOpen ? <FontAwesomeIcon icon={faCircleChevronDown} /> : <FontAwesomeIcon icon={faCircleChevronRight} />}
                        </span>
                    </a>
                    <ul className={`${classes.subMenuItem} ${isOpen ? classes.open : ''}`}>
                        <li className={`${currentPath === "/admin/accounts" ? classes.active: ""}`} onClick={handleSubItemClick}>
                            <Link href="/admin/accounts">Tài khoản</Link>
                        </li>
                        {/* <li className={`${currentPath === "/admin/permissons" ? classes.active: ""}`} onClick={handleSubItemClick}>
                            <Link href="/admin/permissons">Quyền</Link>
                        </li> */}
                        <li className={`${currentPath === "/admin/roles" ? classes.active: ""}`} onClick={handleSubItemClick}>
                            <Link href="/admin/roles">Vai trò</Link>
                        </li>
                    </ul>
                </li>
                <li className={`${classes.listOptionMenu} ${currentPath === "/admin/employees" ? classes.active : ""}`}>
                    <Link href="/admin/employees">Quản lý nhân viên</Link>
                </li>
                <li className={`${classes.listOptionMenu} ${currentPath === "/admin/workschedule" ? classes.active : ""}`}>
                    <Link href="/admin/workschedule">Quản lý lịch làm việc</Link>
                </li>
                <li className={`${classes.listOptionMenu} ${currentPath === "/admin/attendance" ? classes.active : ""}`}>
                    <Link href="/admin/attendance">Quản lý chấm công</Link>
                </li>
                <li className={`${classes.listOptionMenu} ${currentPath === "/admin/payroll" ? classes.active : ""}`}>
                    <Link href="/admin/payroll">Quản lý tính lương</Link>
                </li>
                <li className={`${classes.listOptionMenu} ${currentPath === "/admin/rewardpunish" ? classes.active : ""}`}>
                    <Link href="/admin/rewardpunish">Quản lý thưởng phạt</Link>
                </li>
                <li className={`${classes.listOptionMenu} ${currentPath === "/admin/contract" ? classes.active : ""}`}>
                    <Link href="/admin/contract">Quản lý hợp đồng lao động</Link>
                </li>
                <li className={`${classes.listOptionMenu} ${currentPath === "/admin/notification" ? classes.active : ""}`}>
                    <Link href="/admin/notification">Quản lý thông báo</Link>
                </li>
                <li className={`${classes.listOptionMenu} ${currentPath === "/admin/settings" ? classes.active : ""}`}>
                    <Link href="/admin/settings">Cài đặt hệ thống</Link>
                </li>
            </ul>
        </div>
    )
}