import React from "react";
import IndexRouter from "./router/IndexRouter";

// redux
import { Provider } from "react-redux";
import { store } from "./redux/store";

import "@aws-amplify/ui-react/styles.css";

// nprogress
import "nprogress/nprogress.css";
import NProgress from "nprogress";
import { ConfigProvider } from "antd";
import globalColor from "./store/color";
NProgress.configure({ minimum: 0.2, easing: "ease", speed: 500 });

const themeStyle = {
  // colorPrimary: "#8315F9",
  colorPrimary: globalColor.buttonColor,
  borderRadius: 8,
  controlHeight: 36,
};

function App() {
  return (
    <ConfigProvider theme={{ token: themeStyle }}>
      {" "}
      <Provider store={store}>
        <IndexRouter />
      </Provider>
    </ConfigProvider>
  );
}

export default App;
