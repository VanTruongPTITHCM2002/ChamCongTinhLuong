'use client'
import { FormEvent, useState } from 'react'
import styles from './notification.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { addNotificationServer, deleteNotificationServer, Notification } from '@/pages/api/admin/apiNotification';
import { Employee } from '@/pages/api/admin/apiEmployee';
import { format } from "date-fns";
import { useRouter } from 'next/navigation';
import { errorSwal, successSwal } from '@/custom/sweetalert';
import Cookies from 'js-cookie'
const AdminNotificationPage:React.FC<{notification:Notification[],employee:Employee[]}> = ({notification,employee})=>{
    const [searchTerm,setSearchTerm] = useState('');
    const [modalAdd,setModalAdd] = useState(false);
    const [modalDelete,setModalDelete] = useState(false);
    const router = useRouter();
    const token = Cookies.get('token');
    const username = localStorage.getItem('username');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [selectNotification,setSelectNotification] = useState<Notification>();

    const toggleSelect = (id: string) =>
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
  
    const toggleSelectAll = () =>
      setSelectedIds(selectedIds.length === employee.length ? [] : employee.map((e) => e.idEmployee!));

    const addButton = ()=>{
        setModalAdd(true);
    }

    const closeModal = ()=>{
        setModalAdd(false);
    }
    
    const openModalDelete = (noti:Notification)=>{
            setModalDelete(true);
            setSelectNotification(noti);
        
    }

    const closeModalDelete = ()=>{
        setModalDelete(false);
    }

    const addNotification = async (event:FormEvent)=>{
        event.preventDefault();
        const formElement = document.getElementById('formAddNotification') as HTMLFormElement;
        if (!formElement) {
            console.error('Form element not found');
            return;
        }
        const form = new FormData(formElement);
        const notifi: Notification ={
            type:form.get('type') as string,
            content:form.get('content') as string,
            senderId: username!,
            receiverId: form.get('receiverId') as string,
            createAt:format(new Date(),"dd/MM/yyyy HH:mm:ss") as string,
            updateAt:'',
            status: "Chưa đọc"
        }
        
        const response = await addNotificationServer(token!,notifi);
        if(response.status === 201){
            successSwal('Thành công',response.message);
            setModalAdd(false);
            router.refresh();
          }else{
            errorSwal('Thất bại',response.message);
            setModalAdd(false);
            router.refresh();
          }
    }

    const filteredList = searchTerm
    ? notification.filter(item => {
        // Kiểm tra các điều kiện tìm kiếm cho tất cả các trường
        const search = searchTerm.toLowerCase(); // Chuyển searchTerm về dạng chữ thường
        return (
          (item.type && item.type.toLowerCase().includes(search)) || 
          (item.createAt && item.createAt.toLowerCase().includes(search)) || // Tìm kiếm trong createAt
          (item.updateAt && item.updateAt.toLowerCase().includes(search)) || // Tìm kiếm trong updateAt
          (item.senderId && item.senderId.toLowerCase().includes(search)) || // Tìm kiếm trong roleDescription
          (item.receiverId && item.receiverId.toLowerCase().includes(search)) ||
          (item.status && item.status.toLowerCase().includes(search)) ||
          (item.content && item.content.toLowerCase().includes(search))
          // Tìm kiếm trong scope
        );
      })
    : notification; // Nếu không có searchTerm thì trả về danh sách gốc

    const delNotification = async (event:FormEvent)=>{
        event.preventDefault();
        const response = await deleteNotificationServer(token!,selectNotification!);
        if(response.status === 200){
            successSwal('Thành công',response.message);
            setModalDelete(false);
            router.refresh();
          }else{
            errorSwal('Thất bại',response.message);
            setModalDelete(false);
            router.refresh();
          }
    }

    return (
        <div className={styles.article} >
            <h3 style={{textAlign:"center"}}>Danh sách các thông báo</h3>
            <div className={styles.groupOption}>
            <input type="text" placeholder='Tìm kiếm...' 
                value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                />

                <button className={styles.btnAddNotification} onClick={addButton}>
                    <FontAwesomeIcon icon={faPlus}/>
                </button>
            </div>

            <table>
                <thead>
                        <tr>
                            <th>Tên thông báo</th>
                            <th>Nôi dung</th>
                            <th>Người gửi</th>
                            <th>Người nhận</th>
                            <th>Ngày gửi</th>
                            <th>Ngày cập nhật</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                </thead>

                <tbody>
                        {filteredList.map((n,index)=>(
                            <tr key={index}>
                                <td>{n.type}</td>
                                <td>{n.content}</td>
                                <td>{n.senderId}</td>
                                <td>{n.receiverId}</td>
                                <td>{n.createAt}</td>
                                <td>{n.updateAt}</td>
                                <td>{n.status}</td>
                                <td>
                                    <div className={styles.groupButton}>
                                    <button className={styles.btnDelete} onClick={()=>openModalDelete(n)}>
                                            <FontAwesomeIcon icon= {faTrash}/>
                                    </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            {modalAdd &&
                <div className={styles.modalAddRole}>
                    <div className={styles.modalAddRoleContent}>
                    <span className={styles.closeButton} onClick={closeModal}>&times;</span>
                            <form id='formAddNotification' className={styles.mainGroup}>
                                <h3>Thêm thông báo</h3>

                                <div className={styles.formGroup}>
                                    <label>Nhập tên thông báo</label>
                                    <input placeholder='Nhập tên thông báo...' name='type'/>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="">Nhập nội dung</label>
                                    <input placeholder='Nhập tên nội dung...' name='content'/>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="">Người nhận</label>
                                    <select name='receiverId'>
                                        {employee.map((e,index)=>(
                                          
                                            <option key={index} value={e.idEmployee}>{e.idEmployee}
                                            
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.groupButton}>
                                    <button className={styles.btnSave} onClick={addNotification}>Thêm</button>
                                    <button className={styles.btnDelete} onClick={closeModal}>Hủy</button>
                                </div>
                            </form>
                    </div>
                </div>
        }           

{modalDelete &&
                <div className={styles.modalAddRole}>
                    <div className={styles.modalAddRoleContent}>
                    <span className={styles.closeButton} onClick={closeModalDelete}>&times;</span>
                            <form id='formAddNotification' className={styles.mainGroup}>
                                <h3>Bạn có chắc muốn xóa thông báo này không?</h3>
                                <div className={styles.groupButton}>
                                    <button className={styles.btnSave} onClick={delNotification}>Có</button>
                                    <button className={styles.btnDelete} onClick={closeModalDelete}>Hủy</button>
                                </div>
                            </form>
                    </div>
                </div>
        }           

        </div>
    )
}   

export default AdminNotificationPage;