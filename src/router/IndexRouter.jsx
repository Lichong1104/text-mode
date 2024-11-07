import React, { Suspense } from "react";
import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { isLogin } from "../utils/handleToken";
import PageLoading from "@/components/PageLoading/PageLoading";

const Login = React.lazy(() => import("../views/Login/Login"));
const Registered = React.lazy(() => import("../views/Registered/Registered"));
const Layouts = React.lazy(() => import("../layouts/Layouts"));

function IndexRouter() {
  return (
    <Router>
      <Suspense fallback={<PageLoading height="100vh" />}>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/registered" component={Registered} />
          <Route path="/" render={() => (isLogin() ? <Layouts /> : <Redirect to="/login" />)} />
          {/* <Route path="/" render={() => <Layouts />} /> */}
        </Switch>
      </Suspense>
    </Router>
  );
}

export default IndexRouter;
