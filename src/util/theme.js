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
    },
    paper: {
      padding: 20
    },
    profile: {
      "& .image-wrapper": {
        textAlign: "center",
        position: "relative",
        "& button": {
          position: "absolute",
          top: "80%",
          left: "70%"
        }
      },
      "& .profile-image": {
        width: 200,
        height: 200,
        objectFit: "cover",
        maxWidth: "100%",
        borderRadius: "50%"
      },
      "& .profile-details": {
        textAlign: "center",
        "& span, svg": {
          verticalAlign: "middle"
        },
        "& a": {
          color: "#00bcd4"
        }
      },
      "& hr": {
        border: "none",
        margin: "0 0 10px 0"
      },
      "& svg.button": {
        "&:hover": {
          cursor: "pointer"
        }
      }
    },
    buttons: {
      textAlign: "center",
      "& a": {
        margin: "20px 10px"
      }
    },
    invisibleSeparator: {
      border: "none",
      margin: 4
    },
    visibleSeparator: {
      width: "100%",
      borderBottom: "1px solid rgba(0,0,0,0.1)",
      marginBottom: "20px"
    },
    noPosts: {
      fontSize: "1.5rem",
      textAlign: "center",
      color: "#444"
    }
  },
  skeleton: {
    card: {
      display: "flex",
      marginBottom: 20
    },
    cover: {
      minWidth: 200,
      objectFit: "cover"
    },
    cardContent: {
      width: "100%",
      flexDirection: "column",
      padding: 25
    },
    handle: {
      width: 60,
      height: 18,
      backgroundColor: "#00bcd4",
      marginBottom: 7
    },
    date: {
      height: 14,
      width: 100,
      backgroundColor: "rgba(0,0,0,0.3)",
      marginBottom: 10
    },
    fullLine: {
      height: 15,
      width: "90%",
      marginBottom: 10,
      backgroundColor: "rgba(0,0,0,0.6)"
    },
    halfLine: {
      height: 15,
      width: "50%",
      marginBottom: 10,
      backgroundColor: "rgba(0,0,0,0.6)"
    }
  }
};
