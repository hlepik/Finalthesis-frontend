import { createTheme, Theme } from "@mui/material";
import { COLOR_BLACK } from "./constants";

export const theme: Theme = createTheme({
  typography: {
    fontFamily: "Montserrat",
    h1: {
      color: "black",
      fontSize: "3rem",
      lineHeight: "3rem",
    },
    h2: {
      color: "white",
      fontSize: "2rem",
      lineHeight: "3rem",
    },

    h3: {
      color: COLOR_BLACK,
      fontSize: "2.5rem",
      lineHeight: "2rem",
      marginBottom: "10px",
    },
    h4: {
      color: COLOR_BLACK,
      fontSize: "1.5rem",
      lineHeight: "1.5rem",
      marginBottom: "2rem",
    },
    h5: {
      color: COLOR_BLACK,
      fontSize: "1.5rem",
      lineHeight: "1.5rem",
      fontWeight: 700,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: "bold",
      marginBottom: "4px",
    },
    body2: {
      fontSize: "1rem",
      marginBottom: "4px",
    },
  },
});
