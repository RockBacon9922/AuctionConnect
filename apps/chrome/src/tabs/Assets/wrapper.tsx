import { PersistGate } from "@plasmohq/redux-persist/integration/react";
import { persister, store } from "~store";
import { Provider } from "react-redux";

const Wrapper = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persister}>{children}</PersistGate>
    </Provider>
  );
};
export default Wrapper;
