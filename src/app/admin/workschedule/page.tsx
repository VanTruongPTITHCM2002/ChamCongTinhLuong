import Header from "@/components/admin/header/header";
import Navbar from "@/components/admin/navbar/navbar";
import classes from "./style.module.css";
import WorkSchedule from "@/components/admin/workschedule/workschedule";
export default function Page(){
    
    return(
        <div>
            <Navbar/>
            <div className={classes.maincontainer}>
            <Header/>
            <WorkSchedule/>
            </div>
        </div>
    )
}