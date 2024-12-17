import Header from "@/components/admin/header/header";
import Navbar from "@/components/admin/navbar/navbar";
import classes from "./style.module.css";
import AdminContract from "@/components/admin/contract/contract";
import { Contract, getServerSideContract } from "@/pages/api/admin/apiContract";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { Employee, getServerSideEmployees } from "@/pages/api/admin/apiEmployee";
import HR_Navbar from "@/components/hr/navbar";
import HR_Header from "@/components/hr/header";
import HR_Contract from "@/components/hr/contract";

export default async function Page(){
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const response: Contract[] = await getServerSideContract(token!);
    const employee: Employee[] = await getServerSideEmployees(token!);
    return(
        <div>
            <HR_Navbar  currentPath="/hr/contract"/>
            <div className={classes.maincontainer}>
            <HR_Header/>
            <Suspense fallback={<div>Loading...</div>}>
                <HR_Contract contract={response.reverse()}
                    employee = {employee.filter(e => e.status === 'Đang hoạt động')}
                />
            </Suspense>
            
            </div>
        </div>
    )
}