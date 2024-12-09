
import UserContainer from "@/components/user/container/container";

import UserNavbar from "@/components/user/navbar/navbar";
import UserTimeSheet from "@/components/user/timesheet/timesheet";

import { useRouter } from "next/navigation";

export async function generateStaticParams() {
  const ids = ["1", "2", "3"]; // Thay thế danh sách này bằng dữ liệu thực tế
  return ids.map((id) => ({ id }));
}

export default function Page(){

    return(
        <div>
         <UserNavbar currentPath = "timesheet"/>
         <UserContainer>
           <UserTimeSheet/>
          </UserContainer>
         
        </div>
    )
}