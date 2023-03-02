import ReactDom from 'react-dom'
import { ReactNode, useRef } from 'react'

type ModalProps = {
  children: ReactNode,
  open: boolean,
  onClose: () => void,
  position?: string,
  className?: string
}
  
const Modal = ({ children, open, onClose, position='center', className="" }:ModalProps) => {
  const overlayRef = useRef(null)
  if(!open) return null;
  return ReactDom.createPortal(
    <div className={`overflow-y-auto fixed top-0 left-0 bottom-0 right-0 bg-secondary/50 z-10 ${className}`} ref={overlayRef} onClick={onClose}>
      <div 
        className={`absolute rounded-2xl ${position}`} 
        onClick={e => e.stopPropagation()}
        >
        {children}
      </div>
      <style jsx>{`
        .top {
          top: 0;
        }
        .left {
          left: 0;
        }
        .right {
          right: 0;
        }
        .bottom {
          bottom: 0;
        }
        .center {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
    </div>
    , document.getElementById('portal') as HTMLElement
  )
}
export default Modal