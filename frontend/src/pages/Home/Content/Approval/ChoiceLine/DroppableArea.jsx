import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import styles from './ChoiceLine.module.css';

export const DroppableArea = ({ title, onDrop }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.EMPLOYEE,
        drop: (item) => onDrop(item.employee),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    return (
        <div ref={drop} className={styles.droppableArea} style={{ backgroundColor: isOver ? 'lightgreen' : 'white' }}>
            {title}
        </div>
    );
};


