import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useDrop } from "react-dnd";
import { motion } from "framer-motion";
import '../../App.css';

import AddButton from '../../assets/add-button.png';
import DraggableImage from "./DraggableImage";
import { WheelContext } from "../../context/WheelContext";

const ItemTypes = {
    IMAGE: "image",
};

const WheelContainer = React.memo(({ onDrop, wheel }) => {

    const {
        setIsOpen,
        setTask,
        blinkingBox,
        addBlinkingBox,
        existsBlinkingBox,
        workingStatus
    } = useContext(WheelContext);

    const [blinking, setBlinking] = useState(false);
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.IMAGE,
        drop: workingStatus ? onDrop : null,
        collect: (monitor) => ({
            isOver: workingStatus ? !!monitor.isOver() : false,
        }),
    }), [workingStatus, onDrop]);

    // const AddTask = () => {
    //     // setBlinking(true);
    //     const newBox = {
    //         axelId: wheel[0],
    //         side: wheel[1],
    //         position: wheel[2]
    //     }
    //     addBlinkingBox(newBox);
    //     setIsOpen(true);
    //     setTask({
    //         TYPE: 'ADDTASK',
    //         INFO: wheel
    //     })
    // }

    const boxToCheck = useMemo(() => ({
        axelId: wheel[0],
        side: wheel[1],
        position: wheel[2]
    }), [wheel]);

    const AddTask = useCallback(() => {
        if (!workingStatus) return; // Prevent action if disabled
        addBlinkingBox(boxToCheck);
        setIsOpen(true);
        setTask({
            TYPE: 'ADDTASK',
            INFO: wheel
        });
    }, [addBlinkingBox, setIsOpen, setTask, wheel, boxToCheck]);

    useEffect(() => {
        const exist = existsBlinkingBox(boxToCheck);
        setBlinking(exist);
    }, [blinkingBox, boxToCheck, existsBlinkingBox]);

    const renderContent = useMemo(() => {
        return wheel[3] ? (
            <DraggableImage
                axelId={wheel[0]}
                side={wheel[1]}
                position={wheel[2]}
                wheelId={wheel[3]}
            />
        ) : (
            <img
                className={workingStatus ? "add-btn" : "add-btn disabled"}
                width={40}
                height={40}
                src={AddButton}
                alt="Add Wheel"
                onClick={AddTask}
            />
        );
    }, [wheel, AddTask]);

    return (
        <motion.div
            animate={
                blinking
                    ? { backgroundColor: ["#1E3A8A", "#F59E0B", "#1E3A8A"] }
                    : { backgroundColor: "transparent" } // Explicitly setting to transparent
            }
            transition={
                blinking
                    ? { duration: 1, repeat: Infinity, ease: "easeInOut" }
                    : {} // No transition when blinking is false
            }
        >
            <div
                ref={drop}
                className="wheel-row-cntr"
                style={{
                    background: isOver ? "rgba(0,0,0,0.1)" : "none",
                    border: isOver ? "none" : "dashed 1px #cccccc",
                }}
            >
                {renderContent}
            </div>
        </motion.div>
    );
});

export default WheelContainer;