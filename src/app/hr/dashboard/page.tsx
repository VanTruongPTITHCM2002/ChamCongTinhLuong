import AdminDashboard from "@/components/admin/dashboard";
import Header from "@/components/admin/header/header";
import Navbar from "@/components/admin/navbar/navbar";
import classes from "./style.module.css";
import HR_Navbar from "@/components/hr/navbar";
import HR_Header from "@/components/hr/header";
import HR_Dashboard from "@/components/hr/dashboard";
export default function Page(){
    
    return(
        <div>
            <HR_Navbar currentPath="/hr/dashboard" />
            <div className={classes.maincontainer}>
                <HR_Header />
                <HR_Dashboard />
            </div>
        </div>
    )
}