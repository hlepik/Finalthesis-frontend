import {useNavigate, useParams} from "react-router-dom";
import { EPageStatus } from "../../types/EPageStatus";
import { Link } from "react-router-dom";
import { IAppUser } from "../../dto/IAppUser";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import React, { useCallback } from 'react';
import {BaseService} from "../../service/base-service";



const AppUserDelete = () => {

    //get the router params
    let { id } = useParams();
    const appState = useContext(AppContext);
    const [pageStatus, setPageStatus] = useState({ pageStatus: EPageStatus.Loading, statusCode: -1 });
    const [appUser, setAppUser] = useState({} as IAppUser);
    let navigate = useNavigate();

    const loadData = useCallback(async () => {
        console.log(id)

        let result = await BaseService.get<IAppUser>('/AppUser/' + id, appState.token!);


        if (result.ok && result.data) {
            setPageStatus({ pageStatus: EPageStatus.OK, statusCode: 0 });
            setAppUser(result.data);
        } else {
            setPageStatus({ pageStatus: EPageStatus.Error, statusCode: result.statusCode });
        }

    }, [appState, id])

    const deleteClicked = async (e: Event) => {

        e.preventDefault();
        let result = await BaseService.delete<IAppUser>('/AppUser/' + id, appState.token!);


        if (result.ok ) {
            navigate('/appUser');
        } else {
            setPageStatus({ pageStatus: EPageStatus.Error, statusCode: result.statusCode });
        }


    }

    useEffect(() => {
        loadData();
    }, [loadData]);
    return (
        <>
            <h1>Kasutaja kustutamine</h1>

            <div>
                <hr />


                <dl className="row">
                    <dt className="col-sm-2">
                        Eesnimi
                    </dt>
                    <dd className="col-sm-10">
                        {appUser.firstname}
                    </dd>
                    <dt className="col-sm-2">
                        Perekonnanimi
                    </dt>
                    <dd className="col-sm-10">
                        {appUser.lastname}
                    </dd>
                    <dt className="col-sm-2">
                        Kasutajanimi
                    </dt>
                    <dd className="col-sm-10">
                        {appUser.username}
                    </dd>

                    <dt className="col-sm-2">
                       Email
                    </dt>
                    <dd className="col-sm-10">
                        {appUser.email}
                    </dd>

                    <dt className="col-sm-2">
                        Email kinnitatud
                    </dt>
                    <dd className="col-sm-10">
                        {appUser.emailConfirmed}
                    </dd>

                    <dt className="col-sm-2">
                        Stamp
                    </dt>
                    <dd className="col-sm-10">
                        {appUser.securityStamp}
                    </dd>
                    <dt className="col-sm-2">
                       Stamp
                    </dt>
                    <dd className="col-sm-10">
                        {appUser.concurrencyStamp}
                    </dd>
                    <dt className="col-sm-2">
                        Telefoni number
                    </dt>
                    <dd className="col-sm-10">
                        {appUser.phoneNumber}
                    </dd>
                    <dt className="col-sm-2">
Telefoni number kinnitatud                    </dt>
                    <dd className="col-sm-10">
                        {appUser.phoneNumberConfirmed}
                    </dd>
                    <dt className="col-sm-2">
                        kahepoole autoriseerimine
                    </dt>
                    <dd className="col-sm-10">
                        {appUser.twoFactorEnabled}
                    </dd>
                    <dt className="col-sm-2">
                       Blokeeringu l]pp
                    </dt>
                    <dd className="col-sm-10">
                        {appUser.lockoutEnd}
                    </dd>
                    <dt className="col-sm-2">
                        Blokeerimine lubatud
                    </dt>
                    <dd className="col-sm-10">
                        {appUser.lockoutEnabled}
                    </dd>
                    <dt className="col-sm-2">
                        Eba]nnestunud logimisi
                    </dt>
                    <dd className="col-sm-10">
                        {appUser.accessFailedCount}
                    </dd>
                </dl>
            </div>
            <div className="form-group" >
                <div id="button">
                    <button onClick={(e) => deleteClicked(e.nativeEvent)} type="submit" className="btn btn-primary">Muuda</button>
                    <p id='backToList'>
                        <Link to={'/appUser'}>Tagasi</Link>
                    </p>
                </div>

            </div>
        </>

    );
}

export default AppUserDelete;
