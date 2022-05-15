import { AppContext } from "../context/AppContext";
import { EventHandler, Fragment, useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Fade, Grid, Menu, MenuItem, styled } from "@mui/material";
import BasicButton from "./BasicButton";
const StyledImage = styled(Grid)({
    height: "80px",
    width: "140px",
    left: "0px",
    marginTop: "1rem",
});
const LinkGrid = styled(Grid)({
    display: "flex",
    flexDirection: "row",
    marginTop: "3.5rem",
    width: "100%",
    paddingRight: "3rem",
    justifyContent: "center",
});
const StyledBasicButton = styled(BasicButton, {
    shouldForwardProp: (prop) => prop !== "clicked",
})<{ clicked: boolean }>(({ clicked }) => ({
    fontSize: "1.2rem",
    textDecoration: clicked ? "underline" : "none",
    "&:hover": {
        textDecoration: clicked ? "underline" : "none",
    },
}));

const Header = () => {
    const appState = useContext(AppContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [secAnchorEl, setSecAnchorEl] = useState(null);
    const navigate = useNavigate();
    const open = Boolean(anchorEl);
    const openSecMenu = Boolean(secAnchorEl);
    const pathname = window.location.pathname;
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleSecClick = (event: any) => {
        setSecAnchorEl(event.currentTarget);
    };
    let role: string = "";
    const handleClose = () => {
        setAnchorEl(null);
        setSecAnchorEl(null);
    };

    const loadData = useCallback(async () => {
        let data = window.localStorage.getItem("state");
        window.localStorage.clear();
        if (data !== null) {
            let state = JSON.parse(data);
            appState.setAuthInfo(state.token, state.firstName, state.lastName, state.id);
        }
    }, [appState]);

    useEffect(() => {
        loadData();
        window.onbeforeunload = function () {
            window.localStorage.setItem("state", JSON.stringify(appState));
            return true;
        };
        return () => {
            window.onbeforeunload = null;
        };
    }, [loadData]);

    if (appState.token !== null) {
        const info = JSON.parse(atob(appState.token!.split(".")[1]));
        role = info["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    }

    return (
        <Fragment>
            <div id="header">
                <Grid className="HeaderLinks">
                    <Link to={"/"}>
                        <StyledImage>
                            <img src={"/images/logo.png"} />
                        </StyledImage>
                    </Link>
                    <LinkGrid>
                        <StyledBasicButton
                            clicked={pathname === "/aboutUs"}
                            btnType={"transparent"}
                            label={"Meist"}
                            onClick={() => navigate("/aboutUs")}
                        />
                        <StyledBasicButton
                            clicked={pathname === "/patterns"}
                            btnType={"transparent"}
                            label={"Lõiked"}
                            onClick={() => navigate("/patterns")}
                        />

                        {appState.token != null ? (
                            <>
                                {role === "Admin" ? (
                                    <>
                                        <StyledBasicButton
                                            clicked={pathname === "/role" || pathname === "/appUser"}
                                            btnType={"transparent"}
                                            label={"kasutajad"}
                                            onClick={handleClick}
                                        />

                                        <Menu
                                            id="fade-menu"
                                            MenuListProps={{
                                                "aria-labelledby": "fade-button",
                                            }}
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleClose}
                                            TransitionComponent={Fade}
                                        >
                                            <MenuItem>
                                                <Link to={"/role"}>HALDA ROLLE</Link>
                                            </MenuItem>
                                            <MenuItem>
                                                <Link to={"/appUser"}>HALDA KASUTAJAID</Link>
                                            </MenuItem>
                                        </Menu>
                                        <StyledBasicButton
                                            clicked={
                                                pathname === "/unit" ||
                                                pathname === "/measurementType" ||
                                                pathname === "/category" ||
                                                pathname === "/instruction"
                                            }
                                            btnType={"transparent"}
                                            label={"Lõike komponendid"}
                                            onClick={handleSecClick}
                                        />

                                        <Menu
                                            id="fade-menu"
                                            MenuListProps={{
                                                "aria-labelledby": "fade-button",
                                            }}
                                            anchorEl={secAnchorEl}
                                            open={openSecMenu}
                                            onClose={handleClose}
                                            TransitionComponent={Fade}
                                        >
                                            <MenuItem>
                                                <Link to={"/unit"}>MÕÕTÜHIKUD</Link>
                                            </MenuItem>
                                            <MenuItem>
                                                <Link to={"/measurementType"}>KEHAMÕÕDUD</Link>
                                            </MenuItem>
                                            <MenuItem>
                                                <Link to={"/category"}>KATEGOORIAD</Link>
                                            </MenuItem>
                                            <MenuItem>
                                                <Link to={"/instruction"}>HALDA LÕIKEID</Link>
                                            </MenuItem>
                                        </Menu>
                                        <StyledBasicButton
                                            clicked={pathname === "/andmed"}
                                            btnType={"transparent"}
                                            label={"Minu andmed"}
                                            onClick={() => navigate("/andmed")}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <StyledBasicButton
                                            clicked={pathname === "/userPattern"}
                                            btnType={"transparent"}
                                            label={"Minu lõiked"}
                                            onClick={() => navigate("/userPattern")}
                                        />
                                        <StyledBasicButton
                                            clicked={pathname === "/andmed"}
                                            btnType={"transparent"}
                                            label={"Minu andmed"}
                                            onClick={() => navigate("/andmed")}
                                        />
                                    </>
                                )}

                                <StyledBasicButton
                                    clicked={false}
                                    btnType={"transparent"}
                                    label={"Logi välja"}
                                    onClick={() => {
                                        navigate("/#");
                                        appState.setAuthInfo(null, "", "", "");
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                <StyledBasicButton
                                    clicked={pathname === "/login"}
                                    btnType={"transparent"}
                                    label={"Logi sisse"}
                                    onClick={() => navigate("/login")}
                                />
                                <StyledBasicButton
                                    clicked={pathname === "/register"}
                                    btnType={"transparent"}
                                    label={"Registreeri"}
                                    onClick={() => navigate("/register")}
                                />
                            </>
                        )}
                    </LinkGrid>
                </Grid>
            </div>
        </Fragment>
    );
};

export default Header;
