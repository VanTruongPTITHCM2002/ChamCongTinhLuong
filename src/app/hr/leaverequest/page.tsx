import Header from "@/components/admin/header";
import AdminLeaveRequestPage from "@/components/admin/leaveRequest";
import Navbar from "@/components/admin/navbar";
import { cookies } from "next/headers";
import { Suspense } from "react";
import classes from './style.module.css'
import { getServerSideLeaveRequest, LeaveRequest_Response } from "@/pages/api/admin/apiLeaveRequest";
import HR_Navbar from "@/components/hr/navbar";
import HR_Header from "@/components/hr/header";
import HR_LeaveRequestPage from "@/components/hr/leaverequest";

export default async function LeaveRequest(){
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const leaveRequestRes:LeaveRequest_Response[] = await getServerSideLeaveRequest(token!);
    return (
        <div>
            <HR_Navbar currentPath="/hr/leaverequest"/>
            <div className={classes.maincontainer}>
            <HR_Header/>
            <Suspense fallback={<div>Loading...</div>}>
                 <HR_LeaveRequestPage leaveRequest = {leaveRequestRes}/>
            </Suspense>
           
            </div>
        </div>
    )
}