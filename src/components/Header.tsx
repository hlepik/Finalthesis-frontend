import { AppContext } from "../context/AppContext";
import {
  EventHandler,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Divider,
  Grid,
  Menu,
  MenuItem,
  MenuList,
  styled,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const Header = () => {
  const appState = useContext(AppContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  let role: string = "";
  const handleClose = () => {
    setAnchorEl(null);
  };
  const loadData = useCallback(async () => {
    let data = window.localStorage.getItem("state");

    console.log(data);
    if (data != null) {
      let state = JSON.parse(data);
      appState.setAuthInfo(
        state.token,
        state.firstName,
        state.lastName,
        state.id
      );
    }
  }, [appState]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (appState.token != null) {
    const info = JSON.parse(atob(appState.token!.split(".")[1]));
    role = info["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  }

  return (
    <Fragment>
      <div id="header">
        <Button
          id="demo-customized-button"
          aria-controls={open ? "demo-customized-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          variant="contained"
          disableElevation
          onClick={handleClick}
          endIcon={<KeyboardArrowDownIcon />}
        >
          Kategooriad
        </Button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={handleClose} disableRipple>
            <Link to={"/dresses"}>Kleidid</Link>
          </MenuItem>
          <MenuItem onClick={handleClose} disableRipple>
            Seelikud
          </MenuItem>
        </Menu>
        <Grid className="HeaderLinks">
          {appState.token != null ? (
            <>
              {role === "Admin" ? (
                <>
                  <Link to={"/role"}>Halda rolle</Link>
                  <Link to={"/appUser"}>Halda kasutajaid</Link>
                  <Link to={"/unit"}>Mõõtühikud</Link>
                  <Link to={"/category"}>Kategooriad</Link>
                  <Link to={"/instruction"}>Halda lõikeid</Link>
                  <Link to={"/andmed"}>Minu andmed</Link>
                </>
              ) : (
                <>
                  <Link to={"/andmed"}>Minu andmed</Link>
                </>
              )}
              <Link
                to={"/#"}
                onClick={() => appState.setAuthInfo(null, "", "", "")}
              >
                Logi välja
              </Link>
            </>
          ) : (
            <>
              <Link to={"/login"}>Logi sisse</Link>
              <Link to={"/register"}>Registreeri</Link>
            </>
          )}
        </Grid>
      </div>
    </Fragment>
  );
};

export default Header;
