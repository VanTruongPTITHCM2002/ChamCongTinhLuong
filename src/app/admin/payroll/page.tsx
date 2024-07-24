import Header from "@/components/admin/header/header";
import Navbar from "@/components/admin/navbar/navbar";
import classes from "./style.module.css";
import AdminPayrollPage from "@/components/admin/payroll/payroll";


export default async  function AdminPayrollpage(){

    return(
        <div>
            <Navbar currentPath="/admin/payroll"/>
            <div className={classes.maincontainer}>
            <Header/>
        <AdminPayrollPage/>
            </div>
        </div>
    )
}

