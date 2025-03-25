import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";

export const WheelContext = createContext();

export const WheelProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [task, setTask] = useState(null);
    const [blinkingBox, setBlinkingBox] = useState([]);
    const [wheelState, setWheelState] = useState([
        {
            axelId: 1,
            wheel_container: {
                L: { IN: false, OUT: false, DEFAULT: 3001, wheel_setup: 1 },
                R: { IN: false, OUT: false, DEFAULT: 3002, wheel_setup: 1 },
            },
        },
        {
            axelId: 2,
            wheel_container: {
                L: { IN: false, OUT: false, DEFAULT: false, wheel_setup: 2 },
                R: { IN: 3003, OUT: 3004, DEFAULT: false, wheel_setup: 2 },
            },
        },
        {
            axelId: 3,
            wheel_container: {
                L: { IN: 3056, OUT: 4023, DEFAULT: false, wheel_setup: 2 },
                R: { IN: false, OUT: false, DEFAULT: false, wheel_setup: 2 },
            },
        },
    ]);

    // Store previous state
    const prevWheelState = useRef(wheelState);

    useEffect(() => {
        // Save the previous wheelState before it updates
        return () => {
            prevWheelState.current = wheelState;
        };
    }, [wheelState]);

    const getPrevWheelState = () => {
        return prevWheelState.current;
    };

    const handleDrop = useCallback((axelId, item, side, position) => {

        // const newIndex = wheelState.findIndex((itemVal) => itemVal.axelId === axelId);

        // console.log(wheelState, newIndex, axelId, item, side, position, wheelState[newIndex]['wheel_container'][side][position], 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbb')

        setIsOpen(true);
        setTask({
            // TYPE: (wheelState[newIndex]['wheel_container'][side][position]) ? 'SWAPTASK' : 'MOVETASK',
            TYPE: 'MOVETASK',
            INFO: {
                source: item,
                target: {
                    axelId: axelId,
                    side: side,
                    position: position
                }
            }
        })
        addBlinkingBox({
            axelId: item.axelId,
            side: item.side,
            position: item.position
        });
        addBlinkingBox({
            axelId: axelId,
            side: side,
            position: position
        });

        setWheelState((prev) => {
            const currentState = prev.map((axel) => ({ ...axel }));

            const oldIndex = currentState.findIndex((val) => val.axelId === item.axelId);
            const newIndex = currentState.findIndex((val) => val.axelId === axelId);

            if (oldIndex === -1 || newIndex === -1) return prev;

            const newPositionWheelId = currentState[newIndex]?.wheel_container?.[side]?.[position];

            currentState[oldIndex] = {
                ...currentState[oldIndex],
                wheel_container: {
                    ...currentState[oldIndex].wheel_container,
                    [item.side]: { ...currentState[oldIndex].wheel_container[item.side], [item.position]: newPositionWheelId },
                },
            };

            currentState[newIndex] = {
                ...currentState[newIndex],
                wheel_container: {
                    ...currentState[newIndex].wheel_container,
                    [side]: { ...currentState[newIndex].wheel_container[side], [position]: item.wheelId },
                },
            };

            return currentState;
        });

    }, []);

    const handleInvtDrop = useCallback((item) => {
        setIsOpen(true);
        setTask({
            TYPE: 'RETURNTASK',
            INFO: {
                source: item,
                target: 'INVENTORY'
            }
        })
        addBlinkingBox({
            axelId: item.axelId,
            side: item.side,
            position: item.position
        });


        setWheelState((prev) => {
            const currentState = prev.map((axel) => ({ ...axel }));

            const oldIndex = currentState.findIndex((val) => val.axelId === item.axelId);
            if (oldIndex === -1) return prev;

            currentState[oldIndex] = {
                ...currentState[oldIndex],
                wheel_container: {
                    ...currentState[oldIndex].wheel_container,
                    [item.side]: { ...currentState[oldIndex].wheel_container[item.side], [item.position]: false },
                },
            };

            return currentState;
        });
    }, []);

    const addBlinkingBox = useCallback((newBox) => {
        setBlinkingBox((prev) => [...prev, newBox]);
    }, []);

    const removeBlinkingBox = useCallback((boxToRemove) => {
        setBlinkingBox((prev) => prev.filter(
            (box) =>
                !(box.axelId === boxToRemove.axelId &&
                    box.side === boxToRemove.side &&
                    box.position === boxToRemove.position)
        ));
    }, []);

    const existsBlinkingBox = useCallback((box) => {
        return blinkingBox.some(
            (b) =>
                b.axelId === box.axelId &&
                b.side === box.side &&
                b.position === box.position
        );
    }, [blinkingBox]);

    const contextValue = useMemo(() => ({
        isOpen,
        wheelState,
        task,
        blinkingBox,
        setIsOpen,
        setTask,
        setWheelState,
        handleDrop,
        handleInvtDrop,
        setBlinkingBox,
        addBlinkingBox,
        removeBlinkingBox,
        existsBlinkingBox,
        getPrevWheelState
    }), [
        isOpen,
        wheelState,
        task,
        blinkingBox,
        handleDrop,
        handleInvtDrop,
        addBlinkingBox,
        removeBlinkingBox,
        existsBlinkingBox,
        getPrevWheelState
    ]);

    return (
        <WheelContext.Provider value={contextValue}>
            {children}
        </WheelContext.Provider>
    );
};
