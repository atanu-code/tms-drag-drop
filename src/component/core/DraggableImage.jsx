import React, { useState, useCallback, useMemo, useContext } from "react";
import { useDrag } from "react-dnd";
import '../../App.css';

import WheelImage from '../../assets/truck-wheel.png';
import { WheelContext } from "../../context/WheelContext";

const ITEM_TYPES = {
    IMAGE: "image",
};

const DraggableImage = React.memo(({
    axelId,
    side,
    position,
    wheelId
}) => {
    const [clickTimeout, setClickTimeout] = useState(null);

    const {
        setIsOpen,
        setTask,
        addBlinkingBox
    } = useContext(WheelContext);

    // Memoize drag configuration
    const dragConfig = useMemo(() => ({
        type: ITEM_TYPES.IMAGE,
        item: { axelId, side, position, wheelId },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [axelId, side, position, wheelId]);

    // Use useDrag with memoized config
    const [{ isDragging }, drag] = useDrag(() => dragConfig, [dragConfig]);

    // Memoize click handlers to prevent unnecessary re-renders

    const handleClick = useCallback(() => {
        if (clickTimeout) return;

        const timeout = setTimeout(() => {
            console.log(`Single Click: ${wheelId}, axelId: ${axelId}, wheelContainerPosition: ${side} ${position}`);

            //Click operation
            setIsOpen(true);
            setTask({
                TYPE: 'WHEELDETAILS',
                INFO: {
                    source: { wheelId, axelId, side, position }
                }
            })
            addBlinkingBox({
                axelId: axelId,
                side: side,
                position: position
            });


            setClickTimeout(null);
        }, 300);

        setClickTimeout(timeout);
    }, [clickTimeout, wheelId, axelId, side, position]);

    const handleDoubleClick = useCallback(() => {
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            setClickTimeout(null);
        }
        console.log(`Double Click: ${wheelId}, axelId: ${axelId}, wheelContainerPosition: ${side} ${position}`);
    }, [clickTimeout, wheelId, axelId, side, position]);

    // Memoize inline styles
    const dragStyles = useMemo(() => ({
        opacity: isDragging ? 0.2 : 1,
    }), [isDragging]);

    return (
        <div
            ref={drag}
            aria-label={`Draggable ${wheelId}`}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            style={dragStyles}
            className="drag-cntr"
        >
            <img
                className="drag-img"
                src={WheelImage}
                alt={`Wheel ${wheelId}`}
            />
            <span>{wheelId}</span>
        </div>
    );
});

export default DraggableImage;