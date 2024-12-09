
import classes from "./style.module.css";
import HR_Navbar from "@/components/hr/navbar";
import HR_Header from "@/components/hr/header";
import HR_Employees from "@/components/hr/employees";
import { cookies } from "next/headers";
import { DepartmentsDTO, getServerSideDepartments } from "@/pages/api/admin/apiDepartments";
import { Employee, getServerSideEmployees } from "@/pages/api/admin/apiEmployee";
import { Suspense } from "react";

export default async function Page(){
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const response: DepartmentsDTO[] = await getServerSideDepartments(token!);
    const res: Employee[] = await getServerSideEmployees(token!);  
    return(
        <div>
            <HR_Navbar currentPath="/hr/employees" />
            <div className={classes.maincontainer}>
                <HR_Header />
                <Suspense fallback={<div>Loading...</div>}>
                    <HR_Employees employee={res} department = {response}/>
                </Suspense>
              
            </div>
        </div>
    )
}