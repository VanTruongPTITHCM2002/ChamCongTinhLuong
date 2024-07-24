import Navbar from '@/components/admin/navbar'
import classes from './style.module.css'
import Header from '@/components/admin/header'
import AdminAttendancePage from '@/components/admin/attendance/attendance'
export default function Account(){
    return (
        <div>
            <Navbar currentPath="/admin/attendance"/>
            <div className={classes.maincontainer}>
            <Header/>
            <AdminAttendancePage/>
            </div>
        </div>
    )
}