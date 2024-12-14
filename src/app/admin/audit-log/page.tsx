import Header from "@/components/admin/header";
import Navbar from "@/components/admin/navbar";
import { cookies } from "next/headers";
import { Suspense } from "react";
import classes from './style.module.css'
import AdminNotificationPage from "@/components/admin/notification";
import getServerSideNotification, { Notification } from "@/pages/api/admin/apiNotification";
import { Employee, getServerSideEmployeesActive } from "@/pages/api/admin/apiEmployee";
import getServerSideAuditLog, { AuditLog } from "@/pages/api/admin/apiAuditLog";
import AdminAuditLogPage from "@/components/admin/audit-log";

export default async function LeaveRequest(){
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    // const notification:Notification[] = await getServerSideNotification(token!);
    const res: AuditLog[] = await getServerSideAuditLog(token!); 
    return (
        <div>
            <Navbar currentPath="/admin/audit-log"/>
            <div className={classes.maincontainer}>
            <Header/>
            <Suspense fallback={<div>Loading...</div>}>
                {/* <AdminNotificationPage notification = {notification.reverse()} employee = {res}/> */}
                <AdminAuditLogPage audit={res.reverse()}/>
            </Suspense>
           
            </div>
        </div>
    )
}