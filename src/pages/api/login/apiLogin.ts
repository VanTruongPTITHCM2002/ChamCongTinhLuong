
import { errorSwal } from "@/components/user/custom/sweetalert";
import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { NextRouter } from "next/router";

export const FetchAccount = async (data:AccountRequest,router:AppRouterInstance)=>{
   
        try{
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/auth/login`,data);
            if(response.status === 200){
  
              if (response.data.data.status === 0) {
                errorSwal('Thất bại', "Bạn không thể đăng nhập");
                router.push('/login');
                return;
              }
                if(response.data.data.role === process.env.NEXT_PUBLIC_ROLE_A){
                  localStorage.setItem('token', response.data.data.token);
                  localStorage.setItem('username', response.data.data.username);
                  router.push('/admin/dashboard');
                }else{
                  localStorage.setItem('token', response.data.data.token);
                  localStorage.setItem('username', response.data.data.username);
                  router.push(`/${response.data.data.username}/dashboard`);
                }
            }
        }catch(error : any){
          if(error.response === undefined){
              errorSwal("Thất bại","Không thể kết nối đến server....") 
              return;
          }
          errorSwal("Thất bại",`${error.response.data.message}`)
         
        }
}
     


