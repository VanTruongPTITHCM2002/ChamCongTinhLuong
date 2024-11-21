import { errorSwal } from "@/custom/sweetalert";
import axios from "axios";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export interface Employee {
    idEmployee?: string;
    firstName: string;
    lastName: string;
    gender: string;
    birthDate: string;
    idCard: string;
    email: string;
    phoneNumber: string;
    address: string;
    degree: number | string;
    position?:string;
    department?:number | string;
    status: number | string;
    image?:string
}

export interface allEmployee {
    employees: Employee[];
}

export async function getServerSideEmployees(token:RequestCookie){
    try{
    const response = await axios.get( `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/employee`,
        {
            headers: {
                Authorization: `Bearer ${token.value}`
              }
        }
    )

    return response.data.data;
} catch (error : any) {
    errorSwal("Thất bại", error.response.data.message)
    return [];
}
} 