
import UserContainer from "@/components/user/container/container";

import UserNavbar from "@/components/user/navbar/navbar";
import UserProfile from "@/components/user/profile/profile";
import { useRouter } from "next/navigation";


export async function generateStaticParams() {
  const ids = ["1", "2", "3"]; // Thay thế danh sách này bằng dữ liệu thực tế
  return ids.map((id) => ({ id }));
}
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