'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './contract.module.css';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { errorSwal } from '../custom/sweetalert';
interface Contract{
    idemployee:string;
    basicsalary:number;
    workingdays:number;
    startdate:string;
    endate:string;
    status:string;
}
export default function UserContract (){
    const username = localStorage.getItem('username');
    const [contracts,setContracts] = useState<Contract[]>([]); 
    const [contractsTwo,setContractsTwo] = useState<Contract[]>([]); 
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const getContractById = async ()=>{
        try{
            const response = await axios.get(`http://localhost:8087/api/v1/contract/${username}`);
            if(response.status === 200){
                setContracts(response.data.data);
                setContractsTwo(response.data.data);
          }else{
                errorSwal('Thất bại',`${response.data.message}`);
            }
        }catch(error:any){
            errorSwal('Thất bại',`${error.response.data.message}`);
        }
    }

    useEffect(()=>{
        getContractById();
    },[])

    const totalPages = Math.ceil(contracts.length / itemsPerPage);
    
    const handlePageChange = (pageNumber:number) => {
      setCurrentPage(pageNumber);
    };
    const handleSearch = (event:React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value;
        setSearchTerm(term);
      };
  
      const searchParams = ()=>{
          if(searchTerm === ''){
              setContracts(contractsTwo);
             
           }else{
              const filterdata = contracts.filter(
                  (item) =>
                    item.idemployee.includes(searchTerm) ||
                    item.startdate.includes(searchTerm)
                );
            setContracts(filterdata);
          }
      }
    
    return (
        <div className={classes.main_container}>
            <h2>Bảng danh sách hợp đồng lao động của nhân viên {username}</h2>
            <input type="text" name="" id="" placeholder='Tìm kiếm...'
             value={searchTerm}
             onChange={handleSearch}
            />
            <button onClick={searchParams} className={classes.btnSearch}>
                <FontAwesomeIcon icon={faSearch} />
               </button>

               <table className={classes.contractTable}>
                    <thead>
                        <tr>
                            <th>Mã nhân viên</th>
                            <th>Lương cơ bản</th>
                            <th>Số ngày công chuẩn</th>
                            <th>Ngày bắt đầu</th>
                            <th>ngày kết thúc</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>

                    <tbody>
                        {contracts.map((contract,index)=>(
                                 <tr key={index}>
                                 <td>{contract.idemployee}</td>
                                 <td>{contract.basicsalary}</td>
                                 <td>{contract.workingdays}</td>
                                 <td>{contract.startdate}</td>
                                 <td>{contract.endate}</td>
                                 <td>{contract.status}</td>
                             </tr>
                        ))};
                        
                       
                    </tbody>
               </table>
               <div className={classes.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? classes.active : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
        </div>
    )
}
