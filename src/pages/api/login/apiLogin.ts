
import { errorSwal } from "@/components/user/custom/sweetalert";
import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const FetchAccount = async (data:AccountRequest,router:AppRouterInstance)=>{
        try{
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/auth/login`,data);
            return response;
        }catch(error : any){
            throw error
        }
}
     


