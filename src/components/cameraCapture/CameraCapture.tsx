import { useState, useRef, useEffect } from "react";

// Định nghĩa kiểu cho props, trong trường hợp này không có props
export default function CameraCapture() {
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false); // Trạng thái bật/tắt camera
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Trạng thái bật/tắt modal
  const videoRef = useRef<HTMLVideoElement | null>(null); // Kiểu cho videoRef là <video> element
  const streamRef = useRef<MediaStream | null>(null); // Kiểu cho streamRef là MediaStream

  // Clean up stream khi component bị unmount
  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      console.log("Stream đã được gán:", streamRef.current);
      videoRef.current.srcObject = streamRef.current;
    }
  }, [streamRef.current]); // Chạy khi streamRef thay đổi

  const startCamera = async () => {
    try {
      // Yêu cầu quyền truy cập vào camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },  // Kích thước video yêu cầu
      });
      streamRef.current = stream;
      console.log(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;  // Gán stream vào video element
      }
      setIsCameraOn(true);
      setIsModalOpen(true); // Mở modal khi bật camera
    } catch (error) {
      console.error("Lỗi khi truy cập vào camera:", error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop()); // Dừng camera
    }
    setIsCameraOn(false);
    setIsModalOpen(false); // Đóng modal khi tắt camera
  };

  return (
    <div>
      <h1>{isCameraOn ? "Camera đang bật" : "Nhấn vào nút để bật camera"}</h1>
      {!isCameraOn ? (
        <button onClick={startCamera}>Bật Camera</button>
      ) : (
        <button onClick={stopCamera}>Tắt Camera</button>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Camera đang bật</h2>
            <div style={{ position: "relative", zIndex: 1000 }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{
                  width: "100%",      // Chiếm toàn bộ chiều rộng của container
                  height: "auto",     // Chiều cao tự động
                  objectFit: "cover", // Đảm bảo video không bị méo
                }}
              />
            </div>
            <button onClick={stopCamera} style={styles.closeButton}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// CSS styles
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
    maxHeight: "90%",   // Chiều cao tối đa của modal
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
};
