'use client'
import { FormEvent, useEffect, useState } from 'react';
import classes from './degree.module.css'
import Cookies from 'js-cookie';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { errorSwal, successSwal } from '@/custom/sweetalert';
import { useRouter } from 'next/navigation';
import { addDegreeInServer, Degree, DeleteDegreeInServer, updateDegreeInServer } from '@/pages/api/hr/apiDegree';
import { formattedAmount } from '../payroll/payroll';
import { addAuditLogServer } from '@/pages/api/admin/apiAuditLog';
import { format } from 'date-fns';



const  DegreePage:React.FC<{degree:Degree[]}> =({degree}) =>{
    const router = useRouter();
    const [modalAdd,setModalAdd] = useState(false);
    const [modalUpdate,setModalUpdate] = useState(false);
    const [modalDelete,setModalDelete] = useState(false);
    const [DegreeUpdate,setDegreeUpdate] = useState<Degree>();
    const [prevDegreeName,setPrevDegreeName] = useState("");
    const [searchTerm, setSearchTerm] = useState('');
    const token = Cookies.get('token');
    let username = '';
    if(typeof window !== 'undefined'){
        username = localStorage.getItem('username')!;
    }
    const handleClickAddButton = ()=>setModalAdd(true);

    const handleClickUpdateButton = (DegreeResponse: Degree)=>{
        setModalUpdate(true);
        setDegreeUpdate(DegreeResponse);
        setPrevDegreeName(DegreeResponse.degreeName);
    }
    
    const handleClickDeleteButton = (DegreeName: string)=>{
        setModalDelete(true);
        setPrevDegreeName(DegreeName);
    }

    const closeModal = () => setModalAdd(false);

    const closeModalUpdate = ()=> setModalUpdate(false);

    const closeModalDelete = ()=> setModalDelete(false);
    
    const addDegree = async (event:FormEvent)=>{
        event.preventDefault();
        const formElement = document.getElementById('formAddDegree') as HTMLFormElement;
        if (!formElement) {
            console.error('Form element not found');
            return;
        }
        const form = new FormData(formElement);
        const degreeValue:Degree ={
            degreeName: form.get('degreeName') as string,
            numberSalary:Number (form.get('numberSalary') as string),
        }

      const response =  await addDegreeInServer(degreeValue,token!);
      if(response.status === 201){
        successSwal('Thành công',response.message);
          await addAuditLogServer({
              username: username!,
              action: "Thêm bằng cấp",
              description: "Nhân viên " + username + " đã thực hiện thêm bằng cấp",
              createtime: format(new Date(), 'dd/MM/yyyy HH:mm:ss')
          })
        setModalAdd(false);
        router.refresh();
      }else{
        errorSwal('Thất bại',response.message);
        setModalAdd(false);
        router.refresh();
      }
    }

    const updateDegree = async(event:FormEvent)=>{
        event.preventDefault();
        const formElement = document.getElementById('formUpdateDegree') as HTMLFormElement;
        if (!formElement) {
            console.error('Form element not found');
            return;
        }
        const form = new FormData(formElement);
        const degreeValue:Degree ={
            degreeName: form.get('degreeName') as string,
            numberSalary:Number (form.get('numberSalary') as string),
        }
        const response = await updateDegreeInServer(prevDegreeName,degreeValue,token!);
        if(response.status === 200){
            successSwal('Thành công',response.message);
            await addAuditLogServer({
                username: username!,
                action: "Sửa bằng cấp",
                description: "Nhân viên " + username + " đã thực hiện sửa bằng cấp",
                createtime: format(new Date(), 'dd/MM/yyyy HH:mm:ss')
            })
            setModalUpdate(false);
            router.refresh();
          }else{
            errorSwal('Thất bại',response.message);
            setModalUpdate(false);
            router.refresh();
          }
    }

    const deleteDegree = async()=>{
        const response = await DeleteDegreeInServer(prevDegreeName,token!);
        if(response.status === 200){
            successSwal('Thành công',response.message);
            await addAuditLogServer({
                username: username!,
                action: "Xóa bằng cấp",
                description: "Nhân viên " + username + " đã thực hiện xóa bằng cấp",
                createtime: format(new Date(), 'dd/MM/yyyy HH:mm:ss')
            })
            setModalDelete(false);
            router.refresh();
          }else{
            errorSwal('Thất bại',response.message);
            setModalDelete(false);
            router.refresh();
          }
    }

   

    const filteredList = searchTerm
    ? degree.filter(item => {
        // Kiểm tra các điều kiện tìm kiếm cho tất cả các trường
        const search = searchTerm.toLowerCase(); // Chuyển searchTerm về dạng chữ thường
        return (
          (item.degreeName && item.degreeName.toLowerCase().includes(search)) || 
          (item.numberSalary && item.numberSalary.toString().includes(search)) 
         
        );
      })
    : degree; // Nếu không có searchTerm thì trả về danh sách gốc

    return (
        <div className={classes.article}>
            <h2 className={classes.nameTable}>Danh sách bằng cấp trong ứng dụng</h2>

            <div className={classes.groupOption}> 
                <input type="text" placeholder='Tìm kiếm...' 
                value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                />

                <button className={classes.btnAddDegree} onClick={handleClickAddButton}>
                    <FontAwesomeIcon icon={faPlus}/>
                </button>
            </div>

            <table>
                <thead>
                    <th>Tên bằng cấp</th>
                    <th>Số tiền tương ứng</th>
                    <th>Hành động</th>
                </thead>

                <tbody>
                    {filteredList.map((e,index)=>(
                        <tr key={index}>
                            <td>{e.degreeName}</td>
                            <td>{formattedAmount(e.numberSalary)}</td>
                           
                            <td>
                                <div className={classes.groupButtonOption}>
                                        <button className={classes.updateButton} onClick={() => handleClickUpdateButton(e)}>
                                            <FontAwesomeIcon icon={faPen}/>
                                        </button>

                                        <button className={classes.deleteButton}
                                        onClick={()=> handleClickDeleteButton(e.degreeName)}
                                        >
                                            <FontAwesomeIcon icon={faTrash}/>
                                        </button>
                                </div>
                            </td>
                        </tr>
                      
                    ))}
                 
                </tbody>
            </table>

        {modalAdd &&
                <div className={classes.modalAddDegree}>
                    <div className={classes.modalAddDegreeContent}>
                    <span className={classes.closeButton} onClick={closeModal}>&times;</span>
                            <form id='formAddDegree' className={classes.mainGroup}>
                                <h3>Thêm bằng cấp</h3>

                                <div className={classes.formGroup}>
                                    <label>Tên bằng cấp</label>
                                    <input placeholder='Nhập tên bằng cấp...' name='degreeName'/>
                                </div>

                                <div className={classes.formGroup}>
                                    <label htmlFor="">Số tiền tương ứng</label>
                                    <input type='number' placeholder='Nhập số tiền tương ứng...' name='numberSalary'/>
                                </div>


                                <div className={classes.groupButton}>
                                    <button className={classes.btnSave} onClick={addDegree}>Thêm</button>
                                    <button className={classes.btnDelete} onClick={closeModal}>Hủy</button>
                                </div>
                            </form>
                    </div>
                </div>
        }

        {modalUpdate && 
                <div className={classes.modalAddDegree}>
                        <div className={classes.modalAddDegreeContent}>
                        <span className={classes.closeButton} onClick={closeModalUpdate}>&times;</span>
                        <form id='formUpdateDegree' className={classes.mainGroup}>
                                <h3>Chỉnh sửa bằng cấp</h3>

                                <div className={classes.formGroup}>
                                    <label>Tên bằng cấp</label>
                                    <input placeholder='Nhập tên bằng cấp...' name='degreeName' defaultValue={ DegreeUpdate?.degreeName}/>
                                </div>

                                <div className={classes.formGroup}>
                                    <label htmlFor="">Số tiền tương ứng</label>
                                    <input type='number' placeholder='Nhập tên số tiền tương ứng...' name='numberSalary' defaultValue={DegreeUpdate?.numberSalary}/>
                                </div>

                            
                                <div className={classes.groupButton}>
                                    <button className={classes.btnSave} onClick={updateDegree}>Lưu</button>
                                    <button className={classes.btnDelete} onClick={closeModalUpdate}>Hủy</button>
                                </div>
                            </form>
                        </div>
                </div>
            }
    
        {modalDelete && 
                <div className={classes.modalAddDegree}>
                    <div className={classes.modalAddDegreeContent}>
                        <span className={classes.closeButton} onClick={closeModalDelete}>&times;</span>
                        <h3 style={{"textAlign":"center"}}>Bạn có chắc muốn thực hiện xóa bằng cấp này không?</h3>
                        <div className={classes.groupButton}>
                                    <button className={classes.btnSave} onClick={deleteDegree}>Có</button>
                                    <button className={classes.btnDelete} onClick={closeModalDelete}>Không</button>
                                </div>
                    </div>
                </div>
        }

        </div>
    )
}

export default DegreePage;