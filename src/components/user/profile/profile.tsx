'use client'
import { FormEvent, useEffect, useState } from 'react';
import classes from './profile.module.css'
import axios from 'axios';
import { successSwal } from '../custom/sweetalert';
import { useRouter } from 'next/navigation';
interface Employee {
    idemployee: string;
    firstname: string;
    lastname: string;
    gender: string;
    birthdate: string;
    cmnd: string;
    email: string;
    phonenumber: string;
    address: string;
    degree: number | string;
    status: number | string;
}
export default function UserProfile() {
    const [personal, setPersonal] = useState<Employee>();
    const [isShowUpdate, setIsShowUpdate] = useState(false);
    const username = localStorage.getItem('username');
    const router = useRouter();
    const getEmployeeById = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/employee/${username}`);
            if (response.status === 200) {
                // successSwal("Thành công",`${response.data.message}`);
                setPersonal(response.data.data);
            }
        } catch (error) {

        }
    }
    useEffect(() => {
        getEmployeeById();
    }, [])

    const showUpdate = (event:FormEvent) => {
        event.preventDefault();
        setIsShowUpdate(true);
    }
    
    const offUpdate = (event:FormEvent)=>{
        event.preventDefault();
        setIsShowUpdate(false);
    }

    const saveEmployee = async (event:FormEvent)=>{
        event.preventDefault();
        const formElement = document.getElementById('employeeFormUpdate') as HTMLFormElement;
        if (!formElement) {
            console.error('Form element not found');
            return;
        }
        const form = new FormData(formElement);
        const employee: Employee = {
            idemployee: form.get('idemployee') as string,
            firstname: form.get('firstname') as string,
            lastname: form.get('lastname') as string,
            gender: form.get('gender') as string,
            birthdate: form.get('birthdate') as string,
            cmnd: form.get('cmnd') as string,
            email: form.get('email') as string,
            phonenumber: form.get('phonenumber') as string,
            address: form.get('address') as string,
            degree: form.get('degree') as string, // Parsing as number
            status: form.get('status') as string,
        };
        const id = employee.idemployee;
        try {
            const response = await axios.put(`http://localhost:8080/api/v1/employee/${id}`, employee);
            if(response.data.status === 200){
              successSwal('Thành công',`${response.data.message}`);
              router.refresh();
              setIsShowUpdate(false);
            }
            
        } catch (error) {
            console.error('Error submitting employee data:', error);
        }
        

    }
    return (
        <div className={classes.main_container}>
            <div className={classes.button_space}>

            </div>

            <div className={classes.form_space}>
                <form id='employeeFormUpdate' className={classes.personalInfoForm}>
                    <h2 className={classes.formTitle}>Thông tin cá nhân</h2>

                    <div className={classes.formRow}>
                        <div className={classes.formGroup}>
                            <label htmlFor="employee-id">Mã nhân viên:</label>
                            <input type="text" id="employee-id" name="idemployee" defaultValue={personal?.idemployee} readOnly />
                        </div>
                        <div className={classes.formGroup}>
                            <label htmlFor="last-name">Họ:</label>
                            <input type="text" id="last-name" name="firstname" defaultValue={personal?.firstname}  readOnly={!isShowUpdate}/>
                        </div>
                        <div className={classes.formGroup}>
                            <label htmlFor="first-name">Tên:</label>
                            <input type="text" id="first-name" name="lastname" defaultValue={personal?.lastname}  readOnly={!isShowUpdate}/>
                        </div>
                    </div>

                    <div className={classes.formRow}>
                        <div className={classes.formGroup}>
                            <label htmlFor="gender">Giới tính:</label>
                            {isShowUpdate ? (
                                     <select id="gender" defaultValue={personal?.gender} name="gender">
                                     <option value="Nam">Nam</option>
                                     <option value="Nữ">Nữ</option>
                                 </select>
                            ):(
                                <input type="text" name= "gender" defaultValue={personal?.gender} readOnly={!isShowUpdate}/>
                            )}
                           
                        </div>
                        <div className={classes.formGroup}>
                            <label htmlFor="dob">Ngày sinh:</label>
                            <input type="date" id="dob" name="birthdate" defaultValue={personal?.birthdate} readOnly={!isShowUpdate}/>
                        </div>
                        <div className={classes.formGroup}>
                            <label htmlFor="id-card">CMND:</label>
                            <input type="text" id="id-card" name="cmnd" defaultValue={personal?.cmnd} readOnly={!isShowUpdate}/>
                        </div>
                    </div>

                    <div className={classes.formRow}>
                        <div className={classes.formGroup}>
                            <label htmlFor="email">Email:</label>
                            <input type="text" id="email" name="email" defaultValue={personal?.email} readOnly={!isShowUpdate}/>
                        </div>
                        <div className={classes.formGroup}>
                            <label htmlFor="phone">Số điện thoại:</label>
                            <input type="text" id="phone" name="phonenumber" defaultValue={personal?.phonenumber} readOnly={!isShowUpdate}/>
                        </div>
                        <div className={classes.formGroup}>
                            <label htmlFor="address">Địa chỉ:</label>
                            <input type="text" id="address" name="address" defaultValue={personal?.address} readOnly={!isShowUpdate}/>
                        </div>
                    </div>

                    <div className={classes.formRow}>
                        <div className={classes.formGroup}>
                            <label htmlFor="degree">Bằng cấp:</label>
                            <input type ="text" name="degree" defaultValue={personal?.degree} readOnly/>
                        </div>
                        <div className={classes.formGroup}>
                            <label htmlFor="status">Trạng thái:</label>
                            <input type ="text" name="status" defaultValue={personal?.status} readOnly/>
                        </div>
                    </div>
                    <div className={classes.buttonRow}>
                        {!isShowUpdate ? (
                            <button onClick={showUpdate} className={classes.updateButton}>Cập nhật</button>
                        ) : (
                            
                            <>
                                <button onClick={saveEmployee} className={classes.saveButton}>Lưu</button>
                                <button onClick={offUpdate} className={classes.cancelButton}>Hủy</button>
                            </>
                        )}


                    </div>
                </form>

            </div>
        </div>
    )
}