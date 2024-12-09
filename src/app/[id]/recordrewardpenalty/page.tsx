import UserContainer from "@/components/user/container/container";

import UserHeader from "@/components/user/header/header";

import UserNavbar from "@/components/user/navbar/navbar";
import UserRewardPenalty from "@/components/user/rewardpenalty/rewardpenalty";

export async function generateStaticParams() {
  const ids = ["1", "2", "3"]; // Thay thế danh sách này bằng dữ liệu thực tế
  return ids.map((id) => ({ id }));
}
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