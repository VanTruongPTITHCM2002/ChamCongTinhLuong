import { errorSwal } from "@/custom/sweetalert";
import axios from "axios";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export interface Notification{
    senderId: string;
    receiverId: string;
    content:string;
    type:string;
    status:string;
    createAt:string;
    updateAt:string;
}

export default async function getServerSideNotification(token: RequestCookie) {
    try {
       
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/notification`,
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

export async function addNotificationServer(token:string,notifi:Notification){
    try {
       
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/notification`,notifi,
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
}

export async function deleteNotificationServer(token:string,notifi:Notification){
    try {
       
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/notification`,
            {   data: notifi,
                headers: {
                    Authorization: `Bearer ${token}`
                  }
            }
        );
       
        return response.data;
    } catch (error : any) {
        return error.response.data;
    }
}

