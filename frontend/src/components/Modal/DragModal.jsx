
import React from 'react';
import Draggable from 'react-draggable';
import styles from './DragModal.module.css';

const DragModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <Draggable handle={`.${styles.modalHeader}`}>
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <button className={styles.closeButton} onClick={onClose}>
              &times;
            </button>
          </div>
          {children}
        </div>
      </div>
    </Draggable>
  );
};

export default DragModal;
