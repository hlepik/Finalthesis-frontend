import { Link, useNavigate, useParams } from "react-router-dom";
import AlertComponent, { EAlertClass } from "../../components/AlertComponent";
import { useCallback, useContext, useEffect, useState } from "react";
import { BaseService } from "../../service/base-service";
import { EPageStatus } from "../../types/EPageStatus";
import { IAppRole } from "../../dto/IAppRole";
import { AppContext } from "../../context/AppContext";

const AppRoleEdit = () => {
  let { id } = useParams();
  const appState = useContext(AppContext);
  const [pageStatus, setPageStatus] = useState({
    pageStatus: EPageStatus.Loading,
    statusCode: -1,
  });
  const [editData, setAppRole] = useState({} as IAppRole);
  const [alertMessage, setAlertMessage] = useState("");
  let navigate = useNavigate();

  const loadData = useCallback(async () => {
    let result = await BaseService.get<IAppRole>(
      "/AppRole/" + id,
      appState.token!
    );
    if (result.ok && result.data) {
      setPageStatus({ pageStatus: EPageStatus.OK, statusCode: 0 });
      setAppRole(result.data);
    } else {
      setPageStatus({
        pageStatus: EPageStatus.Error,
        statusCode: result.statusCode,
      });
    }
  }, [appState, id]);
  const submitClicked = async (e: Event) => {
    e.preventDefault();

    setAlertMessage("");
    console.log(editData);

    const url = "/AppRole/" + id;
    let response = await BaseService.edit(url, editData, appState.token!);

    console.log(response);
    if (response.statusCode >= 200 && response.statusCode < 400) {
      navigate("/appRole");
    } else {
      setAlertMessage(response.messages![0]);
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <>
      <h2>Muuda</h2>
      <h3>Roll</h3>
      <form onSubmit={(e) => submitClicked(e.nativeEvent)}>
        <div className="row">
          <div className="col-md-6">
            <section>
              <hr />
              <AlertComponent
                message={alertMessage}
                show={alertMessage !== ""}
                type={EAlertClass.Danger}
                paddingSide={false}
              />
              <div className="form-group">
                <label>Rolli nimetus</label>
                <input
                  value={editData.name || ""}
                  onChange={(e) =>
                    setAppRole({ ...editData, name: e.target.value })
                  }
                  type="text"
                  id="Input_Name"
                  name="Input.Name"
                  autoComplete="current-name"
                />
              </div>
              <div className="form-group">
                <label>Norm name</label>
                <input
                  value={editData.normalizedName || ""}
                  onChange={(e) =>
                    setAppRole({ ...editData, normalizedName: e.target.value })
                  }
                  type="text"
                  id="Input_NormName"
                  name="Input.NormName"
                  autoComplete="current-name"
                />
              </div>
              <div>
                <label>COn</label>
                <input
                  value={editData.concurrencyStamp || ""}
                  onChange={(e) =>
                    setAppRole({
                      ...editData,
                      concurrencyStamp: e.target.value,
                    })
                  }
                  type="text"
                  id="Input_Stamp"
                  name="Input.Stamp"
                  autoComplete="current-name"
                />
              </div>

              <div>
                <button
                  onClick={(e) => submitClicked(e.nativeEvent)}
                  type="submit"
                >
                  Salvesta
                </button>
              </div>
              <p>
                <Link to={"/appRole"}>Tagasi</Link>
              </p>
            </section>
          </div>
        </div>
      </form>
    </>
  );
};

export default AppRoleEdit;
