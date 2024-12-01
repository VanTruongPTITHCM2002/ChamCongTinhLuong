import { errorSwal } from "@/custom/sweetalert";
import axios from "axios";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export interface Contract{
    idemployee:string;
    basicsalary:number;
    workingdays:number;
    leavedays:number;
    startdate:string;
    endate:string;
    status?:string;
}

export async function getServerSideContract(token:RequestCookie){
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/contract`,

            {
                headers: {
                    Authorization: `Bearer ${token.value}`
                }
            }
        );
        return response.data.data;
    } catch (error: any) {
        errorSwal("Thất bại", error.response.data.message)
        return [];
    }
}