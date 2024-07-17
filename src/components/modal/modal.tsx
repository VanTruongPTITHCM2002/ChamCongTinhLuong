import React from 'react'

import classes from "./modal.module.css"
import ReactDOM from 'react-dom';

interface ModalProps{
    onClose:()=>void;
    customStyles?: React.CSSProperties;
    children: React.ReactNode;
}

const Modal:React.FC<ModalProps>=({onClose,children,customStyles})=>{
    const modalRoot = document.getElementById('modal-root');

    if (!modalRoot) return null;
    return ReactDOM.createPortal(
        <div className={classes.modalOverlay} onClick={onClose}>
            <div className={ customStyles ? classes.modal_content:classes.modalContent} onClick={(e)=>e.stopPropagation()}>
              <span className={classes.close} onClick={onClose}>&times;</span>  
              <div className={classes.modalBody}>
                {children}
              </div>

            </div>
        </div>,
        document.getElementById('modal-root') as HTMLElement

    );
}

export default Modal;