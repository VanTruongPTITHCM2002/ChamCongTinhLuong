import { errorSwal } from "@/custom/sweetalert";
import axios from "axios";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export interface Attendance_Explain{
    idemployee: string;
    date:string;
    checkintime:string;
    checkoutime:string;
    explaination:string;
    status:string;
}

export async function getServerSideAttedanceExplain(token : RequestCookie ) {
 
    try {
       
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/attendance_explain`,
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
};

export async function updateServerSideAttedanceExplain(token : string,attedanceExplain:Attendance_Explain ) {
 
    try {
       
        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/attendance_explain`,attedanceExplain,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                  }
            }
        );
       
        return response.data;
    } catch (error : any) {
    
        return error.response.data;
    }
};