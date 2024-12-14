'use client'
import { FormEvent, useEffect, useState } from 'react';
import classes from './department.module.css'
import Cookies from 'js-cookie';
import { addRoleInServer, AdminPageRoleProps, DeleteRoleInServer, RoleRequest, RoleResponse, updateRoleInServer } from '@/pages/api/admin/apiRole';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { errorSwal, successSwal } from '@/custom/sweetalert';
import { useRouter } from 'next/navigation';
import { addDepartmentInServer, DeleteDepartmentInServer, Department, updateDepartmentInServer } from '@/pages/api/hr/apiDepartment';



const  DepartmentPage:React.FC<{department:Department[]}> =({department}) =>{
    const router = useRouter();
    const [modalAdd,setModalAdd] = useState(false);
    const [modalUpdate,setModalUpdate] = useState(false);
    const [modalDelete,setModalDelete] = useState(false);
    const [roleUpdate,setRoleUpdate] = useState<Department>();
    const [prevRoleName,setPrevRoleName] = useState("");
    const [searchTerm, setSearchTerm] = useState('');
    const token = Cookies.get('token');

    const handleClickAddButton = ()=>setModalAdd(true);

    const handleClickUpdateButton = (roleResponse: Department)=>{
        setModalUpdate(true);
        setRoleUpdate(roleResponse);
        setPrevRoleName(roleResponse.departmentCode);
    }
    
    const handleClickDeleteButton = (roleName: string)=>{
        setModalDelete(true);
        setPrevRoleName(roleName);
    }

    const closeModal = () => setModalAdd(false);

    const closeModalUpdate = ()=> setModalUpdate(false);

    const closeModalDelete = ()=> setModalDelete(false);
    
    const addRole = async (event:FormEvent)=>{
        event.preventDefault();
        const formElement = document.getElementById('formAddRole') as HTMLFormElement;
        if (!formElement) {
            console.error('Form element not found');
            return;
        }
        const form = new FormData(formElement);
        const role:Department ={
            departmentCode: form.get('departmentCode') as string,
            departmentsName: form.get('departmentName') as string,
           
        }

      const response =  await addDepartmentInServer(role,token!);
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

    const updateRole = async(event:FormEvent)=>{
        event.preventDefault();
        const formElement = document.getElementById('formUpdateRole') as HTMLFormElement;
        if (!formElement) {
            console.error('Form element not found');
            return;
        }
        const form = new FormData(formElement);
        const role:Department ={
            departmentCode: form.get('departmentCode') as string,
            departmentsName: form.get('departmentName') as string,

        }
        const response = await updateDepartmentInServer(prevRoleName,role,token!);
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

    const deleteRole = async()=>{
        const response = await DeleteDepartmentInServer(prevRoleName,token!);
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

   

    const filteredList = searchTerm
    ? department.filter(item => {
        // Kiểm tra các điều kiện tìm kiếm cho tất cả các trường
        const search = searchTerm.toLowerCase(); // Chuyển searchTerm về dạng chữ thường
        return (
          (item.departmentCode && item.departmentCode.toLowerCase().includes(search)) || 
          (item.departmentsName && item.departmentsName.toLowerCase().includes(search))  // Tìm kiếm trong scope
        );
      })
    : department; // Nếu không có searchTerm thì trả về danh sách gốc

    return (
        <div className={classes.article}>
            <h2 className={classes.nameTable}>Danh sách phòng ban trong ứng dụng</h2>

            <div className={classes.groupOption}> 
                <input type="text" placeholder='Tìm kiếm...' 
                value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                />

                <button className={classes.btnAddRole} onClick={handleClickAddButton}>
                    <FontAwesomeIcon icon={faPlus}/>
                </button>
            </div>

            <table>
                <thead>
                    <th>Mã phòng ban</th>
                    <th>Tên phòng ban</th>
                    <th>Hành động</th>
                </thead>

                <tbody>
                    {filteredList.map((e,index)=>(
                        <tr key={index}>
                            <td>{e.departmentCode}</td>
                            <td>{e.departmentsName}</td>
                            
                        
                            <td>
                                <div className={classes.groupButtonOption}>
                                        <button className={classes.updateButton} onClick={() => handleClickUpdateButton(e)}>
                                            <FontAwesomeIcon icon={faPen}/>
                                        </button>

                                        <button  className={classes.deleteButton}
                                        onClick={()=> handleClickDeleteButton(e.departmentCode)}
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
                <div className={classes.modalAddRole}>
                    <div className={classes.modalAddRoleContent}>
                    <span className={classes.closeButton} onClick={closeModal}>&times;</span>
                            <form id='formAddRole' className={classes.mainGroup}>
                                <h3>Thêm phòng ban</h3>

                                <div className={classes.formGroup}>
                                    <label>Mã phòng ban</label>
                                    <input placeholder='Nhập mã phòng ban...' name='departmentCode'/>
                                </div>

                                <div className={classes.formGroup}>
                                    <label htmlFor="">Tên phòng ban</label>
                                    <input placeholder='Nhập tên phòng ban...' name='departmenName'/>
                                </div>

                            

                                <div className={classes.groupButton}>
                                    <button className={classes.btnSave} onClick={addRole}>Thêm</button>
                                    <button className={classes.btnDelete} onClick={closeModal}>Hủy</button>
                                </div>
                            </form>
                    </div>
                </div>
        }

        {modalUpdate && 
                <div className={classes.modalAddRole}>
                        <div className={classes.modalAddRoleContent}>
                        <span className={classes.closeButton} onClick={closeModalUpdate}>&times;</span>
                        <form id='formUpdateRole' className={classes.mainGroup}>
                                <h3>Chỉnh sửa phòng ban</h3>

                                <div className={classes.formGroup}>
                                    <label>Mã phòng ban</label>
                                    <input placeholder='Nhập mã phòng ban...' name='departmentCode' defaultValue={ roleUpdate?.departmentCode}/>
                                </div>

                                <div className={classes.formGroup}>
                                    <label htmlFor="">Tên phòng ban</label>
                                    <input placeholder='Nhập tên phòng ban...' name='departmentName' defaultValue={roleUpdate?.departmentsName}/>
                                </div>

                            

                                <div className={classes.groupButton}>
                                    <button className={classes.btnSave} onClick={updateRole}>Lưu</button>
                                    <button className={classes.btnDelete} onClick={closeModalUpdate}>Hủy</button>
                                </div>
                            </form>
                        </div>
                </div>
            }
    
        {modalDelete && 
                <div className={classes.modalAddRole}>
                    <div className={classes.modalAddRoleContent}>
                        <span className={classes.closeButton} onClick={closeModalDelete}>&times;</span>
                        <h3 style={{"textAlign":"center"}}>Bạn có chắc muốn thực hiện xóa phòng ban này không?</h3>
                        <div className={classes.groupButton}>
                                    <button className={classes.btnSave} onClick={deleteRole}>Có</button>
                                    <button className={classes.btnDelete} onClick={closeModalDelete}>Không</button>
                                </div>
                    </div>
                </div>
        }

        </div>
    )
}

export default DepartmentPage;