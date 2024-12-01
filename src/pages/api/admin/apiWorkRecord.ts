import { errorSwal } from "@/custom/sweetalert";
import axios from "axios";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export interface WorkRecordResponse{
    idemployee:string;
    month: number;
    year: number;
    day_work?:Float32Array;
}

export async function getServerSideWorkRecord(token : RequestCookie ) {
 
    try {
       
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/workrecord`,
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

export async function addWorkRecord(token:string,workRecord:WorkRecordResponse){
    try {
       
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/workrecord`,workRecord,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                  }
            }
        );
       
        return response.data;
    } catch (error : any) {
        errorSwal("Thất bại", error.response.data.message)
        return error.response.data;
    }
}