'use client'
import Image from 'next/image'
import classes from './navbar.module.css'
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronDown, faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie'
export default function HR_Navbar({ currentPath } : any){
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenAttendance,setIsOpenAttendance] = useState(false);
    const [isOpenEmployee,setIsOpenEmployee] = useState(false);
    useEffect(() => {
        const savedState = Cookies.get("menuState");
        const savedStateAttendance = Cookies.get('OpenAttendance')
        if (savedState) {
            setIsOpen(savedState === "true"); // Cookies lưu trạng thái dạng string
        }
        if(savedStateAttendance){
            setIsOpenAttendance(savedStateAttendance === "true");
        }
    }, []);
    
 

    const toggleMenuAttendance = ()=>{
        const newState = !isOpenAttendance;
        setIsOpenAttendance(newState); // Toggle trạng thái
        Cookies.set("OpenAttendance", newState.toString());
    }
    const handleSubItemClick = (e : any) => {
        e.stopPropagation(); 
        
    };

    const toggleMenuEmployee = ()=>{
        setIsOpenEmployee((prev)=>!prev);
    }
    return (
        <div className={classes.navbar}>
            <div className={classes.navbar_image}>
                <Image src="/images/nextjs-icon-dark-background.png" alt="Example" width="50" height="50" />
            </div>
            <ul>
                <li className={`${classes.listOptionMenu} ${currentPath === "/hr/dashboard" ? classes.active : ""}`}>
                    <Link href="/hr/dashboard">Trang chủ</Link>
                </li>
                <li className={`${classes.listOptionMenu} ${currentPath === "/hr/profile" ? classes.active : ""}`}>
                    <Link href="/hr/profile">Thông tin cá nhân</Link>
                </li>
                <li className={`${classes.subMenu} ${classes.listOptionMenu}`} onClick={toggleMenuEmployee}>
                    <a className={classes.subDrop}>
                        <span>Quản lý nhân viên</span>
                        <span className={classes.arrowList}>
                            {isOpenEmployee ? <FontAwesomeIcon icon={faCircleChevronDown} /> : <FontAwesomeIcon icon={faCircleChevronRight} />}
                        </span>
                    </a>
                    <ul className={`${classes.subMenuItem} ${isOpenEmployee ? classes.open : ''}`}>
                        <li className={`${currentPath === "/hr/employees" ? classes.active: ""}`} onClick={handleSubItemClick}>
                            <Link href="/hr/employees">Nhân viên</Link>
                        </li>
                        <li className={`${currentPath === "/hr/degree" ? classes.active: ""}`} onClick={handleSubItemClick}>
                            <Link href="/hr/degree">Bằng cấp</Link>
                        </li>
                        <li className={`${currentPath === "/hr/department" ? classes.active: ""}`} onClick={handleSubItemClick}>
                            <Link href="/hr/department">Phòng ban</Link>
                        </li>
                    </ul>
                </li>
                {/* <li className={`${classes.listOptionMenu} ${currentPath === "/hr/employees" ? classes.active : ""}`}>
                    <Link href="/hr/employees">Quản lý nhân viên</Link>
                </li> */}
                <li className={`${classes.listOptionMenu} ${currentPath === "/hr/workschedule" ? classes.active : ""}`}>
                    <Link href="/hr/workschedule">Quản lý lịch làm việc</Link>
                </li>
                <li className={`${classes.subMenu} ${classes.listOptionMenu}`} onClick={toggleMenuAttendance}>
                    <a className={classes.subDrop}>
                        <span>Quản lý chấm công</span>
                        <span className={classes.arrowList}>
                            {isOpenAttendance ? <FontAwesomeIcon icon={faCircleChevronDown} /> : <FontAwesomeIcon icon={faCircleChevronRight} />}
                        </span>
                    </a>
                    <ul className={`${classes.subMenuItem} ${isOpenAttendance ? classes.open : ''}`}>
                        <li className={`${currentPath === "/hr/attendance" ? classes.active: ""}`} onClick={handleSubItemClick}>
                            <Link href="/hr/attendance">Danh sách chấm công</Link>
                        </li>
                        <li className={`${currentPath === "/hr/workrecord" ? classes.active: ""}`} onClick={handleSubItemClick}>
                            <Link href="/hr/workrecord">Danh sách công tháng</Link>
                        </li>
                        <li className={`${currentPath === "/hr/attendance-explain" ? classes.active: ""}`} onClick={handleSubItemClick}>
                            <Link href="/hr/attendance-explain">Danh sách giải trình chấm công</Link>
                        </li>
                    </ul>
                </li>
                <li className={`${classes.listOptionMenu} ${currentPath === "/hr/payroll" ? classes.active : ""}`}>
                    <Link href="/hr/payroll">Quản lý tính lương</Link>
                </li>
                <li className={`${classes.listOptionMenu} ${currentPath === "/hr/rewardpunish" ? classes.active : ""}`}>
                    <Link href="/hr/rewardpunish">Quản lý thưởng phạt</Link>
                </li>
                 <li className={`${classes.listOptionMenu} ${currentPath === "/hr/leaverequest" ? classes.active : ""}`}>
                    <Link href="/hr/leaverequest">Quản lý nghỉ phép</Link>
                </li> 
                <li className={`${classes.listOptionMenu} ${currentPath === "/hr/contract" ? classes.active : ""}`}>
                    <Link href="/hr/contract">Quản lý hợp đồng lao động</Link>
                </li>
            </ul>
        </div>
    )
}