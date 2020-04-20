import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import themeBase from "./util/theme";

// Components
import Navbar from "./components/layout/navbar";
import AuthRoute from "./util/authRoute";

// Pages
import Home from "./pages/home";
import Signup from "./pages/signup";
import Login from "./pages/login";
import User from "./pages/user";

const theme = createMuiTheme(themeBase);

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <div className="container">
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/users/:handle" component={User} exact />
            <Route path="/users/:handle/post/:postId" component={User} exact />
            <AuthRoute path="/login" component={Login} exact />
            <AuthRoute path="/signup" component={Signup} exact />
          </Switch>
        </div>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
