import {Fragment, useCallback, useContext, useEffect, useState} from "react";
import { Link } from "react-router-dom";
import {IAppRole} from "../../dto/IAppRole";
import {AppContext} from "../../context/AppContext";
import {BaseService} from "../../service/base-service";
import {Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import BasicButton from "../../components/BasicButton";
import {COLOR_GOLD} from "../../utils/constants";

const RowDisplay = (props: { role: IAppRole}) => (
    <TableRow>
        <TableCell>
            {props.role.name}
        </TableCell>

        <TableCell>
            <Link to={'/role/' + props.role.id}>Details</Link> |
            <Link to={'/role/edit/' + props.role.id}>Edit</Link> |
            <Link to={'/role/delete/' + props.role.id}>Delete</Link>|
            <Link to={'/role/change/'+ props.role.id}>Change</Link>
        </TableCell>
    </TableRow>
);


const AppRoleIndex = () => {
    const appState = useContext(AppContext);
    const [appRole, setAppRole] = useState([] as IAppRole[]);

    const loadData = useCallback(async () => {

        console.log(appState)
        let result = await BaseService.getAll<IAppRole>('/AppRole', appState.token!);
        console.log(result);

        if (result.ok && result.data) {

            setAppRole(result.data);
        }

    }, [appState])

    useEffect(() => {
        loadData();
    }, [loadData]);


    return (
        <Fragment>
            <p>
                <Link className='StyledLink' to={'/role/create'}><Button className='DarkButton' >Lisa roll</Button></Link>
            </p>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant='body1'>Rolli nimetus</Typography>
                            </TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {appRole.map(role =>
                            <RowDisplay role={role} key={role.id} />)
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Fragment>

    );
}

export default AppRoleIndex;