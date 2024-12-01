
import LeaveRequest from "@/app/admin/leaverequest/page";
import { errorSwal } from "@/custom/sweetalert";
import axios from "axios";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export interface LeaveRequest_Response{
    idEmployee: string
    leaveType: string
    startDate: string
    endate: string
    status: string
    reason: string
    createAt: string
    approveBy: string
    approveAt: string
}

export async function getServerSideLeaveRequest(token:RequestCookie){
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/leave-request`,

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

export async function updateLeaveRequest(token:string,leaveRequest: LeaveRequest_Response,idEmployee:string,
    leaveType:string,createAt:string
){
    try {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/leave-request`,leaveRequest,
            {
                params:{
                    idEmployee:idEmployee,
                    leaveType:leaveType,
                    createdAt: createAt.replaceAll('-','/')
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error: any) {
        errorSwal("Thất bại", error.response.data.message)
        return [];
    }
}


export async function deleteLeaveRequest(token:string,idEmployee:string,
    leaveType:string,createAt:string
){
    try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/leave-request`,
            {
                data:{
                    idEmployee:idEmployee,
                    leaveType:leaveType,
                    startDate: createAt
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error: any) {
        // errorSwal("Thất bại", error.response.data.message)
        return error.response.data;
    }
}
