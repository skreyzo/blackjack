import React from 'react';

interface ModalProps {
  show: boolean;
  onChoice: (value: number) => void;
}

const Modal: React.FC<ModalProps> = ({ show, onChoice }) => {
  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <p>Choose Ace value:</p>
        <button onClick={() => onChoice(1)}>1</button>
        <button onClick={() => onChoice(11)}>11</button>
      </div>
    </div>
  );
};

export default Modal;