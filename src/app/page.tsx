
'use client';
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as faceapi from "face-api.js";
import styles from './page.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { errorSwal, successSwal } from "@/custom/sweetalert";
import axios from "axios";


function convertToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function calculateWorkHours(startTime: string, endTime: string): number {
  const startMinutes = convertToMinutes(startTime);
  const endMinutes = convertToMinutes(endTime);
 
  const gracePeriodStartMinutes = convertToMinutes('08:15');

 
  const gracePeriodEndMinutes = convertToMinutes('16:45');

  // Tính toán thời gian trễ và về sớm
  let lateMinutes = 0;
  let earlyLeaveMinutes = 0;

  if (startMinutes > gracePeriodStartMinutes) {
      lateMinutes = startMinutes - gracePeriodStartMinutes;
  }

  if (endMinutes < gracePeriodEndMinutes) {
      earlyLeaveMinutes = gracePeriodEndMinutes - endMinutes;
  }

  return Number((1 - ((lateMinutes + earlyLeaveMinutes)/480)).toFixed(3)) > 0 ? Number((1 - ((lateMinutes + earlyLeaveMinutes)/480)).toFixed(3)):0
  
}

function compareTimes(time1: string, time2: string): number {
  return convertToMinutes(time1) - convertToMinutes(time2);
}

export default function Home() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const streamRef = useRef<MediaStream | null>(null); // Kiểu cho streamRef là MediaStream
  const [isOut, setIsOut] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleCheckIn = () => {
 
    setModelsLoaded(true);
  }

  const handleCheckOut = async () => {
    setModelsLoaded(true);
    setIsOut(true);
  };
  useEffect(()=>{
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models"; // Đảm bảo đường dẫn chính xác
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
       
        console.log("Mô hình đã được tải thành công.");
      } catch (error) {
        console.error("Lỗi khi tải mô hình:", error);
      }
    };
  loadModels();
},[])

const startVideo = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      console.log("Camera started");
      streamRef.current = stream;
    }
  } catch (error) {
    console.error("Error accessing camera:", error);
  }
};

const stopVideo = () => {
  if (streamRef.current) {
    const tracks = streamRef.current.getTracks();
    tracks.forEach(track => track.stop()); // Dừng camera
  }

  setModelsLoaded(false);
  if (videoRef.current) {
    videoRef.current.srcObject = null; // Gỡ stream khỏi video element
  } // Đóng modal khi tắt camera
};


const identifyUser = async (descriptor: Float32Array) => {
  try {
    const response = await axios.post("http://localhost:8091/api/v1/face/recognize", {
     // idEmployee:employeeId,
      faceDescriptor: Array.from(descriptor),
    });
  
    if(isOut){
      await checkOutWork(response.data.data);
    }else{
      await checkInWork(response.data.data);
    }

  //successSwal('Thành công',response.data.data);

  } catch (error:any) {
    errorSwal("Lỗi", error.response.data.message);
  }
  console.log(Array.from(descriptor));
};

const detectFaceLoop = async () => {
  if (!videoRef.current) return;

  const video = videoRef.current;
  const canvas = canvasRef.current;

  // Tạo canvas phù hợp với kích thước của video
  const displaySize = { width: video.width, height: video.height };

  faceapi.matchDimensions(canvas!, displaySize);
  const detections = await faceapi
    .detectSingleFace(video)
    .withFaceLandmarks()
    .withFaceDescriptor();
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height); // Xóa canvas trước khi vẽ lại
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    faceapi.draw.drawDetections(canvas!, resizedDetections!);
    faceapi.draw.drawFaceLandmarks(canvas!, resizedDetections!);
  if (detections) {
    const descriptor = detections.descriptor;
    if (descriptor) {
      console.log("Khuôn mặt đã được nhận diện!");
      await identifyUser(descriptor);
      return; // Gửi descriptor để nhận diện
    } else {
      console.log("Không phát hiện khuôn mặt.");
    }
  }

  requestAnimationFrame(detectFaceLoop); // Tiếp tục vòng lặp nhận diện
};

const handleStartRecognition = async () => {
  // if (!employeeId) {
  //   alert("Vui lòng nhập mã nhân viên!");
  //   return;
  // }
  detectFaceLoop(); // Bắt đầu nhận diện khuôn mặt
};

const checkInWork = async (name:string)=>{
  const today = new Date().toISOString().slice(0, 10);
  const newEntry: Attendance = {
    idemployee: `${name}` , 
    dateattendance: today,
    // startime: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
   checkintime:new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
     //checkintime:"10:30",
    checkouttime: '',
    status: compareTimes(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), "08:15") > 0 ? 'Đi trễ': 'Đi làm đầy đủ',
    numberwork: 0,

  };
  if(compareTimes(newEntry.checkintime,"17:15") >= 0){
        errorSwal('Thất bại','Ngoài thời gian chấm công');
        return;
    }
    try{
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/attendance`,newEntry);
      if(response.status === 201){
          
        // setCurrentCheckIn(newEntry);
        // setAttendance([newEntry,...attendance]);
        // setError(null);
            successSwal('Thành công',`${response.data.message}`);
      }
      // if(response.data.status === 404){
      //   errorSwal('Thất bại',response.data.message);
      //   return;
      // }
  }catch(error:any){
      errorSwal('Thất bại',`${error.response.data.message}`);
  }
}

const checkOutWork = async (name:string)=>{
  // setCurrentCheckIn(attendance.find(item => item.checkouttime === '') ?? null);
  // if (currentCheckIn) {
  //   const today = new Date().toISOString().slice(0, 10);
  //   const hasCheckedOut = attendance.some((item) =>
  //     item.idemployee === currentCheckIn.idemployee &&
  //     item.dateattendance === today &&
  //     item.checkintime &&
  //     item.checkouttime
  //   );

  //   let statusAttendance = '';
  //   if (hasCheckedOut) {
  //     setError('Bạn đã chấm công ra trong ngày hôm nay rồi.');
  //     return;
  //   }
  const today = new Date().toISOString().slice(0, 10);
    
    let endTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  //   // const totalAdjustedDays = calculateAdjustedDays(currentCheckIn.startime, endTime);
 
  //   if (compareTimes(currentCheckIn.checkintime, "08:15") > 0 && compareTimes(endTime, "16:45") > 0) {
  //       statusAttendance = 'Đi trễ';
  //   } else if (compareTimes(currentCheckIn.checkintime, "08:15") <= 0 && compareTimes(endTime, "16:45") < 0) {
  //      statusAttendance ='Về sớm';
  //   }else if(compareTimes(currentCheckIn.checkintime, "08:15") > 0 && compareTimes(endTime, "16:45") < 0){
  //      statusAttendance ='Đi trễ về sớm';
  //   } 
  //   else {
  //        statusAttendance ='Đi làm đầy đủ';
  //   }
  

    let checkoutt = "16:00";

    const updatedEntry: Attendance = {
      idemployee:name!,
      dateattendance:today,
      checkintime:"",
      checkouttime: endTime,
      // checkouttime:checkoutt,
      status:"",
      // attendanceStatusName:statusAttendance, // Hoặc tính toán trạng thái khác
      numberwork:0,
    //   workhours: totalAdjustedDays // Số công
    };


    try{
        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/v1/attendance`,updatedEntry);
        if(response.status === 200){
            // const updatedData = attendance.map((item) =>
            //     item.idemployee === currentCheckIn.idemployee && item.dateattendance === currentCheckIn.dateattendance ? updatedEntry : item
            //   );
            //   setAttendance(updatedData);
            //   setCurrentCheckIn(null);
            //   setError(null);
              successSwal('Thành công',`${response.data.message}`);
        }
        if(response.data.status === 404){
          errorSwal('Thất bại',response.data.message);
          return;
        }
    }catch(error:any){
        errorSwal('Thất bại',`${error.response.data.message}`);
    }
  setIsOut(false);

  }
  const handleLogin = ()=>{
  router.push('/login');
}





  return (
    <div className={styles.mainContainer}>

      <div>
        {/* <button className={styles.btnLogin} onClick={handleLogin}>Đăng nhập</button> */}
      </div>
     

      <div className={styles.groupButton}>
        <button className={styles.check_in_button}
        onClick={handleCheckIn}
        >
          <FontAwesomeIcon icon={faRightToBracket} style={{ marginRight: '5px' }} />
          Chấm công vào
        </button>
        <button className={styles.check_out_button}
        onClick={handleCheckOut}
        >
          <FontAwesomeIcon icon={faRightFromBracket} style={{ marginRight: '5px' }} />
          Chấm công ra
        </button>

      </div>


      {modelsLoaded && (
                        <>
                        <div className={styles.modalOverplay}>
                      <div className={styles.modalContent}>
                      
                           <div style={{ position: "relative", zIndex: 1000 }}>
                           <video ref={videoRef} autoPlay muted width={700} height={500} />   
                              <canvas
                                ref={canvasRef}
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  border: "1px solid red", // Đường viền giúp dễ kiểm tra canvas
                                }}
                              />
                           </div>
                        

                          <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                            <button className={styles.startCamera} onClick={startVideo}>Bắt đầu nhận diện khuôn mặt</button>
                          <button className={styles.faceRecoginiCamera} onClick={handleStartRecognition}>Nhận diện khuôn mặt</button>
                          <button className={styles.closeButton} onClick={stopVideo}>Tắt Camera</button>
                          </div>
                          
                          </div>
                          </div>
                        </>
                      )}

    </div>
  );

}
