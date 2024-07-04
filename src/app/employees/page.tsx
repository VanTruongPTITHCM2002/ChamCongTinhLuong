import axios from "axios";

export default function Page(){
    const fetchData = () => {
        axios.get('http://localhost:8080/api/v1/employee')
            .then(response => {
               console.log('Dữ liệu:',response.data)
            })
            .then(data => {
                console.log("API Data:", data);
             
            })
            .catch(error => {
                console.error("Lỗi khi xử lý dữ liệu từ API:");
              
            });
    };
    fetchData();
    return(
        <span></span>
    )
}