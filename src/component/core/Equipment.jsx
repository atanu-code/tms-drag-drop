import React, { useContext } from "react";
import WheelContainer from "./WheelContainer";

import '../../App.css';
import { WheelContext } from "../../context/WheelContext";

const Equipment = () => {

    const { wheelState, handleDrop } = useContext(WheelContext);

    return (
        <>
            {wheelState.map((colItem, colIndex) => {
                const LIN = colItem?.wheel_container?.L?.IN ?? false;
                const LOUT = colItem?.wheel_container?.L?.OUT ?? false;
                const LDEFAULT = colItem?.wheel_container?.L?.DEFAULT ?? false;
                const RIN = colItem?.wheel_container?.R?.IN ?? false;
                const ROUT = colItem?.wheel_container?.R?.OUT ?? false;
                const RDEFAULT = colItem?.wheel_container?.R?.DEFAULT ?? false;

                const LSETUP = colItem?.wheel_container?.L?.wheel_setup ?? false;
                const RSETUP = colItem?.wheel_container?.R?.wheel_setup ?? false;

                return (
                    <div key={colIndex} className="row axel-row">
                        <div className="wheel-cntr wheel-cntr-left">
                            {LSETUP === 1 ? (
                                <WheelContainer
                                    onDrop={(item) => handleDrop(colItem.axelId, item, 'L', 'DEFAULT')}
                                    wheel={[colItem.axelId, 'L', 'DEFAULT', LDEFAULT]}
                                />
                            ) : (
                                <>
                                    <WheelContainer
                                        onDrop={(item) => handleDrop(colItem.axelId, item, 'L', 'OUT')}
                                        wheel={[colItem.axelId, 'L', 'OUT', LOUT]}
                                    />
                                    <WheelContainer
                                        onDrop={(item) => handleDrop(colItem.axelId, item, 'L', 'IN')}
                                        wheel={[colItem.axelId, 'L', 'IN', LIN]}
                                    />
                                </>
                            )}
                        </div>
                        <div className="axel-rod"></div>
                        <div className="wheel-cntr">
                            {RSETUP === 1 ? (
                                <WheelContainer
                                    onDrop={(item) => handleDrop(colItem.axelId, item, 'R', 'DEFAULT')}
                                    wheel={[colItem.axelId, 'R', 'DEFAULT', RDEFAULT]}
                                />
                            ) : (
                                <>
                                    <WheelContainer
                                        onDrop={(item) => handleDrop(colItem.axelId, item, 'R', 'IN')}
                                        wheel={[colItem.axelId, 'R', 'IN', RIN]}
                                    />
                                    <WheelContainer
                                        onDrop={(item) => handleDrop(colItem.axelId, item, 'R', 'OUT')}
                                        wheel={[colItem.axelId, 'R', 'OUT', ROUT]}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default Equipment;