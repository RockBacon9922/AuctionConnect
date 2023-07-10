import { PersistGate } from "@plasmohq/redux-persist/integration/react";
import { persistor, store } from "~store";
import { Provider } from "react-redux";

const Wrapper = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>{children}</PersistGate>
    </Provider>
  );
};
export default Wrapper;
