import { EPageStatus } from "../../types/EPageStatus";
import { Link } from "react-router-dom";
import { IAppUser } from "../../dto/IAppUser";
import { useContext, useEffect, useState } from "react";
import { AppContext, IAppState } from "../../context/AppContext";
import React, { useCallback } from 'react';
import {BaseService} from "../../service/base-service";

const RowDisplay = (props: { user: IAppUser }, appState: IAppState) => (
    <tr>
        <td>
            {props.user.firstname}
        </td>
        <td>
            {props.user.lastname}
        </td>
        <td>
            {props.user.email}
        </td>
        <td>
            {props.user.email}
        </td>
        <td>
            {props.user.phoneNumber}
        </td>
        <td>
            {props.user.lockoutEnd}
        </td>
        <td>
            <Link to={'/appUser/' + props.user.id}>Details</Link> |
            <Link to={'/appUser/edit/' + props.user.id}>Edit</Link> |
            <Link to={'/appUser/delete/' + props.user.id}>Delete</Link>
        </td>
    </tr>
);


const AppUserIndex = () => {
    const appState = useContext(AppContext);
    const [users, setUser] = useState([] as IAppUser[]);
    const [pageStatus, setPageStatus] = useState({ pageStatus: EPageStatus.Loading, statusCode: -1 });

    const loadData = useCallback(async () => {

        console.log(appState)
        let result = await BaseService.getAll<IAppUser>('/AppUser', appState.token!);
        console.log(result);

        if (result.ok && result.data) {
            setPageStatus({ pageStatus: EPageStatus.OK, statusCode: 0 });
            setUser(result.data);
        } else {
            setPageStatus({ pageStatus: EPageStatus.Error, statusCode: result.statusCode });
        }

    }, [appState])

    useEffect(() => {
        loadData();
    }, [loadData]);


    return (
        <>

            <table className="table">
                <thead>
                <tr>
                    <th>
                        Eesnimi
                    </th>
                    <th>
                        Perekonnanimi
                    </th>
                    <th>
                       Kasutajanimi
                    </th>
                    <th>
                        Email
                    </th>
                    <th>
                       Telefon
                    </th>
                    <th>
                        Piirangu lõpp
                    </th>

                    <th></th>
                </tr>
                </thead>
                <tbody>
                {users.map(user =>
                    <RowDisplay user={user} key={user.id} />)
                }
                </tbody>
            </table>
        </>

    );
}

export default AppUserIndex;
