
import Header from "@/components/admin/header/header";
import Navbar from "@/components/admin/navbar/navbar";
import classes from "./style.module.css";
import AdminRewardPunishPage from "@/components/admin/rewardpunish/rewardpunish";
import HR_Navbar from "@/components/hr/navbar";
import HR_Header from "@/components/hr/header";
import { Suspense } from "react";
import HR_RewardPunishPage from "@/components/hr/rewardpunish";
export default function Page(){
    
    return(
        <div>
            <HR_Navbar  currentPath="/hr/rewardpunish"/>
            <div className={classes.maincontainer}>
            <HR_Header/>
                <Suspense fallback={<div>Loading...</div>}>
                    <HR_RewardPunishPage />
                </Suspense>
            
            </div>
        </div>
    )
}