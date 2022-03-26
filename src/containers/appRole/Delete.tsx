import {useCallback, useContext, useEffect, useState} from "react";
import {IAppRole} from "../../dto/IAppRole";
import { BaseService } from "../../service/base-service";
import {Link, useNavigate, useParams} from "react-router-dom";
import {AppContext} from "../../context/AppContext";


const AppRoleDelete = () => {

    //get the router params
    let { id } = useParams();
    const appState = useContext(AppContext);
    const [appRole, setAppRole] = useState({} as IAppRole);
    let navigate = useNavigate();

    const loadData = useCallback(async () => {
        console.log(id)

        let result = await BaseService.get<IAppRole>('/AppRole/' + id, appState.token!);


        if (result.ok && result.data) {
            setAppRole(result.data);
        }

    }, [appState, id])

    const deleteClicked = async (e: Event) => {

        e.preventDefault();
        let result = await BaseService.delete<IAppRole>('/AppRole/' + id, appState.token!);


        if (result.ok ) {
            navigate('/role');
        }

    }

    useEffect(() => {
        loadData();
    }, [loadData]);
    return (
        <div>
            <h4>Roll</h4>
            <hr />
            <dl className="row">
                <dt className="col-sm-2">Nimi</dt>

                <dd className="col-sm-10">
                    {appRole.name}
                </dd>

                <dt className="col-sm-2">Stamp</dt>

                <dd className="col-sm-10">
                    {appRole.concurrencyStamp}
                </dd>
                <hr />

                <div id="button">
                    <button onClick={(e) => deleteClicked(e.nativeEvent)} type="submit" className="btn btn-primary">Kustuta</button>
                    <p id='backToList'>
                        <Link to={'/role'}>Tagasi</Link>
                    </p>
                </div>

            </dl>

        </div >
    );
}

export default AppRoleDelete;
