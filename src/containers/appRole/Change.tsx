import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { IAppRole } from "../../dto/IAppRole";
import { IAppUser } from "../../dto/IAppUser";
import { BaseService } from "../../service/base-service";
import AlertComponent, { EAlertClass } from "../../components/AlertComponent";

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
    <>
      <form onSubmit={(e) => submitClicked(e.nativeEvent)}>
        <h2 className="bg-info p-1 text-white">Lisa {role.name}</h2>
        <table className="table table-bordered table-sm">
          <AlertComponent
            show={alertMessage !== ""}
            message={alertMessage}
            type={EAlertClass.Danger}
            paddingSide={false}
          />

          <>
            {nonMemberData.map((user) => (
              <tr>
                <td>{user.email}</td>

                <td>
                  <input
                    type="checkbox"
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
                </td>
              </tr>
            ))}
          </>
        </table>

        <h2 className="bg-info p-1 text-white">Eemalda {role.name}</h2>
        <table className="table table-bordered table-sm">
          <>
            {memberData.map((user) => (
              <tr>
                <td>{user.email}</td>
                <td>
                  <input
                    type="checkbox"
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
                </td>
              </tr>
            ))}
          </>
        </table>
        <button type="submit" className="btn btn-primary">
          Salvesta
        </button>
      </form>
    </>
  );
};

export default AppRoleChange;
