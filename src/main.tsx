import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
  ThemeProvider,
  CssBaseline,
  StyledEngineProvider,
  createTheme,
} from "@mui/material";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { RidesProvider } from "./context/RidesContext";

const theme = createTheme({
  direction: "rtl",
  palette: {
    primary: {
      main: "#1565c0", // כחול עסקי
    },
    success: {
      main: "#2e7d32", // ירוק לאישורים
    },
    background: {
      default: "#f5f7fb",
    },
  },
  typography: {
    fontFamily: `'Heebo', 'Alef', 'Roboto', sans-serif`,
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <RidesProvider>
              <App />
            </RidesProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);
