import { WheelProvider } from "./context/WheelContext";
import MainApp from "./MainApp";


const App = () => {
  return (
    <WheelProvider>
      <MainApp />
    </WheelProvider>
  );
};

export default App;
