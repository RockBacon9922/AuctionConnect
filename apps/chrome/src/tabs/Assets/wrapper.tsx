import { PersistGate } from "@plasmohq/redux-persist/integration/react";
import { persister, store } from "~store";
import { Provider } from "react-redux";

// Supports weights 100-900
import "@fontsource-variable/inter";

const Wrapper = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persister}>
        {children}
      </PersistGate>
    </Provider>
  );
};
export default Wrapper;

const Loading = () => {
  return <div>Loading...</div>;
};
