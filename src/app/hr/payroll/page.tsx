import Header from "@/components/admin/header/header";
import Navbar from "@/components/admin/navbar/navbar";
import classes from "./style.module.css";
import AdminPayrollPage from "@/components/admin/payroll/payroll";
import HR_Navbar from "@/components/hr/navbar";
import HR_Header from "@/components/hr/header";
import HR_PayrollPage from "@/components/hr/payroll";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { getListSalaryServerSide, Salary } from "@/pages/api/admin/apiPayroll";


export default async  function AdminPayrollpage(){
     const cookieStore = await cookies();
        const token = cookieStore.get('token');
        const response: Salary[] = await getListSalaryServerSide(token!);
    return(
        <div>
            <HR_Navbar currentPath="/hr/payroll"/>
            <div className={classes.maincontainer}>
            <HR_Header/>
                <Suspense fallback={<div>Loading...</div>}>
                    <HR_PayrollPage salary = {response}/>
                </Suspense>
      
            
            </div>
        </div>
    )
}

