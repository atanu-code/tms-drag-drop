
import React, { useContext } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { MultiBackend, TouchTransition } from "react-dnd-multi-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import Equipment from "./component/core/Equipment";
import SlidingBox from "./component/core/SlidingBox";
import Inventory from "./component/core/Inventory";

import './App.css';
import { WheelContext } from "./context/WheelContext";

const MainApp = () => {
    const { handleInvtDrop } = useContext(WheelContext);
    return (
        <DndProvider
            backend={MultiBackend}
            options={{
                backends: [
                    {
                        id: "html5",
                        backend: HTML5Backend,
                        preview: true
                    },
                    {
                        id: "touch",
                        backend: TouchBackend,
                        options: { enableMouseEvents: true },
                        transition: TouchTransition
                    }
                ]
            }}
        >
            <div className="eqpmnt-cntr">
                <div className="eqpmnt-mnu">
                    <ul className="eqpmnt-mnu-list">
                        <Inventory onDrop={(item) => handleInvtDrop(item)}
                        />
                        <li>
                            Menu2
                        </li>
                        <li>
                            Menu3
                        </li>
                    </ul>
                </div>
                <div className="equipment">
                    <Equipment />
                </div>

                <div className="eqpmnt-popup">
                    <SlidingBox />
                </div>
            </div>
        </DndProvider>
    )
};

export default MainApp;