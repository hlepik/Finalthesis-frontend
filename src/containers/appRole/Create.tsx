import {Link, useNavigate} from "react-router-dom";
import {Fragment, useContext, useEffect, useState} from "react";
import {IAppRole} from "../../dto/IAppRole";
import { BaseService } from "../../service/base-service";
import {AppContext} from "../../context/AppContext";


const AppRoleCreate = () => {

    const appState = useContext(AppContext);
    const [editData, setAppRole] = useState({} as IAppRole);
    const [alertMessage, setAlertMessage] = useState('');

    let navigate = useNavigate();

    const submitClicked = async (e: Event) => {

        e.preventDefault();

        setAlertMessage('');
        console.log(editData)

        const url = '/AppRole';
        let response = await BaseService.post(url, editData, appState.token!);

        console.log(response)
        if (response.statusCode >= 200 && response.statusCode < 400) {
            navigate('/role')
        } else {
            setAlertMessage('Error')
        }
    }

    useEffect(() => {

    }, []);

    return (
        <Fragment>
            <h2>Muuda</h2 >
            <form onSubmit={(e) => submitClicked(e.nativeEvent)}>
                {/*<div className="row">
                    <div className="col-md-6">
                        <section>
                            <hr />
                            <AlertComponent show={alertMessage !== ''} message={alertMessage} type={EAlertClass.Danger} />
                            <div className="form-group">
                                <label>Nimi</label>
                                <input value={editData.name} onChange={e => setAppRole({ ...editData, name: e.target.value })} className="form-control" type="text" id="Input_Name" name="Input.Name" autoComplete="current-name" />
                            </div>
                            <div className="form-group">
                                <label>Norm</label>
                                <input value={editData.normalizedName} onChange={e => setAppRole({ ...editData, normalizedName: e.target.value })} className="form-control" type="text" id="Input_NormName" name="Input.NormName" autoComplete="current-name" />
                            </div>
                            <div className="form-group">
                                <label>Stamp</label>
                                <input value={editData.concurrencyStamp} onChange={e => setAppRole({ ...editData, concurrencyStamp: e.target.value })} className="form-control" type="text" id="Input_Stamp" name="Input.Stamp" autoComplete="current-name" />
                            </div>

                            <div className="form-group">
                                <button onClick={(e) => submitClicked(e.nativeEvent)} type="submit" className="btn btn-primary">Salvesta</button>
                            </div>
                            <p>
                                <Link to={'/role'}>Tagasi</Link>
                            </p>
                        </section>
                    </div>
                </div>*/}
            </form>

        </Fragment>
    );
}

export default AppRoleCreate;
