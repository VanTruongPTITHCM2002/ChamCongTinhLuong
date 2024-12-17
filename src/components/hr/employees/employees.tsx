'use client'
import { Employee } from '@/pages/api/admin/apiEmployee';
import styles from  './employees.module.css'
import { DepartmentsDTO } from '@/pages/api/admin/apiDepartments';
import * as XLSX from 'xlsx';
import { FormEvent, useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie'
import axios from 'axios';
import { errorSwal } from '@/custom/sweetalert';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faPen, faPlus, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import Modal from '@/components/modal';
import Image from 'next/image';
import { addAuditLogServer } from '@/pages/api/admin/apiAuditLog';
import { format } from 'date-fns';
import jsPDF from 'jspdf'; 
import autoTable from  'jspdf-autotable'

function formatDateString(dateString: string): string {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  }

const HR_employee:React.FC<{employee:Employee[],department:DepartmentsDTO[]}>= ({employee,department})=>{
    const router = useRouter();
    const token = Cookies.get('token');
    const [employeeData, setemployeeData] = useState<Employee[]>([]);
    let username = '';
    if (typeof window !== 'undefined'){
     username = localStorage.getItem('username')!;
    }
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    
 
    const totalPages = Math.ceil(employee.length / itemsPerPage);
    
    const handlePageChange = (pageNumber:number) => {
      setCurrentPage(pageNumber);
    };
    
   
    const [showModal, setShowModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const handleDeleteEmployee = (maNV: string) => {
        // Tạo mảng mới chỉ chứa những nhân viên không có mã nhân viên bằng maNV
        const updatedemployee = employeeData.filter(employee => employee.idEmployee !== maNV);
        // Cập nhật lại danh sách nhân viên
        setemployeeData(updatedemployee);
    };
    const handleUpdateClick = (employee: Employee) => {
        setSelectedEmployee(employee); // Lưu thông tin nhân viên được chọn

        setShowModal(true); // Hiển thị modal
    };
     // Xử lý hàm đóng modal
     const handleCloseModal = () => {
        setShowModal(false);
       
    };

    const handleCancelEdit = () => {
        setSelectedEmployee(null);
        setShowModal(false);
        setImage(null);
      };
    

    const handleClickAdd = ()=>{
        setShowModal(true);
        setSelectedEmployee(null);
    }
    const [employeeId, setEmployeeId] = useState<string>('');




    const handleAddEmployee = async (event:FormEvent) =>{
        event.preventDefault();
        const formElement = document.getElementById('employeeForm') as HTMLFormElement;
        if (!formElement) {
            console.error('Form element not found');
            return;
        }
    
     
        const form = new FormData(formElement);
        let hasErrors = false;
        let errorMessages: string = '';
        for (const [key, value] of form.entries()) {
            if (!value) {
                const inputElement = document.querySelector(`[name="${key}"]`);
        
                // Tìm label tương ứng với input
                const label =  inputElement?.previousElementSibling;
                if (label && label.tagName === 'LABEL') {
                    errorMessages = `${label.textContent} không được để trống.`;
                }
                hasErrors = true;
                break; // Ngắt vòng lặp sớm
            }
        }
        if (hasErrors) {
          errorSwal('Thất bại',errorMessages);
            setShowModal(true); // Hiển thị modal nếu cần
            return;
        }
    
        const employee: Employee = {
            firstName: form.get('firstname') as string,
            lastName: form.get('lastname') as string,
            gender: form.get('gender') as string,
            birthDate: form.get('birthdate') as string,
            idCard: form.get('cmnd') as string,
            email: form.get('email') as string,
            phoneNumber: form.get('phonenumber') as string,
            address: form.get('address') as string,
            degree: form.get('degree') as string, // Parsing as number
            status: form.get('status') as string,
            position:form.get('position') as string,
            department:form.get('department') as string,
        };
    
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/employee`, employee,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                      }
                }
            );
           
           
                if(response.data.status === 201){
                    Swal.fire({
                        title: "Thành công",
                        text: `${response.data.message}`,
                        icon: "success"
                      });
                      await addAuditLogServer({
                        username:username!,
                        action:"Thêm nhân viên",
                        description:username  + " thêm thành công nhân viên",
                        createtime:format(new Date(), 'dd/MM/yyyy HH:mm:ss')
                    })
                     const formImage = new FormData();
                     formImage.append("image", file!); // 'file' phải khớp với tên parameter ở backend
                     formImage.append("idEmployee",response.data.data)
                     try {
                       const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/employee/upload`, {
                         method: "POST",
                         body: formImage,
                         headers:{
                               Authorization: `Bearer ${token}`
                         }
                       });
                 
                   
                     } catch (error) {
                      
                     }
                      router.refresh();
            }
         //   alert("Thêm nhân viên thành công");
        } catch (error) {
            console.error('Error submitting employee data:', error);
        }
        
       
       setShowModal(false);
        
    }

    const handleUpdateEmployee = async (event:FormEvent)=>{
        event.preventDefault();
        const formElement = document.getElementById('employeeFormUpdate') as HTMLFormElement;
        if (!formElement) {
            console.error('Form element not found');
            return;
        }
        const form = new FormData(formElement);
      
        const employee: Employee = {
           // idEmployee: form.get('idemployee') as string,
            firstName: form.get('firstname') as string,
            lastName: form.get('lastname') as string,
            gender: form.get('gender') as string,
            birthDate: form.get('birthdate') as string,
            idCard: form.get('cmnd') as string,
            email: form.get('email') as string,
            phoneNumber: form.get('phonenumber') as string,
            address: form.get('address') as string,
            degree: form.get('degree') as string, // Parsing as number
            status: form.get('status') as string,
            position:form.get('position') as string,
            department:form.get('department') as string,
        };
        const id = form.get('idemployee') as string;
        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/employee/${id}`, employee
                ,  {
                    headers: {
                        Authorization: `Bearer ${token}`
                      }
                }
            );
            if(response.data.status === 200){
              
                  
                //   setemployeeData(prevemployee => {
                //     const updatedemployee = prevemployee.map(emp => {
                //         if (emp.idEmployee === employee.idEmployee) {
                //             return { ...emp, ...employee };
                //         }
                //         return emp;
                //     });
                //     return updatedemployee;
                // });
                await addAuditLogServer({
                    username:username!,
                    action:"Cập nhật nhân viên",
                    description:username  + " cập nhật thành công nhân viên " + id,
                    createtime:format(new Date(), 'dd/MM/yyyy HH:mm:ss')
                })
                const formImage = new FormData();
                formImage.append("image", file!); // 'file' phải khớp với tên parameter ở backend
                formImage.append("idEmployee",id)
                try {
                  const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/employee/upload`, {
                    method: "POST",
                    body: formImage,
                    headers:{
                          Authorization: `Bearer ${token}`
                    }
                  });
            
              
                } catch (error) {
                 
                }
                Swal.fire({
                    title: "Thành công",
                    text: `${response.data.message}`,
                    icon: "success"
                  });
                 
            }
            
        } catch (error) {
            console.error('Error submitting employee data:', error);
        }
        
   
    setShowModal(false);
    setSelectedEmployee(null); 
    router.refresh();
    }

    

    const handleDetailClick = (employee:Employee) => {
        Swal.fire({
            title: `<strong>Chi tiết nhân viên</strong>`,
            html: `
                <div class="${styles.employeeDetails}">
        
                      <div class="${styles.formGroup}">
                        <label><strong>Hình ảnh:</strong></label>
                        <img  src="${`data:image/jpeg;base64,${employee.image!}`}" alt=''
                                    width="100" height="100"/>
                    </div>
                    <div class="${styles.formGroup}"></div>
                    <div class="${styles.formGroup}">
                        <label><strong>Mã nhân viên:</strong></label>
                        <input type="text" value="${employee.idEmployee}" readonly class="${styles.input}"/>
                    </div>
                    <div class="${styles.formGroup}">
                        <label><strong>Họ:</strong></label>
                        <input type="text" value="${employee.firstName}" readonly class="${styles.input}"/>
                    </div>
                    <div class="${styles.formGroup}">
                        <label><strong>Tên:</strong></label>
                        <input type="text" value="${employee.lastName}" readonly class="${styles.input}"/>
                    </div>
                    <div class="${styles.formGroup}">
                        <label><strong>Giới tính:</strong></label>
                        <input type="text" value="${employee.gender}" readonly class="${styles.input}"/>
                    </div>
                    <div class="${styles.formGroup}">
                        <label><strong>Ngày sinh:</strong></label>
                        <input type="text" value="${employee.birthDate}" readonly class="${styles.input}"/>
                    </div>
                    <div class="${styles.formGroup}">
                        <label><strong>Địa chỉ:</strong></label>
                        <input type="text" value="${employee.address}" readonly class="${styles.input}"/>
                    </div>
                    <div class="${styles.formGroup}">
                        <label><strong>Số điện thoại:</strong></label>
                        <input type="text" value="${employee.phoneNumber}" readonly class="${styles.input}"/>
                    </div>
                    <div class="${styles.formGroup}">
                        <label><strong>CMND:</strong></label>
                        <input type="text" value="${employee.idCard}" readonly class="${styles.input}"/>
                    </div>
                    <div class="${styles.formGroup}">
                        <label><strong>Email:</strong></label>
                        <input type="text" value="${employee.email}" readonly class="${styles.input}"/>
                    </div>
                     <div class="${styles.formGroup}">
                        <label><strong>Phòng ban:</strong></label>
                        <input type="text" value="${employee.department}" readonly class="${styles.input}"/>
                    </div>
                     <div class="${styles.formGroup}">
                        <label><strong>Chức vụ:</strong></label>
                        <input type="text" value="${employee.position}" readonly class="${styles.input}"/>
                    </div>
                    <div class="${styles.formGroupPair}">
                        <div class="${styles.formGroup}">
                            <label><strong>Bằng cấp:</strong></label>
                            <input type="text" value="${employee.degree}" readonly class="${styles.input}"/>
                        </div>
                        <div class="${styles.formGroup}">
                            <label><strong>Trạng thái:</strong></label>
                            <input type="text" value="${employee.status}" readonly class="${styles.input}"/>
                        </div>
                    </div>
                </div>
            `,
            width: 700,
            padding: '1em',
            background: '#f9f9f9',
            confirmButtonColor: '#007bff',
            customClass: {
                popup: styles.customSwalPopup,
                title: styles.customSwalTitle,
                htmlContainer: styles.customSwalHtml
            }
        });
        
        
    };

    const handleDeleteClick = async(employee:Employee)=>{
        Swal.fire({
            title: "Bạn có chắc chắn muốn xóa nhân viên này?",
            text: "Bạn sẽ không thể khôi phục lại dữ liệu đã xóa",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có",
            cancelButtonText:"Hủy",
          }).then(async (result) => {
            if (result.isConfirmed) {
               
                try {
                    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/employee/${employee.idEmployee}`
                        , {
                            headers: {
                                Authorization: `Bearer ${token}`
                              }
                        }
                    );
                    if(response.data.status === 200){
                        Swal.fire({
                            title: "Thành công",
                            text: `${response.data.message}`,
                            icon: "success"
                          });
        
                          setemployeeData(prevemployee => {
                            // Loại bỏ nhân viên với idemployee tương ứng
                            const updatedemployee = prevemployee.filter(emp => emp.idEmployee !== employee.idEmployee);
                            return updatedemployee;
                        });
                        await addAuditLogServer({
                            username:username!,
                            action:"Xóa nhân viên",
                            description:username  + "Xóa thành công nhân viên " + employee.idEmployee,
                            createtime:format(new Date(), 'dd/MM/yyyy HH:mm:ss')
                        })
                        router.refresh();
                    }
        
                    if(response.data.status === 400){
                        errorSwal('Thất bại',`${response.data.message}`);
                        return;
                    }
                    
                } catch (error:any) {
                    errorSwal('Thất bại',`${error.response.data.message}`)
                }
            }
          });
       
    }
    const currentData = searchTerm ? 
    employee.filter(
        (item) =>
          item.idEmployee!.includes(searchTerm) ||
          item.firstName.includes(searchTerm)
          || item.lastName.includes(searchTerm) ||
          item.email.includes(searchTerm) ||
          item.gender.includes(searchTerm)
          || item.birthDate.includes(searchTerm)
          || item.status.toString().includes(searchTerm)
        
      ).slice((currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage) 
    :
    employee.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )

      const searchButton = ()=>{
        if(searchTerm === ''){
            setemployeeData(employee);
           
         }else{
            const filterdata = employee.filter(
                (item) =>
                  item.idEmployee!.includes(searchTerm) ||
                  item.firstName.includes(searchTerm)
                  || item.lastName.includes(searchTerm) ||
                  item.email.includes(searchTerm) ||
                  item.gender.includes(searchTerm)
                  || item.birthDate.includes(searchTerm)
                  || item.status.toString().includes(searchTerm)
                
              );
          setemployeeData(filterdata);

        
        }
      }
      const handleSearch = (event:React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value;
        setSearchTerm(term);
      };
     

    
  
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>,str?:string) => {
          const value = e.target.value;
          const regex = /^[a-zA-Z0-9\p{L}\p{M}]+(?:\s[a-zA-Z0-9\p{L}\p{M}]+)*$/u;
          const normalizedValue = value.trim();

            if(normalizedValue ===''){
                errorSwal('Lỗi','Không được để khoảng trắng')
                e.target.value = e.target.value.trim();
                return;
            }
            if (!regex.test(normalizedValue)) {
                errorSwal('Lỗi','Tên chỉ được chứa các ký tự chữ cái hoặc số!');
                if(str != undefined){
                    e.target.value = str;
                    e.target.focus();
                    return;
                }
                e.target.value = '';
                return;
            } 
          
        
      };

      const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>, prevValue ?:string) => {
        e.preventDefault();
        const birthdate = new Date(e.target.value);
        const today = new Date();
        
        const age = today.getFullYear() - birthdate.getFullYear();
        const monthDiff = today.getMonth() - birthdate.getMonth();
        const dayDiff = today.getDate() - birthdate.getDate();

        // Kiểm tra nếu chưa đủ 18 tuổi
        if (age < 18 || (age === 18 && monthDiff < 0) || (age === 18 && monthDiff === 0 && dayDiff < 0)) {
            
            errorSwal('Thất bại','Bạn phải đủ 18 tuổi để đăng ký.');
            if(prevValue != undefined){
                e.target.value = prevValue;
                e.target.focus();
                return;
            }
            e.target.value = ''; // Reset lại giá trị của input
        }
    };
      const handleAddress = (e: React.ChangeEvent<HTMLInputElement>,address?:string) => {
        const value = e.target.value;
        const regex = /^[a-zA-Z0-9\p{L}\p{M}\s,./]+$/u;

          if(value.trim() ===''){
              return;
          }
          if (!regex.test(value)) {
            
              errorSwal('Lỗi','Vui lòng không nhập địa chỉ chứa kí tự đặc biệt ngoài /');
              if(address != undefined){
                e.target.value = address;
                e.target.focus();
                return;
            }
          } 
      
    };
      const checkNumber =(e: React.ChangeEvent<HTMLInputElement>,phone?:string) => {

        let value = e.target.value;
        const regex = /^[0-9]+$/
        if(value.trim() ===''){
            return;
        }

        if(value.length > 11)
       {
            errorSwal('Lỗi','Không nhập quá 11 số');
            if(phone != undefined){
                e.target.value = phone;
                e.target.focus();
                return;
            }
            value = value.slice(0, 11);
            e.target.value = value;
          
       }
        if(!regex.test(value)){
        
            errorSwal('Lỗi','Không được nhập chữ');
            if(phone != undefined){
                e.target.value = phone;
                e.target.focus();
                return;
            }
            e.target.value = '';
        }
       
      }
  
      const checkCMND = (e: React.ChangeEvent<HTMLInputElement>,cmnd?:string)=>{
        let value = e.target.value;
        const regex = /^[0-9]+$/
        if(value.trim() ===''){
            return;
        }

        if(value.length > 12)
       {
            errorSwal('Lỗi','Không nhập quá 12 số');

            if(cmnd != undefined){
                e.target.value = cmnd;
                e.target.focus();
                return;
            }

            value = value.slice(0, 12);
            e.target.value = value;
          
       }
        if(!regex.test(value)){
        
            errorSwal('Lỗi','Không được nhập chữ');
            if(cmnd != undefined){
                e.target.value = cmnd;
                e.target.focus();
                return;
            }
            e.target.value = '';
        }
       
      }
      

      const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const File = event.target.files?.[0];
        if (File) {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (reader.result) {
              // Chắc chắn rằng reader.result là một string
              setImage(reader.result as string); 
            }
          };
          setFile(File);
          reader.readAsDataURL(File); // Đọc file và chuyển thành base64
        }
      };
      const downloadExcel = ()=>{
        const processedData = employee.map(item => ({
            'Mã nhân viên': item.idEmployee,
            'Họ': item.firstName,
            "Tên": item.lastName,
            'Giới tính': item.gender,
            'Ngày sinh': item.birthDate, 
            'Địa chỉ':item.address,
            'Số điện thoai': item.phoneNumber,
            'CMND': item.idCard,
            'Bằng cấp': item.degree,
            'Vị trí': item.position ,
            'Phòng ban':item.department,
            'Trạng thái': item.status
          }));
      
          // Chuyển đổi dữ liệu thành worksheet
          const worksheet = XLSX.utils.json_to_sheet(processedData);
      
          // Tạo workbook chứa worksheet
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      
          // Xuất file Excel
          const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      
          // Tạo liên kết tải xuống
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'employee_report.xlsx';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
      };

      const downloadPDF = ()=>{
    
        const doc = new jsPDF();
     
        
        // Tiêu đề PDF
        doc.setFontSize(12);
        doc.text("Danh sách nhân viên", 14, 20);
      
        const columns: { header: string; dataKey: keyof Employee }[] = [
            { header: "Mã nhân viên", dataKey: "idEmployee" },
            { header: "Họ", dataKey: "firstName" },
            {header: "Tên", dataKey: "lastName"},
            { header: "Giới tính", dataKey: "gender" },
            { header: "Ngày sinh", dataKey: "birthDate" },
            { header: "Địa chỉ", dataKey: "address" },
            { header: "Số điện thoại", dataKey: "phoneNumber" },
            { header: "CMND", dataKey: "idCard" },
            { header: "Bằng cấp", dataKey: "degree" },
            { header: "Vị trí", dataKey: "position" },
            { header: "Phòng ban", dataKey: "department" },
            { header: "Trạng thái", dataKey: "status" },
          ];
      
        // Thêm bảng dữ liệu vào PDF
        autoTable(doc, {
            head: [columns.map((col) => col.header)], // Tiêu đề bảng
            body: employee.map((item) =>
              columns.map((col) => item[col.dataKey]!) // Dữ liệu từng dòng
            ),
          startY: 30,
          theme: "grid", // Giao diện bảng
          headStyles: {
            font: 'times',
            fontStyle: "bold",
            fontSize: 8,
          },
          bodyStyles: {
            font: 'times',
            fontStyle: "normal",
            fontSize: 6,
            cellWidth:'wrap',
          },
          alternateRowStyles: { fillColor: [240, 240, 240] },
  
        });
      
        // Lưu file PDF
        doc.save("DanhSachNhanVien.pdf");
}

      
    return (
        <div className={styles.article}>
             
            <h2 style={{textAlign:"center"}}>Bảng danh sách nhân viên</h2>
            <div className={styles.article_button}>

                <div className={styles.groupOption}>
                      <input type="text" placeholder='Tìm kiếm...' 
                              value={searchTerm}
                              onChange={handleSearch}
                        />
                        <button style={{height: "30px",width:"100px",backgroundColor:"green",border:"none"

                            ,cursor:"pointer"
                        }} onClick={downloadExcel}> 
                            Xuất file Excel
                        </button> 

                    <button style={{
                        height: "30px", width: "100px", backgroundColor: "red", border: "none"

                        , cursor: "pointer"
                    }} onClick={downloadPDF}
                    > Xuất file PDF</button>

                 <button className={styles.btnAddRole} title='Thêm nhân viên' onClick={handleClickAdd}><FontAwesomeIcon icon={faPlus} style={{ display: "inline-block", /* Đảm bảo thẻ <i> có thể nhận kích thước */
                width: "12px",
                height: "12px",
                overflow: "visible",
                margin:"0",
                padding:"0",
                boxSizing: "border-box",
                overflowClipMargin: "initial",
                verticalAlign: "initial"
            }} /></button>  
            </div>
            

                     
             </div>
             
        <table>
            <thead>
                <tr>
                <th>Hình ảnh</th>
                <th>Mã nhân viên</th>
                <th>Họ nhân viên</th>
                <th>Tên nhân viên</th>
                <th>Giới tính</th>
                <th>Ngày sinh</th>
                <th>Trạng thái</th>
                {/* <th>Số điện thoại</th>
                <th>CMND</th>
                <th>Email</th>
                <th>Bằng cấp</th>
                <th>Trạng thái</th> */}
                <th>Hành động</th>
                </tr>
            </thead>
                    
            <tbody>
                    {currentData.filter(e => e.idEmployee !== username).map((employee, index) => (
                        <tr key={index}>
                            <td >
                               <div>
                                    <Image 
                                    // src={`data:image/jpeg;base64,${employee.image!}`} 
                                    src={`data:image/jpeg;base64,${employee.image!}`}
                                    alt=''
                                    width={60} height={30}
                                    />
                               </div>
                            </td>
                            <td>{employee.idEmployee}</td>
                            <td>{employee.firstName}</td>
                            <td>{employee.lastName}</td>
                            <td>{employee.gender}</td> 
                            <td>{ formatDateString(employee.birthDate)}</td>
                            <td className={employee.status === 'Đang hoạt động' ? styles.statusActive : styles.statusInactive}>
        {employee.status === 'Đang hoạt động' ? 'Đang hoạt động' : 'Ngưng hoạt động'}
      </td>
                            {/* <td>{employee.address}</td> */}
                            {/* <td>{employee.phonenumber}</td>
                            <td>{employee.cmnd}</td>
                            <td>{employee.email}</td>
                            <td>{employee.degree}</td>
                            <td>{employee.status}</td> */}
                            
                            <td>
                                <div className={styles.btn}>
                                    <button className={styles.btn_update} title = 'Sửa nhân viên' onClick={() => handleUpdateClick(employee)}><FontAwesomeIcon icon={faPen}/></button>
                                   
                                   
                                    <button className={styles.btn_detail} title='Chi tiết nhân viên' onClick={() => handleDetailClick(employee)}>
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                </button> {/* <a onClick={() => handleDeleteEmployee(employee.idemployee)}>Xóa</a> */}

                                <button className = {styles.btn_delete} title='Xóa nhân viên (Chỉ xóa khi nhân viên đó chưa từng có hợp đồng)' onClick={()=>handleDeleteClick(employee)} ><FontAwesomeIcon icon={faTrash}/></button>
                                </div>
                            </td>
                        </tr>
                         ))}
                </tbody>
        </table>
        <div id="modal-root"> {showModal && (
                <Modal onClose={handleCloseModal}>
                    {/* Nội dung modal */}
                    {selectedEmployee ? (
                        <form id='employeeFormUpdate' className={styles.employeeDetails}>
                        
                            <h2 className={styles.centeredHeading}>Chỉnh sửa thông tin nhân viên</h2>
                            <div  className={styles.formGroup}>
                                {/* <label>Mã nhân viên:</label>
                                <input name="idemployee" type="text" defaultValue={employeeId} readOnly/> */}
                                <label htmlFor="fileInput">Select an image:</label>
                                <input
                                    type="file"
                                    id="fileInput"
                                    accept="image/*"
                                  onChange={handleImageChange}
                                />

                               {image? 
                                     (
                                        <div>
                                        <h3>Preview:</h3>
                                        <Image src={image!}  alt="Selected Preview" width="200" height={100}/>
                                    </div>
                                    )
                                    :
                                    (
                                        <div>
                                        <h3>Preview:</h3>
                                        <Image 
                                        src={`${`data:image/jpeg;base64,${selectedEmployee.image!}`}`}  
                                        alt="Selected Preview" 
                                        width="200" height={100}/>
                                    </div>
                                    )   
                            }
                                   
                           
                            </div>


                        <div  className={styles.formGroup}>
                                <label>Mã nhân viên:</label>
                                <input name="idemployee" type="text" defaultValue={selectedEmployee.idEmployee} readOnly/>
                            </div>
                            <div  className={styles.formGroup}>
                                <label>Họ nhân viên:</label>
                                <input name="firstname" type="text" required defaultValue={selectedEmployee.firstName}
                                onChange={(e)=>handleChange(e,selectedEmployee.firstName)}/>
                            </div>
                            <div  className={styles.formGroup}>
                                <label>Tên nhân viên:</label>
                                <input name="lastname" type="text" required defaultValue={selectedEmployee.lastName}
                                onChange={(e)=>handleChange(e,selectedEmployee.lastName)}/>
                            </div>
                            
                                <div className={styles.formGroup}>
                                    <label htmlFor="gender">Giới Tính:</label>
                                    <select id="gender" name="gender" required defaultValue={selectedEmployee.gender}>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="address">Địa Chỉ:</label>
                                    <input type="text" id="address" name="address" required defaultValue={selectedEmployee.address}
                                    onChange={(e)=>handleAddress(e,selectedEmployee.address)}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="phonenumber">Số Điện Thoại:</label>
                                    <input type="text" id="phonenumber" name="phonenumber" required defaultValue={selectedEmployee.phoneNumber}
                                    onChange={(e)=>checkNumber(e,selectedEmployee.phoneNumber)}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="cmnd">CMND:</label>
                                    <input type="text" id="cmnd" name="cmnd" required defaultValue={selectedEmployee.idCard}
                                    onChange={(e)=>checkCMND(e,selectedEmployee.idCard)}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="email">Email:</label>
                                    <input type="email" id="email" name="email" required defaultValue={selectedEmployee.email}/>
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="birthdate">Ngày sinh:</label>
                                    <input type="date" id="birthdate" name="birthdate" required defaultValue={selectedEmployee.birthDate}
                                    onChange={(e)=>handleBirthdateChange(e,selectedEmployee.birthDate)}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="degree">Bằng Cấp:</label>
                                    <select id="degree" name="degree" required defaultValue={selectedEmployee.degree}>
                                        <option value="Đại học">Đại học</option>
                                        <option value="Cao đẳng">Cao đẳng</option>
                                        <option value="Thạc sĩ">Thạc sĩ</option>
                                        <option value="Tiễn sĩ">Tiến sĩ</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="position">Chức vụ:</label>
                                <select name="position" id="position" defaultValue={selectedEmployee.position}>
                                    <option value="Nhân viên">Nhân viên</option>
                                    <option value="Trưởng phòng">Trưởng phòng</option>
                                </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="department">Phòng ban:</label>
                                <select name="department" id="department" defaultValue={selectedEmployee.department}>
                                    {department.map((r, idx) => (
                                        <option key={idx} value={r.departmentsName}>
                                            {r.departmentsName}
                                        </option>
                                    ))}
                                </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="status">Trạng Thái:</label>
                                    <select id="status" name="status" required defaultValue={selectedEmployee.status}>
                                        <option value="Đang hoạt động">Đang hoạt động</option>
                                        <option value="Ngưng hoạt động">Ngưng hoạt động</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>

                                </div>
                        {/* Thêm các trường thông tin khác */}
                        <div className={styles.formGroupButton}>
                          <button type="submit" className={styles.btn_submit} onClick={handleUpdateEmployee}>Lưu</button>
                          <button type="button"  className={styles.btn_cancel} onClick={handleCancelEdit}>Hủy</button>
                        </div>
                      </form>
                    ):  <form  id='employeeForm' className={styles.employeeDetails} >
                    <h2 className={styles.centeredHeading}>Thêm mới nhân viên</h2>
                            <div  className={styles.formGroup}>
                                {/* <label>Mã nhân viên:</label>
                                <input name="idemployee" type="text" defaultValue={employeeId} readOnly/> */}
                                <label htmlFor="fileInput">Select an image:</label>
                                <input
                                    type="file"
                                    id="fileInput"
                                    accept="image/*"
                                  onChange={handleImageChange}
                                />

                                {image && (
                                    <div>
                                        <h3>Preview:</h3>
                                        <Image src={image} alt="Selected Preview" width="200" height={100}/>
                                    </div>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                             
                            </div>

                            <div className={styles.formGroup}>
                                <label>Họ nhân viên:</label>
                                <input name="firstname"   ref={inputRef} type="text" required
                              
                                onChange={handleChange}
                             />
                             
                            </div>
                            <div  className={styles.formGroup}>
                                <label>Tên nhân viên:</label>
                                <input name="lastname" ref={inputRef} type="text" required
                                 onChange={handleChange}
                                />
                            </div>
                            
                                <div className={styles.formGroup}>
                                    <label htmlFor="gender">Giới Tính:</label>
                                    <select id="gender" name="gender" required>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="address">Địa Chỉ:</label>
                                    <input type="text" id="address" name="address" required
                                     onChange={handleAddress}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="phonenumber">Số Điện Thoại:</label>
                                    <input type="text" id="phonenumber" name="phonenumber" required
                                    onChange={checkNumber}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="cmnd">CMND:</label>
                                    <input type="text" id="cmnd" name="cmnd" required
                                    onChange={checkCMND}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="email">Email:</label>
                                    <input type="email" id="email" name="email" required/>
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="birthdate">Ngày sinh:</label>
                                    <input type="date" id="birthdate" name="birthdate" required onChange={handleBirthdateChange}/>
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="degree">Bằng Cấp:</label>
                                    <select id="degree" name="degree" required>
                                    <option value="Đại học">Đại học</option>
                                        <option value="Cao đẳng">Cao đẳng</option>
                                        <option value="Thạc sĩ">Thạc sĩ</option>
                                        <option value="Tiễn sĩ">Tiến sĩ</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="position">Chức vụ:</label>
                                <select name="position" id="position">
                                    <option value="Nhân viên">Nhân viên</option>
                                    <option value="Trưởng phòng">Trưởng phòng</option>
                                </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="department">Phòng ban:</label>
                                <select name="department" id="department">
                                    {department.map((r, idx) => (
                                        <option key={idx} value={r.departmentsName}>
                                            {r.departmentsName}
                                        </option>
                                    ))}
                                </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="status">Trạng Thái:</label>
                                    <select id="status" name="status" required>
                                    <option value="Đang hoạt động">Đang hoạt động</option>
                                    <option value="Ngưng hoạt động">Ngưng hoạt động</option>
                                    </select>
                                </div>
                              

                         
                            <div className={styles.formGroupButton}>
                                <button className={styles.btn_submit} type="submit" onClick={handleAddEmployee}>Thêm</button>
                                <button className={styles.btn_cancel} type="button" onClick={handleCancelEdit}>Hủy</button>
                            </div>
                </form>}
                </Modal>
            )}</div>

<div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? styles.active : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
    )
};

export default HR_employee;