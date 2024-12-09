import axios from "axios";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export interface Attendance{
    idemployee:string;
    dateattendance?:string;
    checkintime?:string;
    checkouttime?:string;
    status?:string | number;
    attendanceStatusName?:string,
    description?:string,
    explaination?:string,
    numberwork?:number;
}

export async function getServerSideAttendance(token:RequestCookie){
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/attendance`,{
            headers: {
                Authorization: `Bearer ${token.value}`  
              }

        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching employee ID:', error);
       return [];
    }
};