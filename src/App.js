import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import themeBase from "./util/theme";
import jwtDecode from "jwt-decode";

// Components
import Navbar from "./components/navbar";
import AuthRoute from "./util/authRoute";

// Pages
import Home from "./pages/home";
import Signup from "./pages/signup";
import Login from "./pages/login";

const theme = createMuiTheme(themeBase);

let authenticated;
const token = localStorage.authToken;
if (token) {
  const decodedToken = jwtDecode(token);
  console.log(decodedToken);
  if (decodedToken.exp * 1000 < Date.now()) {
    authenticated = false;
    window.location.href = "/login";
  } else {
    authenticated = true;
  }
}

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <div className="container">
          <Switch>
            <Route path="/" component={Home} exact />
            <AuthRoute
              path="/login"
              component={Login}
              exact
              authenticated={authenticated}
            />
            <AuthRoute
              path="/signup"
              component={Signup}
              exact
              authenticated={authenticated}
            />
          </Switch>
        </div>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
