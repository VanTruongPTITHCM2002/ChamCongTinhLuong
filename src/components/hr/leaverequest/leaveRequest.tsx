'use client'

import { deleteLeaveRequest, LeaveRequest_Response, updateLeaveRequest } from '@/pages/api/admin/apiLeaveRequest';
import classes from './leaveRequest.module.css';
import  Cookies  from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormEvent, useState } from 'react';
import { errorSwal, successSwal } from '@/custom/sweetalert';
import { useRouter } from 'next/navigation';

function formatDate(inputDate:string) {
    // Cấu trúc chuỗi ban đầu "22/11/2024 12:00:00"
    const [day, month, year, hours, minutes, seconds] = inputDate.split(/[/ :]/);

    // Tạo đối tượng Date
    const formattedDate = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds));

    // Định dạng lại thành "yyyy/MM/dd HH:mm:ss"
    const formattedDateStr = `${formattedDate.getFullYear()}/${(formattedDate.getMonth() + 1).toString().padStart(2, '0')}/${formattedDate.getDate().toString().padStart(2, '0')} ${formattedDate.getHours().toString().padStart(2, '0')}:${formattedDate.getMinutes().toString().padStart(2, '0')}:${formattedDate.getSeconds().toString().padStart(2, '0')}`;

    return formattedDateStr;
}

const HR_LeaveRequestPage:React.FC<{leaveRequest:LeaveRequest_Response[]}> = ({leaveRequest})=>{
    const token = Cookies.get('token');
    const router = useRouter();
    const [isModalUpdate,setIsModalUpdate] = useState(false);
    const [isModalDetail,setIsModalDetail] = useState(false);
    const [isModalDelete,setIsModalDelete] = useState(false);
    const [selectedLeaveRequest,setSelectLeaveRequest] = useState<LeaveRequest_Response>();
    const [searchTerm,setSearchTerm] = useState('');
    let username = '';
    if (typeof window !== 'undefined'){
     username = localStorage.getItem('username')!;
    }
    const filteredList = searchTerm
    ? leaveRequest.filter(item => {
        // Kiểm tra các điều kiện tìm kiếm cho tất cả các trường
        const search = searchTerm.toLowerCase(); // Chuyển searchTerm về dạng chữ thường
        return (
          (item.idEmployee && item.idEmployee.toLowerCase().includes(search)) || 
          (item.createAt && item.createAt.toLowerCase().includes(search)) || 
          (item.leaveType && item.leaveType.toLowerCase().includes(search)) || 
          (item.startDate && item.startDate.toLowerCase().includes(search)) || 
          (item.endate && item.endate.toLowerCase().includes(search)) ||
         (item.reason && item.reason.toLowerCase().includes(search)) ||
         (item.status && item.status.toLowerCase().includes(search)) ||
         (item.approveAt && item.approveAt.toLowerCase().includes(search)) ||
         (item.approveBy && item.approveBy.toLowerCase().includes(search))
        );
      })
    : leaveRequest; // Nếu không có searchTerm thì trả về danh sách gốc

    const openModalUpdate = (leaveRequest : LeaveRequest_Response)=>{
        setIsModalUpdate(true);
        setSelectLeaveRequest(leaveRequest);
    }

    const openModalDetail = (leaveRequest:LeaveRequest_Response)=>{
        setIsModalDetail(true);
        setSelectLeaveRequest(leaveRequest);
    }

    const openModalDelete = (leaveRequest:LeaveRequest_Response)=>{
        setIsModalDelete(true);
        setSelectLeaveRequest(leaveRequest);
    }

    const closeModalUpdate = ()=>{
        setIsModalUpdate(false);
    }

    const closeModalDetail = ()=>{
        setIsModalDetail(false);
    }

    const closeModalDelete = ()=>{
        setIsModalDelete(false);
    }

    const saveData = async (event:FormEvent)=>{
        event.preventDefault();
        const formElement = document.getElementById('formUpdateData') as HTMLFormElement;
        if (!formElement) {
            console.error('Form element not found');
            return;
        }
        const form = new FormData(formElement);
        const leaveRequest: LeaveRequest_Response = {
            idEmployee: form.get('idEmployee') as string,
            leaveType: form.get('leaveType') as string,
            startDate: form.get('startDate') as string,
            endate: form.get('endate') as string,
            reason:form.get('reason') as string,
            createAt:form.get('createAt') as string,
            status:form.get('status') as string,
            approveAt: "",
            approveBy: username
        }

        console.log(leaveRequest.createAt);

        const res = await updateLeaveRequest(token!,leaveRequest,selectedLeaveRequest?.idEmployee!,
            selectedLeaveRequest?.leaveType!,selectedLeaveRequest?.startDate!
        )
        if(res.status === 200){
            successSwal('Thành công',res.message);
            setIsModalUpdate(false);
            router.refresh();
        }else{
            errorSwal('Thất bại',res.message);
            setIsModalUpdate(false);
        }
    }

    const deleteData = async()=>{
        const response = await deleteLeaveRequest(token!,selectedLeaveRequest?.idEmployee!,selectedLeaveRequest?.leaveType!,selectedLeaveRequest?.startDate!);
        if(response.status === 200){
            successSwal('Thành công',response.message);
            setIsModalDelete(false);
            router.refresh();
        }else{
            errorSwal('Thất bại',response.message);
            setIsModalDelete(false);
            router.refresh();
        }
    }

    return (
        <div className={classes.article}>
                <h3 style={{textAlign:"center",marginBottom:"5px"}}>Quản lý nghỉ phép</h3>
                <div className={classes.groupOption}> 
                <input type="text" placeholder='Tìm kiếm...' 
                value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* <button className={classes.btnAddRole} 
                onClick={handleClickAddButton}
                >
                    <FontAwesomeIcon icon={faPlus}/>
                </button> */}
            </div>
                <table>
                    <thead>
                        <th>Mã nhân viên</th>
                        <th>Loại nghỉ phép</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                        {/* <th>Lí do</th> */}
                        <th>Ngày tạo</th> 
                        <th>Trạng thái</th>
                        {/* <th>Người quyết định</th>
                        <th>Ngày thực hiện</th> */}
                        <th>Thao tác</th>
                    </thead>

                    <tbody>
                        {filteredList.map((l,index)=>(
                            <tr key={index}>
                                <td>{l.idEmployee}</td>
                                <td>{l.leaveType}</td>
                                <td>{l.startDate}</td>
                                <td>{l.endate}</td>
                                {/* <td>{l.reason}</td> */}
                                <td>{l.createAt}</td> 
                                <td>{l.status}</td>
                                {/* <td>{l.approveBy}</td>
                                <td>{l.approveAt}</td> */}
                                <td>
                                    <div className={classes.groupButton}>
                                            <button className={classes.updateButton} onClick={() => openModalUpdate(l)}>
                                                    <FontAwesomeIcon icon={faPen}/>
                                            </button>

                                            <button className={classes.detailButton} onClick={()=> openModalDetail(l)}>
                                                <FontAwesomeIcon icon={faEye}/>
                                            </button>

                                            <button className={classes.deleteButton} onClick={()=>openModalDelete(l)}>
                                                    <FontAwesomeIcon icon={faTrash}/>
                                            </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {isModalUpdate &&
                <div className={classes.modalAddRole}>
                    <div className={classes.modalAddRoleContent}>
                        <span className={classes.closeButton} onClick={closeModalUpdate}>&times;</span>
                        <form className={classes.mainGroup} id='formUpdateData'>
                        <h4 style={{textAlign:"center",marginBottom:"5px"}}>Cập nhật nghỉ phép</h4>
                            <div className={classes.formGroup}>
                                <label htmlFor="idEmployee">Mã nhân viên</label>
                                <input type="text" id='idEmployee' name='idEmployee' defaultValue={selectedLeaveRequest?.idEmployee} readOnly />
                            </div>

                            <div className={classes.formGroup}>
                                <label htmlFor="leaveType">Loại nghỉ phép</label>
                                <select name="leaveType" id="leaveType" defaultValue={selectedLeaveRequest?.leaveType}>
                                        <option value="Nghỉ phép">Nghỉ phép</option>
                                        <option value="Nghỉ hết phép">Nghỉ hết phép</option>
                                        <option value="Nghỉ bệnh">Nghỉ bệnh</option>
                                        <option value="Nghỉ thai sản">Nghỉ thai sản</option>
                                        <option value="Nghỉ khẩn cấp">Nghỉ khẩn cấp</option>
                                </select>
                            </div>

                            <div className={classes.formGroup}>
                                    <label htmlFor="startDate">Ngày bắt đầu</label>
                                    <input type="date" id='startDate' name='startDate' defaultValue={selectedLeaveRequest?.startDate} />
                            </div>

                            <div className={classes.formGroup}>
                                <label htmlFor="endate">Ngày kết thúc</label>
                                <input type="date" id='endate' name="endate" defaultValue={selectedLeaveRequest?.endate} />
                            </div>

                            <div className={classes.formGroup}>
                                <label htmlFor="reason">Lí do</label>
                                <input type="text" id='reason' name="reason" defaultValue={selectedLeaveRequest?.reason} />
                            </div>

                            <div className={classes.formGroup}>
                                <label htmlFor="createAt">Ngày tạo</label>
                                <input type="datetime" id='createAt' name="createAt" defaultValue={selectedLeaveRequest?.createAt} readOnly/>
                            </div>

                            <div className={classes.formGroup}>
                                <label htmlFor='approveBy'>Người thực hiện</label>
                                <input type="text" id='approveBy' name='approveBy' defaultValue={selectedLeaveRequest?.approveBy}/>
                            </div>

                            <div className={classes.formGroup}>
                                <label htmlFor="approveAt">Ngày xem xét</label>
                                <input type="datetime" id='approveAt' name="approveAt" defaultValue={selectedLeaveRequest?.approveAt}  />
                            </div>

                            <div className={classes.formGroup}>
                                <label htmlFor="status">Trạng thái</label>
                                <select name="status" id='status' defaultValue={selectedLeaveRequest?.status}>
                                    <option value="Chấp thuận">Chấp thuận</option>
                                    <option value="Không chấp thuận">Không chấp thuận</option>
                                    <option value="Đang chờ">Đang chờ</option>
                                </select>
                            </div>

                            <div className={classes.groupFormUpdateButton}>
                                    <button className={classes.saveUpdateButton} onClick={saveData}>
                                        Lưu
                                    </button>
                                    <button className={classes.deleteButton} onClick={closeModalUpdate}>
                                        Hủy
                                    </button>
                            </div>
                        </form>
                    </div>
                </div>
                }
            
            {isModalDetail &&
                 <div className={classes.modalAddRole}>
                 <div className={classes.modalAddRoleContent}>
                     <span className={classes.closeButton} onClick={closeModalDetail}>&times;</span>
                     <form className={classes.mainGroup}>
                     <h4 style={{textAlign:"center",marginBottom:"5px"}}>Chi tiết nghỉ phép</h4>
                         <div className={classes.formGroup}>
                             <label htmlFor="idEmployee">Mã nhân viên</label>
                             <input type="text" id='idEmployee' name='idEmployee' defaultValue={selectedLeaveRequest?.idEmployee} readOnly />
                         </div>

                         <div className={classes.formGroup}>
                             <label htmlFor="leaveType">Loại nghỉ phép</label>
                             <input name="leaveType" id="leaveType" defaultValue={selectedLeaveRequest?.leaveType} readOnly/>
                         </div>

                         <div className={classes.formGroup}>
                                 <label htmlFor="startDate">Ngày bắt đầu</label>
                                 <input type="date" id='startDate' name='startDate' defaultValue={selectedLeaveRequest?.startDate} readOnly/>
                         </div>

                         <div className={classes.formGroup}>
                             <label htmlFor="endate">Ngày kết thúc</label>
                             <input type="date" id='endate' name="endate" defaultValue={selectedLeaveRequest?.endate} readOnly />
                         </div>

                         <div className={classes.formGroup}>
                             <label htmlFor="reason">Lí do</label>
                             <input type="text" id='reason' name="reason" defaultValue={selectedLeaveRequest?.reason} readOnly/>
                         </div>

                         <div className={classes.formGroup}>
                             <label htmlFor="createAt">Ngày tạo</label>
                             <input type="datetime" id='createAt' name="createAt" defaultValue={selectedLeaveRequest?.createAt} readOnly/>
                         </div>

                         <div className={classes.formGroup}>
                             <label htmlFor='approveBy'>Người thực hiện</label>
                             <input type="text" id='approveBy' name='approveBy' defaultValue={selectedLeaveRequest?.approveBy} readOnly/>
                         </div>

                         <div className={classes.formGroup}>
                             <label htmlFor="approveAt">Ngày xem xét</label>
                             <input type="datetime" id='approveAt' name="approveAt" defaultValue={selectedLeaveRequest?.approveAt} readOnly />
                         </div>

                         <div className={classes.formGroup}>
                             <label htmlFor="status">Trạng thái</label>
                             <input name="status" id='status' defaultValue={selectedLeaveRequest?.status} readOnly/>
                         </div>
                     </form>
                 </div>
             </div>
                }

            {isModalDelete &&
                <div className={classes.modalAddRole}>
                    <div className={classes.modalAddRoleContent}>
                        <span className={classes.closeButton} onClick={closeModalDelete}>&times;</span>
                        <h4>Bạn có chắc muốn xóa nghỉ phép này không?</h4>
                        <div className={classes.groupFormUpdateButton}>
                        <button className={classes.saveUpdateButton} onClick={deleteData}>
                                        Có
                                    </button>
                                    <button className={classes.deleteButton} onClick={closeModalDelete}>
                                        Hủy
                                    </button>
                        </div>
                    </div>
                </div>
            }

            </div>
    )
}

export default HR_LeaveRequestPage;