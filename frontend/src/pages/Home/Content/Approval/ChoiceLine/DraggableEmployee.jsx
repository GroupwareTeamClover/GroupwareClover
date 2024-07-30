import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes'; 

export const DraggableEmployee = ({ employee, onItemClick, children }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.EMPLOYEE,
        item: { employee },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={drag}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            onClick={() => onItemClick(employee)}
        >
            {children}
        </div>
    );
};