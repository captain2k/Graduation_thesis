import RouterComponent from "@/routers/index";
import { store } from "@/store/index";
import { Provider } from "react-redux";
import "@/assets/styles/index.css";

function App() {
  return (
    <div className="root_component">
      <Provider store={store}>
        <RouterComponent />
      </Provider>
    </div>
  );
}

export default App;
