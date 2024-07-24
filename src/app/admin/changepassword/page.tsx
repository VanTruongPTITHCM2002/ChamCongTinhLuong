import Header from "@/components/admin/header/header";
import Navbar from "@/components/admin/navbar/navbar";
import classes from "./style.module.css";
import AdminChangePassword from "@/components/admin/changepassword/change_paword";



export default async  function AdminPayrollpage(){

    return(
        <div>
            <Navbar/>
            <div className={classes.maincontainer}>
            <Header/>
            <AdminChangePassword/>
            </div>
        </div>
    )
}