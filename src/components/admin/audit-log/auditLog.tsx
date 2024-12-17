'use client'
import { useState } from 'react'
import styles from  './auditLog.module.css'
import { Notification } from '@/pages/api/admin/apiNotification';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'
import { AuditLog } from '@/pages/api/admin/apiAuditLog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
const AdminAuditLogPage:React.FC<{audit:AuditLog[]}> = ({audit})=>{
    const [searchTerm,setSearchTerm] = useState('');
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const totalPages = Math.ceil(audit.length / itemsPerPage);
  
    // const toggleSelectAll = () =>
    //   setSelectedIds(selectedIds.length === employee.length ? [] : employee.map((e) => e.idEmployee!));
    const handlePageChange = (pageNumber:number) => {
        setCurrentPage(pageNumber);
      };



    const filteredList = searchTerm ? audit.filter(
        (item) =>
          item.username.includes(searchTerm) ||
          item.action?.includes(searchTerm)
          || item.description.includes(searchTerm)
          || item.createtime?.includes(searchTerm)  
      ).slice((currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage) : audit.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );
      const downloadExcel = ()=>{
        const processedData = audit.map(item => ({
            'Tên tài khoản': item.username,
            'Hành động': item.action,
            'Mô tả': item.description,
            // 'Lương cơ bản': formattedAmount(item.basicSalary),
            // 'Số công thực tế': item.day_work.toString(), // Chuyển đổi Float32Array thành chuỗi
            // 'Thưởng':formattedAmount(item.reward),
            // 'Phạt': formattedAmount(item.punish),
            // 'Ngày tính lương': formatDate(item.createDate),
            // 'Tổng lương': formattedAmount(item.totalPayment), // Chuyển đổi Float32Array thành chuỗi
            'Ngày ghi nhận': item.createtime
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
          a.download = 'audit_log_report.xlsx';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
      };

    return (
        <div className={styles.article} >
            <h3 style={{textAlign:"center"}}>Danh sách các nhật ký</h3>
            <div className={styles.groupOption}>
            <input type="text" placeholder='Tìm kiếm...' 
                value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                />

                <button className={styles.btnAddNotification} onClick={downloadExcel}>
                    Xuất file Excel
                </button>
            </div>

            <table>
                <thead>
                        <tr>
                            <th>Tên tài khoản</th>
                            <th>Hành động</th>
                            <th>Mô tả</th>
                            <th>Ngày ghi nhận</th>
                        </tr>
                </thead>

                <tbody>
                        {filteredList.map((n,index)=>(
                            <tr key={index}>
                                <td>{n.username}</td>
                                <td>{n.action}</td>
                                <td>{n.description}</td>
                                <td>{n.createtime}</td>
                                
                            
                            </tr>
                        ))}
                </tbody>
            </table>

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
}   

export default AdminAuditLogPage;