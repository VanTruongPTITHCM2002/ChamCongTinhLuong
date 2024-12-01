import Header from "@/components/admin/header";
import AdminLeaveRequestPage from "@/components/admin/leaveRequest";
import Navbar from "@/components/admin/navbar";
import { cookies } from "next/headers";
import { Suspense } from "react";
import classes from './style.module.css'
import { getServerSideLeaveRequest, LeaveRequest_Response } from "@/pages/api/admin/apiLeaveRequest";

export default async function LeaveRequest(){
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const leaveRequestRes:LeaveRequest_Response[] = await getServerSideLeaveRequest(token!);
    return (
        <div>
            <Navbar currentPath="/admin/leaverequest"/>
            <div className={classes.maincontainer}>
            <Header/>
            <Suspense fallback={<div>Loading...</div>}>
                 <AdminLeaveRequestPage leaveRequest = {leaveRequestRes}/>
            </Suspense>
           
            </div>
        </div>
    )
}