
import Navbar from '@/components/admin/navbar'
import classes from './style.module.css'
import Header from '@/components/admin/header'
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { getServerSideAttedanceExplain } from '@/pages/api/admin/apiAttendance_Explain'
import AdminAttendanceExplainPage from '@/components/admin/attendance_explain'
import HR_Navbar from '@/components/hr/navbar'
import HR_Header from '@/components/hr/header'
import HR_AttendanceExplainPage from '@/components/hr/attendance_explain'

export default async function WorkRecord(){
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
   const explain:AttendanceExplain[] = await getServerSideAttedanceExplain(token!);
    return (
        <div>
            <HR_Navbar currentPath="/hr/attendance-explain"/>
            <div className={classes.maincontainer}>
            <HR_Header/>
            <Suspense fallback={<div>Loading...</div>}>
                <HR_AttendanceExplainPage attendanceExplain = {explain}/>
            </Suspense>
            
            </div>
        </div>
    )
}