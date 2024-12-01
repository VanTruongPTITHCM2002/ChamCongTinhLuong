'use client'
import { FormEvent, useState } from 'react';
import styles from './attendance_explain.module.css'
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { updateServerSideAttedanceExplain } from '@/pages/api/admin/apiAttendance_Explain';
import { errorSwal, successSwal } from '@/custom/sweetalert';

const AdminAttendanceExplainPage:React.FC<{attendanceExplain:AttendanceExplain[]}> = ({attendanceExplain})=>{
    const router = useRouter();
    const token = Cookies.get('token');
    const [searchTerm,setSearchTerm] = useState('');
    const [modalUpdate,setModalUpdate] = useState(false);
    const [selectedAttendanceExplain,setSelectedAttendanceExplain]= useState<AttendanceExplain>();


    const EnableModalAdd = (attendexp: AttendanceExplain)=>{
        setModalUpdate(true);
        setSelectedAttendanceExplain(attendexp);
    }

    const closeModal = ()=>{
        setModalUpdate(false);
    }

    const clickAddAttendanceExplain = async (event:FormEvent)=>{
        event.preventDefault();
        const formElement = document.getElementById('formAddAttendanceExplain') as HTMLFormElement;
        if (!formElement) {
            console.error('Form element not found');
            return;
        }
        const form = new FormData(formElement);
        const attendanceExplainn:AttendanceExplain ={
            idemployee: form.get('idemployee') as string,
            date: form.get('date') as string,
            checkintime: form.get('checkintime') as string,
            checkoutime: form.get('checkoutime') as string,
            explaination: form.get('explaination') as string,
            status: form.get('status') as string
        } 
        const response = await updateServerSideAttedanceExplain(token!,attendanceExplainn!);
        if(response.status === 200){
            successSwal('Thành công',response.message);
            setModalUpdate(false);
            router.refresh();
          }else{
            errorSwal('Thất bại',response.message);
            setModalUpdate(false);
            router.refresh();
          }
    }


    
    const filteredList = searchTerm
    ? attendanceExplain.filter(item => {
        // Kiểm tra các điều kiện tìm kiếm cho tất cả các trường
        const search = searchTerm.toLowerCase(); // Chuyển searchTerm về dạng chữ thường
        return (
          (item.idemployee && item.idemployee.toLowerCase().includes(search)) || 
          (item.date && String(item.date).toLowerCase().includes(search)) || // Tìm kiếm trong createAt
          (item.checkintime && String(item.checkintime).toLowerCase().includes(search)) || // Tìm kiếm trong updateAt
          (item.checkoutime && String(item.checkoutime).toLowerCase().includes(search))  ||
          (item.explaination && String(item.explaination).toLowerCase().includes(search)) ||
          (item.status && String(item.status).toLowerCase().includes(search))
        );
      })
    : attendanceExplain;
    return (
        <div className={styles.article}>
             <h3 style={{textAlign:"center"}}>Danh sách bảng giải trình chấm công</h3>
                <div className={styles.groupOption}>
                <input type="text" placeholder='Tìm kiếm...' 
                value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                />


                    {/* <button className={styles.btnAddAttendanceExplain} onClick={EnableModalAdd}>
                        <FontAwesomeIcon icon={faPlus}/>
                    </button> */}
                </div>
                <table>
                    <thead>
                        <th>Mã nhân viên</th>
                        <th>Ngày chấm công</th>
                        <th>Giờ vào</th>
                        <th>Giờ ra</th>
                        <th>Lý do</th>
                        <th>Trạng thái</th>
                    </thead>

                    <tbody>
                            {filteredList.map((a,index)=>(
                                    <tr key={index} onClick={()=>EnableModalAdd(a)}>
                                        <td>{a.idemployee}</td>
                                        <td>{a.date}</td>
                                        <td>{a.checkintime}</td>
                                        <td>{a.checkoutime}</td>
                                        <td>{a.explaination}</td>
                                        <td>   {a.status === "Duyệt" ? 
                                <div className={styles.Active}>
                                    {a.status}
                                </div>
                              
                                 : a.status === "Không duyệt" ?
                                 <div className={styles.InActive}>
                                      {a.status} 
                                 </div>
                                 :
                                 <div className={styles.Wait}>
                                      {a.status} 
                                 </div>
                                  }    </td>
                                    </tr>
                            ))}
                    </tbody>
                </table>

                {modalUpdate &&
                <div className={styles.modalAddRole}>
                    <div className={styles.modalAddRoleContent}>
                    <span className={styles.closeButton} onClick={closeModal}>&times;</span>
                            <form id='formAddAttendanceExplain' className={styles.mainGroup}>
                                <h3>Cập nhật giải trình chấm công</h3>

                                <div className={styles.formGroup}>
                                    <label>Mã nhân viên</label>
                                    <input type="text" name="idemployee" id="" defaultValue={selectedAttendanceExplain?.idemployee} readOnly/>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="">Ngày chấm công</label>
                                    <input type='date' name='date'  defaultValue={selectedAttendanceExplain?.date} readOnly/>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="">Giờ vào</label>
                                    <input type='time' name = 'checkintime' defaultValue={selectedAttendanceExplain?.checkintime} readOnly/>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="">Giờ ra</label>
                                    <input type='time' name = 'checkoutime' defaultValue={selectedAttendanceExplain?.checkoutime} readOnly/>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="">Lí do</label>
                                    <input type='text' name='explaination' defaultValue={selectedAttendanceExplain?.explaination} readOnly/>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="">Trạng thái</label>
                                    <select name = 'status' id="" defaultValue={selectedAttendanceExplain?.status}>
                                        <option value="Đang chờ duyệt">Đang chờ duyệt</option>
                                        <option value="Duyệt">Duyệt</option>
                                        <option value="Không duyệt">Không duyệt</option>
                                    </select>
                                </div>

                                <div className={styles.groupButton}>
                                    <button className={styles.btnSave} onClick={clickAddAttendanceExplain}>Lưu</button>
                                    <button className={styles.btnDelete} onClick={closeModal}>Hủy</button>
                                </div>
                            </form>
                    </div>
                </div>
        }
        </div>
    )
}

export default AdminAttendanceExplainPage;