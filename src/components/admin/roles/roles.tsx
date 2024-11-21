'use client'
import { FormEvent, useEffect, useState } from 'react';
import classes from './roles.module.css'
import Cookies from 'js-cookie';
import { addRoleInServer, AdminPageRoleProps, DeleteRoleInServer, RoleRequest, RoleResponse, updateRoleInServer } from '@/pages/api/admin/apiRole';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { errorSwal, successSwal } from '@/custom/sweetalert';
import { useRouter } from 'next/navigation';



const  AdminRolesPage:React.FC<AdminPageRoleProps> =({role}) =>{
    const router = useRouter();
    const [modalAdd,setModalAdd] = useState(false);
    const [modalUpdate,setModalUpdate] = useState(false);
    const [modalDelete,setModalDelete] = useState(false);
    const [roleUpdate,setRoleUpdate] = useState<RoleResponse>();
    const [prevRoleName,setPrevRoleName] = useState("");
    const [searchTerm, setSearchTerm] = useState('');
    const token = Cookies.get('token');

    const handleClickAddButton = ()=>setModalAdd(true);

    const handleClickUpdateButton = (roleResponse: RoleResponse)=>{
        setModalUpdate(true);
        setRoleUpdate(roleResponse);
        setPrevRoleName(roleResponse.rolename);
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
        const role:RoleRequest ={
            rolename: form.get('roleName') as string,
            roleDescription: form.get('roleDescription') as string,
            scope: form.get('scope') as string
        }

      const response =  await addRoleInServer(role,token!);
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
        const role:RoleResponse ={
            rolename: form.get('roleName') as string,
            roleDescription: form.get('roleDescription') as string,
            createAt: form.get('createAt') as string,
            updateAt: form.get('updateAt') as string,
            scope: form.get('scope') as string,
            isActive: Boolean(form.get('isActive'))
        }
        const response = await updateRoleInServer(prevRoleName,role,token!);
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
        const response = await DeleteRoleInServer(prevRoleName,token!);
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
    ? role.filter(item => {
        // Kiểm tra các điều kiện tìm kiếm cho tất cả các trường
        const search = searchTerm.toLowerCase(); // Chuyển searchTerm về dạng chữ thường
        return (
          (item.rolename && item.rolename.toLowerCase().includes(search)) || 
          (item.createAt && item.createAt.toLowerCase().includes(search)) || // Tìm kiếm trong createAt
          (item.updateAt && item.updateAt.toLowerCase().includes(search)) || // Tìm kiếm trong updateAt
          (item.roleDescription && item.roleDescription.toLowerCase().includes(search)) || // Tìm kiếm trong roleDescription
          (item.scope && item.scope.toLowerCase().includes(search)) // Tìm kiếm trong scope
        );
      })
    : role; // Nếu không có searchTerm thì trả về danh sách gốc

    return (
        <div className={classes.article}>
            <h2 className={classes.nameTable}>Danh sách vai trò trong ứng dụng</h2>

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
                    <th>Tên vai trò</th>
                    <th>Mô tả</th>
                    <th>Ngày tạo</th>
                    <th>Ngày cập nhật</th>
                    <th>Phạm vi</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </thead>

                <tbody>
                    {filteredList.map((e,index)=>(
                        <tr key={index}>
                            <td>{e.rolename}</td>
                            <td>{e.roleDescription}</td>
                            <td>{e.createAt}</td>
                            <td>{e.updateAt}</td>
                            <td>{e.scope}</td>
                            <td>
                                {e.isActive ? 
                                <div className={classes.Active}>
                                    Đang sử dụng
                                </div>
                              
                                 :
                                 <div className={classes.InActive}>
                                      Không sử dụng   
                                 </div>
                                 
                                  }    
                            </td>
                            <td>
                                <div className={classes.groupButtonOption}>
                                        <button className={classes.updateButton} onClick={() => handleClickUpdateButton(e)}>
                                            <FontAwesomeIcon icon={faPen}/>
                                        </button>

                                        <button className={classes.deleteButton}
                                        onClick={()=> handleClickDeleteButton(e.rolename)}
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
                                <h3>Thêm vai trò</h3>

                                <div className={classes.formGroup}>
                                    <label>Tên vai trò</label>
                                    <input placeholder='Nhập tên vai trò...' name='roleName'/>
                                </div>

                                <div className={classes.formGroup}>
                                    <label htmlFor="">Mô tả</label>
                                    <input placeholder='Nhập tên mô tả...' name='roleDescription'/>
                                </div>

                                <div className={classes.formGroup}>
                                    <label htmlFor="">Phạm vi</label>
                                    <select name='scope'>
                                        <option value="Toàn bộ">Toàn bộ</option>
                                        <option value= "Phòng ban">Phòng ban</option>
                                        <option value="Cá nhân">Cá nhân</option>
                                    </select>
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
                                <h3>Chỉnh sửa vai trò</h3>

                                <div className={classes.formGroup}>
                                    <label>Tên vai trò</label>
                                    <input placeholder='Nhập tên vai trò...' name='roleName' defaultValue={ roleUpdate?.rolename}/>
                                </div>

                                <div className={classes.formGroup}>
                                    <label htmlFor="">Mô tả</label>
                                    <input placeholder='Nhập tên mô tả...' name='roleDescription' defaultValue={roleUpdate?.roleDescription}/>
                                </div>

                                <div className={classes.formGroup}>
                                    <label htmlFor="">Ngày tạo</label>
                                    <input type='text' name = 'createAt' defaultValue={roleUpdate?.createAt}/>
                                </div>

                                <div className={classes.formGroup}>
                                    <label htmlFor="">Ngày cập nhật</label>
                                    <input type='text' name = 'updateAt' defaultValue={roleUpdate?.updateAt}/>
                                </div>

                                <div className={classes.formGroup}>
                                    <label htmlFor="">Phạm vi</label>
                                    <select name='scope' defaultValue={roleUpdate?.scope}>
                                        <option value="Toàn bộ">Toàn bộ</option>
                                        <option value= "Phòng ban">Phòng ban</option>
                                        <option value="Cá nhân">Cá nhân</option>
                                    </select>
                                </div>

                                <div className={classes.formGroup}>
                                    <label htmlFor="">Trạng thái</label>
                                    <select name="isActive" id="" defaultValue={String(roleUpdate?.isActive)}>
                                            <option value="1">Đang sử dụng</option>
                                            <option value="0">Không sử dụng</option>
                                    </select>
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
                        <h3 style={{"textAlign":"center"}}>Bạn có chắc muốn thực hiện xóa vai trò này không?</h3>
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

export default AdminRolesPage;