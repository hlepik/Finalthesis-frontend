import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { IAppRole } from "../../dto/IAppRole";
import { IAppUser } from "../../dto/IAppUser";
import { BaseService } from "../../service/base-service";
import AlertComponent, { EAlertClass } from "../../components/AlertComponent";
import BasicButton from "../../components/BasicButton";
import {
  Checkbox,
  Grid,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";

const StyledText = styled(Typography)({
  fontWeight: 600,
  marginTop: "2rem",
  marginLeft: "1rem",
});
const StyledBasicButton = styled(BasicButton)({
  marginTop: "2rem",
});
const AppRoleChange = () => {
  let { id } = useParams();
  const appState = useContext(AppContext);
  const [role, setAppRole] = useState({} as IAppRole);
  const [alertMessage, setAlertMessage] = useState("");
  const [memberData, setAppUserMember] = useState([] as IAppUser[]);
  const [nonMemberData, setAppUserNonMember] = useState([] as IAppUser[]);
  const [userData, setUser] = useState({ id: "", name: "" });
  const [nonRoleData, setOutOfRole] = useState({ id: "", name: "" });
  let navigate = useNavigate();

  const loadData = useCallback(async () => {
    let appResult = await BaseService.get<IAppRole>(
      "/AppRole/" + id,
      appState.token!
    );

    if (appResult.ok && appResult.data) {
      setAppRole(appResult.data);
    }

    let result = await BaseService.getAll<IAppUser>(
      "/AppRole/Members/" + id,
      appState.token!
    );

    console.log(result);
    if (result.ok && result.data) {
      setAppUserMember(result.data);
    }
    let nonResult = await BaseService.getAll<IAppUser>(
      "/AppRole/NonMembers/" + id,
      appState.token!
    );

    if (nonResult.ok && nonResult.data) {
      setAppUserNonMember(nonResult.data);
    }
  }, [appState, id]);

  const submitClicked = async (e: Event) => {
    e.preventDefault();

    setAlertMessage("");

    console.log(nonRoleData);
    console.log(userData);

    if (userData.id !== "") {
      const url = "/AppRole/AddUsersToRole";
      let response = await BaseService.edit(url, userData, appState.token!);

      console.log(response);
      if (response.statusCode >= 200 && response.statusCode < 400) {
      } else {
        setAlertMessage("Error");
      }
    }
    if (nonRoleData.id !== "") {
      const url = "/AppRole/Remove/UsersFromRole";
      let response = await BaseService.edit(url, nonRoleData, appState.token!);

      console.log(response);
      if (response.statusCode >= 200 && response.statusCode < 400) {
      } else {
        setAlertMessage("Error");
      }
    }
    navigate("/role");
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Grid container className={"layoutContainer"}>
      <form onSubmit={(e) => submitClicked(e.nativeEvent)}>
        <StyledText variant={"h4"}>Lisa {role.name}</StyledText>
        <AlertComponent
          show={alertMessage !== ""}
          message={alertMessage}
          type={EAlertClass.Danger}
          paddingSide={false}
        />
        <TableContainer>
          <Table>
            <TableBody>
              {nonMemberData.map((user) => (
                <TableRow>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Checkbox
                      name="NonMembersIds"
                      value={user.id}
                      onChange={(e) =>
                        setUser({
                          ...userData,
                          id: e.target.value,
                          name: role.name,
                        })
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <StyledText variant={"h4"}>Eemalda {role.name}</StyledText>
        <TableContainer>
          <Table>
            <TableBody>
              {memberData.map((user) => (
                <TableRow>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Checkbox
                      name="MembersIds"
                      value={user.id}
                      onChange={(e) =>
                        setOutOfRole({
                          ...nonRoleData,
                          id: e.target.value,
                          name: role.name,
                        })
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <StyledBasicButton
          btnType={"black"}
          label={"Salvesta"}
          type={"submit"}
        />
      </form>
    </Grid>
  );
};

export default AppRoleChange;
