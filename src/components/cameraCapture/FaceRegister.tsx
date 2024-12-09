import React, { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import { successSwal } from "@/custom/sweetalert";
import FaceRecognition from "./FaceRecognition";

interface FaceRegisterProps {
  onSaveFaceData: (employeeId: string, descriptor: Float32Array) => void;
}

const FaceRegister = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState<boolean>(false);
  const employeeId = localStorage.getItem('username');
  const [faceDescriptors, setFaceDescriptors] = useState<Float32Array[]>([]);
  const streamRef = useRef<MediaStream | null>(null); // Kiểu cho streamRef là MediaStream

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models";
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    loadModels();
  }, []);

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

  const captureFaceData = async () => {
    if (!employeeId) {
      alert("Vui lòng nhập mã nhân viên!");
      return;
    }

    if (!videoRef.current) {
      console.error("Video element not found.");
      return;
    }

    try {
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();
     
      if (detections) {
        const descriptor = detections.descriptor; // Vector đặc trưng khuôn mặt
        console.log(Array.from(descriptor));
        // setFaceDescriptors((prev) => [...prev, descriptor]);
        // const faceData = faceDescriptors[faceDescriptors.length - 1]; // Lấy descriptor cuối cùng
  
        try{
            const response = await axios.post("http://localhost:8091/api/v1/face",{
              employeeId: employeeId,
              faceDescriptor: Array.from(descriptor)
            })
            successSwal('Thành công',response.data.message);
        }catch(error:any){

        }
      } else {
        alert("Không tìm thấy khuôn mặt. Hãy thử lại!");
      }
    } catch (error) {
      console.error("Error capturing face data:", error);
    }
  };
  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop()); // Dừng camera
    }

    setModelsLoaded(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null; // Gỡ stream khỏi video element
    } // Đóng modal khi tắt camera
  };
  return (
    <div>
      {modelsLoaded && (
        <>

  <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>

            <div style={{ position: "relative", zIndex: 1000 }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                width={720} height={500}
              />
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
            <button onClick={stopCamera} style={styles.closeButton}>
              Đóng
            </button>
            <button onClick={startVideo} style={styles.openCameraButton}>Bật Camera</button>
          <button onClick={captureFaceData} style={styles.faceRegisterButton}>Lưu Khuôn Mặt</button>
          </div>
            </div>
           
        </div>

          {/* <video ref={videoRef} autoPlay muted width={720} height={560} /> */}
          

        </>
      )}
    </div>
  );
};

export default FaceRegister;

const styles = {
  modalOverlay: {
    position: "fixed" as "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,  // Đảm bảo modal xuất hiện trên các thành phần khác
  },
  modalContent: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "90%",   // Đảm bảo modal chiếm gần hết màn hình
    maxWidth: "800px",  // Bạn có thể thay đổi kích thước tối đa của modal
  
    overflow: "hidden", // Để tránh cuộn khi video chiếm toàn bộ không gian
  },
  closeButton: {
    padding: "10px 20px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    margin:"auto"
  },
  openCameraButton: {
    padding: "10px 20px",
    backgroundColor: "green",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    margin:"auto"
  },
  faceRegisterButton: {
    padding: "10px 20px",
    backgroundColor: "blue",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    margin:"auto"
  },
};
