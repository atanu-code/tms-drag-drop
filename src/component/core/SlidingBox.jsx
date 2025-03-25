import React, { useContext, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import '../../App.css';

import WheelImage from '../../assets/truck-wheel.png';
import { WheelContext } from "../../context/WheelContext";

const INITIAL_TYRE_LIST = [
    { id: 566789, info: 'Lorem Ipsum is simply dummy text' },
    { id: 542552, info: 'Lorem Ipsum is simply dummy text' },
    { id: 927282, info: 'Lorem Ipsum is simply dummy text' },
    { id: 172628, info: 'Lorem Ipsum is simply dummy text' },
    { id: 928273, info: 'Lorem Ipsum is simply dummy text' }
];

const SlidingBox = () => {
    const [showLoader, setShowLoader] = useState(false);
    const [tyreList, setTyreLIst] = useState(INITIAL_TYRE_LIST);
    const {
        isOpen,
        setIsOpen,
        task,
        setTask,
        removeBlinkingBox,
        setWheelState,
        getPrevWheelState
    } = useContext(WheelContext);

    const delay = useCallback((ms) =>
        new Promise(resolve => setTimeout(resolve, ms)),
        []);

    const closeSlidingBox = useCallback((cancel = true) => {
        if (!task) return;

        const handleTaskType = {
            'ADDTASK': () => {
                const boxToRemove = {
                    axelId: task?.INFO[0],
                    side: task?.INFO[1],
                    position: task?.INFO[2]
                };
                removeBlinkingBox(boxToRemove);
            },
            'MOVETASK': () => {
                if (cancel) {
                    const prevState = getPrevWheelState();
                    setWheelState(prevState);
                }
                const sourceBoxToRemove = {
                    axelId: task?.INFO?.source?.axelId,
                    side: task?.INFO?.source?.side,
                    position: task?.INFO?.source?.position
                };
                const targetBoxToRemove = {
                    axelId: task?.INFO?.target?.axelId,
                    side: task?.INFO?.target?.side,
                    position: task?.INFO?.target?.position
                };
                removeBlinkingBox(sourceBoxToRemove);
                removeBlinkingBox(targetBoxToRemove);
            },
            'RETURNTASK': () => {
                if (cancel) {
                    const prevState = getPrevWheelState();
                    setWheelState(prevState);
                }
                const targetBoxToBeRemove = {
                    axelId: task?.INFO?.source?.axelId,
                    side: task?.INFO?.source?.side,
                    position: task?.INFO?.source?.position
                };
                removeBlinkingBox(targetBoxToBeRemove);
            },
            'WHEELDETAILS': () => {
                const targetBoxToBeRemove = {
                    axelId: task?.INFO?.source?.axelId,
                    side: task?.INFO?.source?.side,
                    position: task?.INFO?.source?.position
                };
                removeBlinkingBox(targetBoxToBeRemove);
            }
        };

        const handler = handleTaskType[task.TYPE];
        if (handler) {
            handler();
        }

        setTask(null);
        setIsOpen(!isOpen);
    }, [task, isOpen, removeBlinkingBox, setIsOpen, setTask, setWheelState, getPrevWheelState]);

    const approveSlidingBox = useCallback(async () => {
        // All data u need to run api
        // const action = task?.TYPE ?? false;
        // const source = task?.INFO?.source ?? false;
        // const targetPos = task?.INFO?.target ?? false;

        // const targetIndex = targetPos ? prevState.findIndex((itemVal) => itemVal.axelId === targetPos.axelId) : false;
        // const targetTyre = targetIndex ? prevState[targetIndex]['wheel_container'][targetPos.side][targetPos.position] : false;

        // console.log(action, source, targetPos, targetTyre)
        console.log(task);

        setShowLoader(true);
        await delay(1000); // Simulated API call or processing time

        closeSlidingBox(false);
        setShowLoader(false);
    }, [delay, closeSlidingBox, task]);

    const addNewTyre = useCallback((wheelId) => {
        const boxInfo = {
            axelId: task?.INFO[0],
            side: task?.INFO[1],
            position: task?.INFO[2]
        };

        setWheelState((prev) => {
            const currentState = prev.map((axel) => ({ ...axel }));
            const newIndex = currentState.findIndex((val) => val.axelId === boxInfo.axelId);

            if (newIndex === -1) return prev;

            currentState[newIndex] = {
                ...currentState[newIndex],
                wheel_container: {
                    ...currentState[newIndex].wheel_container,
                    [boxInfo.side]: {
                        ...currentState[newIndex].wheel_container[boxInfo.side],
                        [boxInfo.position]: wheelId
                    },
                },
            };

            return currentState;
        });

        setTyreLIst((prev) => prev.filter(
            (tyre) => (tyre.id != wheelId)
        ));

        closeSlidingBox(false);
    }, [task, setWheelState]);

    const renderTyreList = useMemo(() => (
        <ul className="tyre-list">
            {tyreList.map((item, index) => (
                <li key={`tr-${index}`}>
                    <div className="tyre-card">
                        <div className="tyre-info-cntr">
                            <div className="tyre-img">
                                <img src={WheelImage} width={40} height={40} alt="Wheel" />
                            </div>
                            <div className="tyre-info">
                                <h6>{item.id}</h6>
                                <p>{item.info}</p>
                            </div>
                        </div>
                        <div className="tyre-btn">
                            <button onClick={() => addNewTyre(item.id)}>
                                ADD
                            </button>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    ), [tyreList, addNewTyre]);

    const renderPopupContent = useMemo(() => {
        const popupContents = {
            'ADDTASK': (
                <>
                    <div>
                        <div className="popup-header">
                            <button onClick={() => closeSlidingBox()} className="close-btn">
                                X
                            </button>
                            <h4>Add New Tyre</h4>
                        </div>
                        <div className="popup-info">
                            <h6>Add new tyre for Axel {task?.INFO[0]} on side {task?.INFO[1]} at {task?.INFO[2]}</h6>
                            <input className="input-element" type="text" placeholder="Search" />
                            <h6 className="info-head">Tyre list</h6>
                        </div>
                    </div>
                    <div style={{ flexGrow: 1, overflow: "auto" }}>
                        {renderTyreList}
                    </div>
                </>
            ),
            'MOVETASK': (
                <>
                    <div>
                        <div className="popup-header">
                            <button onClick={() => closeSlidingBox()} className="close-btn">
                                X
                            </button>
                            <h4>Move Tyre</h4>
                        </div>
                        <div className="popup-info">
                            <h6 className="info-head">Fill and Confirm</h6>
                        </div>
                    </div>
                    <div style={{ flexGrow: 1, overflow: "auto" }}>
                        <div className="form-cntr">
                            <div>
                                <label>Field 1</label>
                                <input className="input-element" type="text" placeholder="Type Here" />
                            </div>
                            <div>
                                <label>Field 2</label>
                                <input className="input-element" type="text" placeholder="Type Here" />
                            </div>
                        </div>
                        <div className="action-button">
                            <button
                                className={showLoader ? "approve-btn disabled" : "approve-btn"}
                                onClick={approveSlidingBox}
                                disabled={showLoader}
                            >
                                {showLoader ? 'Loading...' : 'Approve'}
                            </button>
                            <button
                                className="cancel-btn"
                                onClick={() => closeSlidingBox()}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </>
            ),
            'RETURNTASK': (
                <>
                    <div>
                        <div className="popup-header">
                            <button onClick={() => closeSlidingBox()} className="close-btn">
                                X
                            </button>
                            <h4>Return Tyre</h4>
                        </div>
                        <div className="popup-info">
                            <h6 className="info-head">Fill and Confirm</h6>
                        </div>
                    </div>
                    <div style={{ flexGrow: 1, overflow: "auto" }}>
                        <div className="form-cntr">
                            <div>
                                <label>Field 1</label>
                                <input className="input-element" type="text" placeholder="Type Here" />
                            </div>
                            <div>
                                <label>Field 2</label>
                                <input className="input-element" type="text" placeholder="Type Here" />
                            </div>
                        </div>
                        <div className="action-button">
                            <button
                                className={showLoader ? "approve-btn disabled" : "approve-btn"}
                                onClick={approveSlidingBox}
                                disabled={showLoader}
                            >
                                {showLoader ? 'Loading...' : 'Approve'}
                            </button>
                            <button
                                className="cancel-btn"
                                onClick={() => closeSlidingBox()}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </>
            ),
            'WHEELDETAILS': (
                <>
                    <div>
                        <div className="popup-header">
                            <button onClick={() => closeSlidingBox()} className="close-btn">
                                X
                            </button>
                            <h4>Tyre: {task?.INFO?.source.wheelId}</h4>
                        </div>
                        <div className="popup-info">
                            <h6 className="info-head">Fill and Confirm</h6>
                        </div>
                    </div>
                    <div style={{ flexGrow: 1, overflow: "auto" }}>
                        <div className="form-cntr">
                            <div>
                                <label>Field 1</label>
                                <input className="input-element" type="text" placeholder="Type Here" />
                            </div>
                            <div>
                                <label>Field 2</label>
                                <input className="input-element" type="text" placeholder="Type Here" />
                            </div>
                        </div>
                        <div className="action-button">
                            <button
                                className={showLoader ? "approve-btn disabled" : "approve-btn"}
                                onClick={approveSlidingBox}
                                disabled={showLoader}
                            >
                                {showLoader ? 'Loading...' : 'Save'}
                            </button>
                            <button
                                className="cancel-btn"
                                onClick={() => closeSlidingBox()}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </>
            )
        };

        return popupContents[task?.TYPE];
    }, [task, showLoader, closeSlidingBox, approveSlidingBox, renderTyreList]);

    return (
        <div className="popup-mnu">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: isOpen ? 400 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="popup-motion"
            >
                {renderPopupContent}
            </motion.div>
        </div>
    );
};

export default React.memo(SlidingBox);