import { errorSwal } from "@/custom/sweetalert";
import axios from "axios";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export interface AuditLog{
    username: string;
    action: string;
    description:string;
    createtime:string;
}

export default async function getServerSideAuditLog(token: RequestCookie) {
    try {
       
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/audit-log`,
            {
                headers: {
                    Authorization: `Bearer ${token.value}`
                  }
            }
        );
       
        return response.data.data;
    } catch (error : any) {
        errorSwal("Thất bại", error.response.data.message)
        return [];
    }
}

export async function addAuditLogServer(notifi:AuditLog){
    try {
       
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/audit-log`,notifi
        );
       
        return response.data;
    } catch (error : any) {
        return error.response.data;
    }
}



