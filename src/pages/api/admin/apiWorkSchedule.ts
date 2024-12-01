import { error } from 'console';
import { errorSwal } from "@/custom/sweetalert";
import axios from "axios";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export interface WorkSchedule {
    workdate: string;
    startime: string;
    endtime: string;
}

export async function getServerSideWorkSchedule(token:RequestCookie){
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/workschedule`,
            {
                headers: {
                    Authorization: `Bearer ${token.value}`
                }
            }
        );

       return response.data.data;
    } catch(error:any) {
        errorSwal("Thất bại", error.response.data.message)
        return [];
    }
}
