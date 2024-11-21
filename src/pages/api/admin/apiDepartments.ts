import { errorSwal } from "@/custom/sweetalert";
import axios from "axios";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export interface DepartmentsDTO{
    departmentsName: string;
}

export interface AdminDepartments {
    departments: DepartmentsDTO[];
  }

  export async function getServerSideDepartments(token : RequestCookie ) {
 
    try {
       
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/departments`,
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