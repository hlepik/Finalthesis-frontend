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
import AppRoleEdit from "./containers/appRole/Edit";
import AppRoleCreate from "./containers/appRole/Create";
import AppRoleDelete from "./containers/appRole/Delete";
import AppRoleChange from "./containers/appRole/Change";
import AppRoleDetails from "./containers/appRole/Details";
import AppUserDetails from "./containers/appUser/Details";
import AppUserDelete from "./containers/appUser/Delete";
import AppUserIndex from "./containers/appUser/Index";
import AppUserEdit from "./containers/appUser/Edit";
import UnitIndex from "./containers/unit/Index";

import RegisterPage from "./containers/identity/RegisterPage";
import { ThemeProvider, StyledEngineProvider } from "@mui/material";
import { theme } from "./utils/theme";
import InstructionCreate from "./containers/instruction/Create";
import InstructionIndex from "./containers/instruction/Index";

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
                  path="/instruction/create"
                  element={<InstructionCreate />}
                />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/andmed" element={<UserPage />} />

                <Route path="/role/create" element={<AppRoleCreate />} />
                <Route path="/role/edit/:id" element={<AppRoleEdit />} />
                <Route path="/role/delete/:id" element={<AppRoleDelete />} />
                <Route path="/role/change/:id" element={<AppRoleChange />} />
                <Route path="/role/:id" element={<AppRoleDetails />} />
                <Route path="/role" element={<AppRoleIndex />} />

                <Route path="/appUser/edit/:id" element={<AppUserEdit />} />
                <Route path="/appUser/delete/:id" element={<AppUserDelete />} />
                <Route path="/appUser/:id" element={<AppUserDetails />} />
                <Route path="/appUser" element={<AppUserIndex />} />

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
