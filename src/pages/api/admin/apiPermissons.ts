import { errorSwal } from "@/custom/sweetalert";
import axios from "axios";

export interface PermissonsResponse{
    namepermisson:string;
    description:string;
}

export interface AdminPageProps {
    permissons: PermissonsResponse[];
  }

export async function getServerSidePermissons() {
  
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/permissons`);
        return response.data.data;
    } catch (error : any) {
        errorSwal("Thất bại", error.response.data.message)
        return [];
    }
};