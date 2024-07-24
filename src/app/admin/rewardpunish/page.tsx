
import Header from "@/components/admin/header/header";
import Navbar from "@/components/admin/navbar/navbar";
import classes from "./style.module.css";
import AdminRewardPunishPage from "@/components/admin/rewardpunish/rewardpunish";
export default function Page(){
    
    return(
        <div>
            <Navbar  currentPath="/admin/rewardpunish"/>
            <div className={classes.maincontainer}>
            <Header/>
                <AdminRewardPunishPage/>
            </div>
        </div>
    )
}