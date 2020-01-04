// TODO: Play around with this
export default {
  palette: {
    primary: {
      light: "#33c9dc",
      main: "#00bcd4",
      dark: "#009394",
      contrastText: "#fff"
    },
    secondary: {
      light: "#ff6333",
      main: "#ff3d00",
      dark: "#b22a00",
      contrastText: "#fff"
    }
  },
  typography: { useNextVariants: true },

  custom: {
    form: {
      textAlign: "center"
    },
    image: {
      margin: "20px auto",
      maxWidth: "100px"
    },
    pageTitle: {
      margin: "10px auto"
    },
    textField: {
      margin: "10px auto"
    },
    button: {
      marginTop: 20,
      position: "relative"
    },
    customError: {
      color: "#f44235",
      fontSize: "0.8rem",
      marginTop: 10
    },
    progress: {
      position: "absolute"
    }
  }
};
