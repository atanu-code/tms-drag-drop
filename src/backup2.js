import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { MultiBackend, TouchTransition } from "react-dnd-multi-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { motion } from "framer-motion";
import './App.css';

import WheelImage from './assets/truck-wheel.png';
import WheelTrash from './assets/inventory.png';
import AddButton from './assets/add-button.png';

const ItemTypes = {
  IMAGE: "image",
};

const DraggableImage = ({ axelId, side, position, wheelId }) => {
  const [clickTimeout, setClickTimeout] = useState(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.IMAGE,
    item: { axelId, side, position, wheelId }, // Sending multiple data attributes
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [axelId, side, position, wheelId]);

  // Handle single-click with delay to differentiate from double-click
  const handleClick = (axelId, side, position, wheelId) => {
    if (clickTimeout) return; // Ignore if already waiting for double-click

    const timeout = setTimeout(() => {
      console.log(`Single Click: ${wheelId}, axelId: ${axelId}, wheelContainerPosition: ${side} ${position}`);
      setClickTimeout(null); // Clear timeout after execution
    }, 300); // Delay to check for double click

    setClickTimeout(timeout);
  };

  // Handle double-click (fires immediately)
  const handleDoubleClick = (axelId, side, position, wheelId) => {
    clearTimeout(clickTimeout); // Cancel single-click if double-click happens
    setClickTimeout(null);
    console.log(`Double Click: ${wheelId}, axelId: ${axelId}, wheelContainerPosition: ${side} ${position}`);
  };

  return (
    <div
      ref={drag}
      alt={`Draggable ${wheelId}`}
      onClick={() => handleClick(axelId, side, position, wheelId)}
      onDoubleClick={() => handleDoubleClick(axelId, side, position, wheelId)}
      style={{
        opacity: isDragging ? 0.2 : 1,
      }}
      className="drag-cntr"
    >
      <img
        className="drag-img"
        src={WheelImage}
      />
      <span>{wheelId}</span>
    </div>
  );
};

const WheelContainer = ({ onDrop, wheel, setIsOpen, task, setTask }) => {
  const [blinking, setBlinking] = useState(false);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.IMAGE,
    drop: onDrop,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const AddTask = () => {
    setBlinking(true);
    setIsOpen(true);
    setTask({
      TYPE: 'ADDTASK',
      INFO: wheel
    })
  }

  useEffect(() => {
    if (task?.INFO[0] == wheel[0] && task?.INFO[1] == wheel[1] && task?.INFO[2] == wheel[2]) {

    }
    else
      setBlinking(false)
    return () => {

    };
  }, [task]);

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
        {wheel[3] ? (
          <DraggableImage
            axelId={wheel[0]}
            side={wheel[1]}
            position={wheel[2]}
            wheelId={wheel[3]}
          />
        ) : (
          <img className="add-btn" width={40} height={40} src={AddButton} onClick={() => AddTask()} />
        )}
      </div>
    </motion.div>
  );
};

const Inventory = ({ onDrop, wheelState }) => {
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
      </motion.div>
    </li>
  )
}

const Equipment = ({ equipmentObj, handleDrop, setIsOpen, task, setTask }) => {

  return (
    <>
      {equipmentObj.map((colItem, colIndex) => {
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
                  setIsOpen={setIsOpen}
                  task={task}
                  setTask={setTask}
                />
              ) : (
                <>
                  <WheelContainer
                    onDrop={(item) => handleDrop(colItem.axelId, item, 'L', 'OUT')}
                    wheel={[colItem.axelId, 'L', 'OUT', LOUT]}
                    setIsOpen={setIsOpen}
                    task={task}
                    setTask={setTask}
                  />
                  <WheelContainer
                    onDrop={(item) => handleDrop(colItem.axelId, item, 'L', 'IN')}
                    wheel={[colItem.axelId, 'L', 'IN', LIN]}
                    setIsOpen={setIsOpen}
                    task={task}
                    setTask={setTask}
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
                  setIsOpen={setIsOpen}
                  task={task}
                  setTask={setTask}
                />
              ) : (
                <>
                  <WheelContainer
                    onDrop={(item) => handleDrop(colItem.axelId, item, 'R', 'IN')}
                    wheel={[colItem.axelId, 'R', 'IN', RIN]}
                    setIsOpen={setIsOpen}
                    task={task}
                    setTask={setTask}
                  />
                  <WheelContainer
                    onDrop={(item) => handleDrop(colItem.axelId, item, 'R', 'OUT')}
                    wheel={[colItem.axelId, 'R', 'OUT', ROUT]}
                    setIsOpen={setIsOpen}
                    task={task}
                    setTask={setTask}
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

const SlidingBox = ({ isOpen, setIsOpen, task, setTask }) => {

  const [tyreList, setTyreList] = useState([
    {
      id: 566789,
      info: 'Lorem Ipsum is simply dummy text'
    },
    {
      id: 542552,
      info: 'Lorem Ipsum is simply dummy text'
    },
    {
      id: 927282,
      info: 'Lorem Ipsum is simply dummy text'
    },
    {
      id: 172628,
      info: 'Lorem Ipsum is simply dummy text'
    },
    {
      id: 928273,
      info: 'Lorem Ipsum is simply dummy text'
    },
    {
      id: 726272,
      info: 'Lorem Ipsum is simply dummy text'
    },
    {
      id: 922227,
      info: 'Lorem Ipsum is simply dummy text'
    },
    {
      id: 152423,
      info: 'Lorem Ipsum is simply dummy text'
    },
    {
      id: 762524,
      info: 'Lorem Ipsum is simply dummy text'
    },
    {
      id: 762524,
      info: 'Lorem Ipsum is simply dummy text'
    },
    {
      id: 883736,
      info: 'Lorem Ipsum is simply dummy text'
    },
    {
      id: 837733,
      info: 'Lorem Ipsum is simply dummy text'
    },
    {
      id: 181777,
      info: 'Lorem Ipsum is simply dummy text'
    },
    {
      id: 393882,
      info: 'Lorem Ipsum is simply dummy text'
    },
  ]);

  return (
    <div className="popup-mnu">

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: isOpen ? 400 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="popup-motion"
      >


        {task?.TYPE == 'ADDTASK' && (
          <>
            <div>
              <div className="popup-header">
                <button
                  onClick={() => {
                    setTask(null)
                    setIsOpen(!isOpen)
                  }}
                  className="close-btn"
                >
                  X
                </button>
                <h4>{task?.TYPE}</h4>
              </div>
              <div className="popup-info">
                <h6>Add new tyre for Axel {task?.INFO[0]} on side {task?.INFO[1]} at {task?.INFO[2]}</h6>
                <input className="input-search" type="text" placeholder="Search" />
                <h6 className="info-head">Tyre list</h6>
              </div>
            </div>

            <div style={{ flexGrow: 1, overflow: "auto" }}>
              <ul className="tyre-list">
                {tyreList.map((item, index) => (
                  <li key={'tr-' + index}>
                    <div className="tyre-card">
                      <div className="tyre-info-cntr">
                        <div className="tyre-img"><img src={WheelImage} width={40} height={40} /></div>
                        <div className="tyre-info">
                          <h6>{item.id}</h6>
                          <p>{item.info}</p>
                        </div>
                      </div>
                      <div className="tyre-btn">
                        <button
                          onClick={() => { }}
                        >
                          ADD</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};


const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [task, setTask] = useState(null);

  const [wheelState, setWheelState] = useState(
    [
      {
        'axelId': 1,
        'wheel_container': {
          'L': {
            'IN': false, //wheel id
            'OUT': false,
            'DEFAULT': 3001,
            'wheel_setup': 1
          },
          'R': {
            'IN': false,
            'OUT': false,
            'DEFAULT': 3002,
            'wheel_setup': 1
          }
        },
      },
      {
        'axelId': 2,
        'wheel_container': {
          'L': {
            'IN': false,
            'OUT': false,
            'DEFAULT': false,
            'wheel_setup': 2
          },
          'R': {
            'IN': 3003,
            'OUT': 3004,
            'DEFAULT': false,
            'wheel_setup': 2
          }
        },
      },
      {
        'axelId': 3,
        'wheel_container': {
          'L': {
            'IN': 3056,
            'OUT': 4023,
            'DEFAULT': false,
            'wheel_setup': 2
          },
          'R': {
            'IN': false,
            'OUT': false,
            'DEFAULT': false,
            'wheel_setup': 2
          }
        },
      }
    ]);

  const handleDrop = (axelId, item, side, position) => {
    console.log("Image dropped axelId " + axelId + " at " + position, item);

    setWheelState((prev) => {
      const currentState = prev.map((axel) => ({ ...axel }));

      const oldIndex = currentState.findIndex((itemVal) => itemVal.axelId === item.axelId);
      const newIndex = currentState.findIndex((itemVal) => itemVal.axelId === axelId);

      if (oldIndex === -1 || newIndex === -1) return prev;

      const newPositionWheelId = currentState[newIndex]?.wheel_container?.[side]?.[position];

      // Clone nested objects before updating
      currentState[oldIndex] = {
        ...currentState[oldIndex],
        wheel_container: {
          ...currentState[oldIndex].wheel_container,
          [item.side]: {
            ...currentState[oldIndex].wheel_container[item.side],
            [item.position]: newPositionWheelId,
          }
        }
      };

      currentState[newIndex] = {
        ...currentState[newIndex],
        wheel_container: {
          ...currentState[newIndex].wheel_container,
          [side]: {
            ...currentState[newIndex].wheel_container[side],
            [position]: item.wheelId
          }
        }
      };

      return currentState;
    });


  };
  const handleInvtDrop = (item) => {
    console.log("Invt Image dropped!", item);

    setWheelState((prev) => {
      const currentState = prev.map((axel) => ({ ...axel }));

      const oldIndex = currentState.findIndex((itemVal) => itemVal.axelId === item.axelId);

      if (oldIndex === -1) return prev;

      const newPositionWheelId = false

      // Clone nested objects before updating
      currentState[oldIndex] = {
        ...currentState[oldIndex],
        wheel_container: {
          ...currentState[oldIndex].wheel_container,
          [item.side]: {
            ...currentState[oldIndex].wheel_container[item.side],
            [item.position]: newPositionWheelId,
          }
        }
      };

      return currentState;
    });
  };

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
            <Inventory onDrop={(item) => handleInvtDrop(item)} wheelState={wheelState} />
          </ul>
        </div>
        <div className="container equipment">
          <Equipment
            equipmentObj={wheelState}
            handleDrop={handleDrop}
            setIsOpen={setIsOpen}
            task={task}
            setTask={setTask}
          />
        </div>

        <div className="eqpmnt-popup">
          <SlidingBox isOpen={isOpen} setIsOpen={setIsOpen} task={task} setTask={setTask} />
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
