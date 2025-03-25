import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useDrop } from "react-dnd";
import WheelTrash from '../../assets/inventory.png';

import '../../App.css';
import { WheelContext } from "../../context/WheelContext";

const ItemTypes = {
    IMAGE: "image",
};

const Inventory = ({ onDrop }) => {

    const { wheelState } = useContext(WheelContext);

    const [isShaking, setIsShaking] = useState(false);
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.IMAGE,
        drop: (draggedItem) => {
            setIsShaking(true);

            // Call onDrop with the dropped item
            setTimeout(() => {
                setIsShaking(false);
                onDrop(draggedItem); // Pass the item to onDrop
            }, 500);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));
    // Shake animation variants
    const shakeAnimation = {
        shake: { x: [-5, 5, -5, 5, 0], transition: { duration: 0.5 } },
        normal: { x: 0 },
    };
    return (
        <li ref={drop}>
            <motion.div
                animate={isShaking ? "shake" : "normal"}
                variants={shakeAnimation}
                className="wheel-trash-cntr"
            >
                <img
                    className="wheel-trash"
                    src={WheelTrash}
                    style={{
                        scale: isOver ? 1.5 : 1
                    }}
                    onClick={() => {
                        console.log(wheelState)
                    }}
                />
                <span>INVENTORY</span>
            </motion.div>
        </li>
    )
}

export default Inventory;