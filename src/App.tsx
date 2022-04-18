import { useState } from "react";
import { AppContextProvider, initialAppState } from "./context/AppContext";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import LoginPage from "./containers/identity/LoginPage";

import CategoryIndex from "./containers/category/Index";
import UserPage from "./containers/user/UserPage";
import HomePage from "./containers/HomePage";
import AppRoleIndex from "./containers/appRole/Index";
import AppRoleChange from "./containers/appRole/Change";
import AppUserIndex from "./containers/appUser/Index";
import UnitIndex from "./containers/unit/Index";

import RegisterPage from "./containers/identity/RegisterPage";
import { ThemeProvider, StyledEngineProvider } from "@mui/material";
import { theme } from "./utils/theme";
import InstructionCreate from "./containers/instruction/Create";
import InstructionIndex from "./containers/instruction/Index";
import MeasurementTypeIndex from "./containers/measurementType/Index";
import UserPatternIndex from "./containers/userPattern/Index";
import PatternIndex from "./containers/patterns/Index";
import UserPatternDetail from "./containers/userPattern/Detail";
import AboutUs from "./containers/AboutUs";

function App() {
  const setAuthInfo = (
    token: string | null,
    firstName: string,
    lastName: string,
    id: string
  ): void => {
    setAppState({ ...appState, token, firstName, lastName, id });
  };
  const [appState, setAppState] = useState({ ...initialAppState, setAuthInfo });

  return (
    <StyledEngineProvider>
      <ThemeProvider theme={theme}>
        <AppContextProvider value={appState}>
          <Header />
          <div className="MainPage">
            <div className="PageContainer">
              <Routes>
                <Route path="/category" element={<CategoryIndex />} />
                <Route path="/instruction" element={<InstructionIndex />} />
                <Route
                  path="/instruction/create/:id"
                  element={<InstructionCreate />}
                />
                <Route
                  path="/instruction/create/new"
                  element={<InstructionCreate />}
                />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/andmed" element={<UserPage />} />

                <Route path="/role/change/:id" element={<AppRoleChange />} />
                <Route path="/role" element={<AppRoleIndex />} />

                <Route path="/appUser" element={<AppUserIndex />} />
                <Route path="/aboutUs" element={<AboutUs />} />

                <Route
                  path="/measurementType"
                  element={<MeasurementTypeIndex />}
                />
                <Route
                  path="/userPattern/:id"
                  element={<UserPatternDetail />}
                />

                <Route path="/userPattern" element={<UserPatternIndex />} />
                <Route path="/patterns" element={<PatternIndex />} />

                <Route path="/unit" element={<UnitIndex />} />

                <Route path="/" element={<HomePage />} />
              </Routes>
            </div>
          </div>
          <Footer />
        </AppContextProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
