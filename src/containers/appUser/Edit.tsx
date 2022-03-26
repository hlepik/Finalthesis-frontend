import { useNavigate, useParams } from "react-router-dom";
import { IRouteId } from "../../types/IRouteId";
import { EPageStatus } from "../../types/EPageStatus";
import { Link } from "react-router-dom";
import { IAppUser } from "../../dto/IAppUser";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import React, { useCallback } from "react";
import { BaseService } from "../../service/base-service";
import AlertComponent, { EAlertClass } from "../../components/AlertComponent";

const PictureEdit = () => {
  let { id } = useParams();
  const appState = useContext(AppContext);
  const [pageStatus, setPageStatus] = useState({
    pageStatus: EPageStatus.Loading,
    statusCode: -1,
  });
  const [editData, setAppUser] = useState({} as IAppUser);
  const [alertMessage, setAlertMessage] = useState("");
  let navigate = useNavigate();

  const loadData = useCallback(async () => {
    console.log(id);

    let result = await BaseService.get<IAppUser>(
      "/AppUser/" + id,
      appState.token!
    );

    if (result.ok && result.data) {
      setPageStatus({ pageStatus: EPageStatus.OK, statusCode: 0 });
      setAppUser(result.data);
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

    const url = "/AppUser/" + id;
    let response = await BaseService.edit(url, editData, appState.token!);

    console.log(response);
    if (response.statusCode >= 200 && response.statusCode < 400) {
      navigate("/appUser");
    } else {
      setAlertMessage(response.messages![0]);
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <>
      <h3>Kasutaja adnmete muutmine</h3>
      <form onSubmit={(e) => submitClicked(e.nativeEvent)}>
        <div className="row">
          <div className="col-md-6">
            <section>
              <hr />
              <AlertComponent
                show={alertMessage !== ""}
                message={alertMessage}
                type={EAlertClass.Danger}
                paddingSide={false}
              />
              <div className="form-group">
                <label>Eesnimi</label>
                <input
                  value={editData.firstname || ""}
                  onChange={(e) =>
                    setAppUser({ ...editData, firstname: e.target.value })
                  }
                  className="form-control"
                  type="text"
                  id="Input_Firstname"
                  name="Input.Firstname"
                  autoComplete="current-name"
                />
              </div>
              <div className="form-group">
                <label>Perekonnanimi</label>
                <input
                  value={editData.lastname || ""}
                  onChange={(e) =>
                    setAppUser({ ...editData, lastname: e.target.value })
                  }
                  className="form-control"
                  type="text"
                  id="Input_Lastname"
                  name="Input.Lastname"
                  autoComplete="current-name"
                />
              </div>
              <div className="form-group">
                <label>Kasutajanimi</label>
                <input
                  value={editData.username || ""}
                  onChange={(e) =>
                    setAppUser({ ...editData, username: e.target.value })
                  }
                  className="form-control"
                  type="text"
                  id="Input_Username"
                  name="Input.Username"
                  autoComplete="current-name"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  value={editData.email || ""}
                  onChange={(e) =>
                    setAppUser({ ...editData, email: e.target.value })
                  }
                  className="form-control"
                  type="text"
                  id="Input_Email"
                  name="Input.Email"
                  autoComplete="current-name"
                />
              </div>

              <div className="form-group form-check">
                <input
                  checked={editData.emailConfirmed}
                  onChange={(e) =>
                    setAppUser({
                      ...editData,
                      emailConfirmed: e.target.checked,
                    })
                  }
                  type="checkbox"
                  className="form-check-input"
                  id="EmailConf"
                />
                <label className="form-check-label" htmlFor="formInputCheckBox">
                  Email kinnitatud
                </label>
              </div>

              <div className="form-group">
                <label>Telefon</label>
                <input
                  value={editData.phoneNumber || ""}
                  onChange={(e) =>
                    setAppUser({ ...editData, phoneNumber: e.target.value })
                  }
                  className="form-control"
                  type="text"
                  id="Input_Phone"
                  name="Input.Phone"
                  autoComplete="current-name"
                />
              </div>
              <div className="form-group form-check">
                <input
                  checked={editData.phoneNumberConfirmed}
                  onChange={(e) =>
                    setAppUser({
                      ...editData,
                      phoneNumberConfirmed: e.target.checked,
                    })
                  }
                  type="checkbox"
                  className="form-check-input"
                  id="phoneConfirmed"
                />
                <label className="form-check-label" htmlFor="formInputCheckBox">
                  Email kinnitatud
                </label>
              </div>
              <div className="form-group form-check">
                <input
                  checked={editData.twoFactorEnabled}
                  onChange={(e) =>
                    setAppUser({
                      ...editData,
                      twoFactorEnabled: e.target.checked,
                    })
                  }
                  type="checkbox"
                  className="form-check-input"
                  id="formInputCheckBoxEnabled"
                />
                <label className="form-check-label" htmlFor="formInputCheckBox">
                  Kahepoolne autoriseerimine
                </label>
              </div>

              <div className="form-group">
                <label>Blokeeringu l]pp</label>
                <input
                  checked={editData.lockoutEnabled}
                  onChange={(e) =>
                    setAppUser({
                      ...editData,
                      lockoutEnabled: e.target.checked,
                    })
                  }
                  className="form-control"
                  type="checkbox"
                  id="Input_LEnabled"
                  name="Input.LEnabled"
                  autoComplete="current-name"
                />
              </div>
              <div className="form-group">
                <label>Eba]nnestunud logimise katseid</label>
                <input
                  value={editData.accessFailedCount || 0}
                  onChange={(e) =>
                    setAppUser({
                      ...editData,
                      accessFailedCount: e.target.valueAsNumber,
                    })
                  }
                  className="form-control"
                  type="number"
                  id="Input_Count"
                  name="Input.COunt"
                  autoComplete="current-name"
                />
              </div>

              <div className="form-group">
                <button
                  onClick={(e) => submitClicked(e.nativeEvent)}
                  type="submit"
                  className="btn btn-primary"
                >
                  Salvesta
                </button>
              </div>
              <p>
                <Link to={"/appUser"}>Tagasi</Link>
              </p>
            </section>
          </div>
        </div>
      </form>
    </>
  );
};

export default PictureEdit;
