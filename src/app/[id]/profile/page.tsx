
import UserContainer from "@/components/user/container/container";

import UserNavbar from "@/components/user/navbar/navbar";
import UserProfile from "@/components/user/profile/profile";
import { useRouter } from "next/navigation";


export default function Page(){

    return(
        <div>
         <UserNavbar currentPath = "profile"/>
         <UserContainer>
            <UserProfile/>
          </UserContainer>
         
        </div>
    )
}