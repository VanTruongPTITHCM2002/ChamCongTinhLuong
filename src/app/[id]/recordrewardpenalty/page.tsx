import UserContainer from "@/components/user/container/container";

import UserHeader from "@/components/user/header/header";

import UserNavbar from "@/components/user/navbar/navbar";
import UserRewardPenalty from "@/components/user/rewardpenalty/rewardpenalty";


export default function Page(){
    
    return(
        <div>
         <UserNavbar currentPath = "recordrewardpenalty"/>
         <UserContainer>
        <UserRewardPenalty/>
          </UserContainer>
         
        </div>
    )
}