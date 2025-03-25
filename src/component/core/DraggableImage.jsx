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
        addBlinkingBox,
        workingStatus
    } = useContext(WheelContext);

    // Memoize drag configuration
    const dragConfig = useMemo(() => ({
        type: ITEM_TYPES.IMAGE,
        item: workingStatus ? { axelId, side, position, wheelId } : null,
        collect: (monitor) => ({
            // isDragging: !!monitor.isDragging(),
            isDragging: workingStatus ? !!monitor.isDragging() : false,
        }),
    }), [axelId, side, position, wheelId, workingStatus]);

    // Use useDrag with memoized config
    const [{ isDragging }, drag] = useDrag(() => dragConfig, [dragConfig]);

    // Memoize click handlers to prevent unnecessary re-renders

    const handleClick = useCallback(() => {
        if (!workingStatus) return;
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
    }, [clickTimeout, wheelId, axelId, side, position, workingStatus]);

    const handleDoubleClick = useCallback(() => {
        if (!workingStatus) return;
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            setClickTimeout(null);
        }
        console.log(`Double Click: ${wheelId}, axelId: ${axelId}, wheelContainerPosition: ${side} ${position}`);
    }, [clickTimeout, wheelId, axelId, side, position, workingStatus]);

    // Memoize inline styles
    const dragStyles = useMemo(() => ({
        opacity: isDragging ? 0.2 : 1,
    }), [isDragging]);

    return (
        <div
            ref={drag}
            onClick={!workingStatus ? undefined : () => handleClick(axelId, side, position, wheelId)}
            onDoubleClick={!workingStatus ? undefined : () => handleDoubleClick(axelId, side, position, wheelId)}
            style={{
                opacity: !workingStatus ? 0.3 : (isDragging ? 0.2 : 1),
                pointerEvents: !workingStatus ? 'none' : 'auto'
            }}
            className="drag-cntr"
        >
            <img
                className={workingStatus ? "drag-img" : "drag-img disabled"}
                src={WheelImage}
                alt={`Wheel ${wheelId}`}
            />
            <span>{wheelId}</span>
        </div>
    );
});

export default DraggableImage;