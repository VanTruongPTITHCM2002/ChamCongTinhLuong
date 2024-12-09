'use client'
import { addWorkRecord, WorkRecordResponse } from '@/pages/api/admin/apiWorkRecord';
import styles from './workrecord.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormEvent, useState } from 'react';
import WorkRecord from '@/app/admin/workrecord/page';
import { Employee } from '@/pages/api/admin/apiEmployee';
import { errorSwal, successSwal } from '@/custom/sweetalert';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const HR_WorkRecord:React.FC<{wrk:WorkRecordResponse[],employee:Employee[]}> = ({wrk,employee})=>{
    const router = useRouter();
    const token = Cookies.get('token');
    const [searchTerm,setSearchTerm] = useState('');
    const [modalAddWorkRecord,setModalWorkRecord] = useState(false);

    const EnableModalAdd = ()=>{
        setModalWorkRecord(true);
    }

    const closeModalAddWorkRecord = ()=>{
        setModalWorkRecord(false);
    }

    const clickAddWorkRecord = async (event:FormEvent)=>{
        event.preventDefault();
        const formElement = document.getElementById('formAddWorkRecord') as HTMLFormElement;
        if (!formElement) {
            console.error('Form element not found');
            return;
        }
        const form = new FormData(formElement);
        const w:WorkRecordResponse ={
            idemployee: form.get('idemployee') as string,
            month: Number(form.get('month') as string),
            year: Number(form.get('year') as string),
        }

      const response =  await addWorkRecord(token!,w);
      if(response.status === 201){
        successSwal('Thành công',response.message);
        setModalWorkRecord(false);
        router.refresh();
      }else{
        errorSwal('Thất bại',response.message);
        setModalWorkRecord(false);
        router.refresh();
      }
    }

    const filteredList = searchTerm
    ? wrk.filter(item => {
        // Kiểm tra các điều kiện tìm kiếm cho tất cả các trường
        const search = searchTerm.toLowerCase(); // Chuyển searchTerm về dạng chữ thường
        return (
          (item.idemployee && item.idemployee.toLowerCase().includes(search)) || 
          (item.month && String(item.month).toLowerCase().includes(search)) || // Tìm kiếm trong createAt
          (item.year && String(item.year).toLowerCase().includes(search)) || // Tìm kiếm trong updateAt
          (item.day_work && String(item.day_work).toLowerCase().includes(search))  // Tìm kiếm trong roleDescription
         
        );
      })
    : wrk; // Nếu không có searchTerm thì trả về danh sách gốc

    return (
        <div className={styles.article}>
            <h3 style={{textAlign:"center"}}>Danh sách bảng ghi công thực tế trong tháng</h3>
                <div className={styles.groupOption}>
                <input type="text" placeholder='Tìm kiếm...' 
                value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                />


                    <button className={styles.btnAddWorkRecord} onClick={EnableModalAdd}>
                        <FontAwesomeIcon icon={faPlus}/>
                    </button>
                </div>
                <table>
                    <thead>
                        <th>Mã nhân viên</th>
                        <th>Tháng</th>
                        <th>Năm</th>
                        <th>Số ngày công thực tế</th>
                    </thead>

                    <tbody>
                            {filteredList.map((w,index)=>(
                                <tr key={index}>
                                    <td>{w.idemployee}</td>
                                    <td>{w.month}</td>
                                    <td>{w.year}</td>
                                    <td>{w.day_work}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                {modalAddWorkRecord &&
                <div className={styles.modalAddRole}>
                    <div className={styles.modalAddRoleContent}>
                    <span className={styles.closeButton} onClick={closeModalAddWorkRecord}>&times;</span>
                            <form id='formAddWorkRecord' className={styles.mainGroup}>
                                <h3>Thêm tháng ghi công</h3>

                                <div className={styles.formGroup}>
                                    <label>Mã nhân viên</label>
                                   <select name="idemployee" id="idemployee">
                                            {employee.map((e)=>(
                                                <option key={e.idEmployee} value={e.idEmployee}>{e.idEmployee}</option>
                                            ))}
                                   </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="">Tháng</label>
                                    <input type='number' max={12} min={1} placeholder='Nhập tháng' name='month'/>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="">Năm</label>
                                    <input type='number' min={new Date().getFullYear()} placeholder='Nhập năm' name='year'/>
                                </div>

                                <div className={styles.groupButton}>
                                    <button className={styles.btnSave} onClick={clickAddWorkRecord}>Thêm</button>
                                    <button className={styles.btnDelete} onClick={closeModalAddWorkRecord}>Hủy</button>
                                </div>
                            </form>
                    </div>
                </div>
        }
        </div>
    )
}

export default HR_WorkRecord;