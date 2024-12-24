import { errorSwal } from "@/custom/sweetalert";
import axios from "axios";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export interface Payroll{
    idEmployee:string;
    month:number;
    year:number;
    basicSalary:number;
    day_work:Float32Array;
    reward:number;
    punish:number;
    createDate:string;
    totalPayment:Float32Array;
    status:string;
}

export interface Salary{
    monthSalary: number,
    yearSalary:number,
    amountEmployee:number,
    total:Float32Array
}

export async function getListSalaryServerSide(token:RequestCookie){
    try {
       
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/payroll/list`,
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