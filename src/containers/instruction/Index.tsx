import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { DataGrid, GridActionsCellItem, GridRowParams } from "@mui/x-data-grid";
import { IInstruction } from "../../dto/IInstruction";
import {
  Grid,
  Pagination,
  styled,
  TablePagination,
  Typography,
} from "@mui/material";
import BasicButton from "../../components/BasicButton";
import { useNavigate } from "react-router-dom";
import { BaseService } from "../../service/base-service";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DialogScreen from "../../components/DialogScreen";
import AlertComponent, { EAlertClass } from "../../components/AlertComponent";

const TableGrid = styled(Grid)({
  width: "100%",
  height: "500px",
});

const InstructionIndex = () => {
  const appState = useContext(AppContext);
  const [rows, setRows] = useState<IInstruction[]>([] as IInstruction[]);
  const [modalState, setModalState] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [alertMessage, setAlertMessage] = useState<{
    message: string;
    alertType: EAlertClass;
  }>({
    message: "",
    alertType: EAlertClass.Success,
  });

  const columns = [
    {
      field: "name",
      headerName: "Nimetus",
      width: 300,
      editable: true,
    },
    {
      field: "description",
      headerName: "Kirjeldus",
      width: 300,
      editable: true,
    },
    {
      field: "totalStep",
      headerName: "Samme kokku",
      width: 150,
      editable: true,
    },
    {
      field: "categoryName",
      headerName: "Kategooria",
      width: 150,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      width: 100,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          key={`${params.id}-edit-btn`}
          label={"Muuda"}
          onClick={() => navigate(`Create/${params.id}`)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          key={`${params.id}-delete-btn`}
          label={"Kustuta"}
          onClick={() => {
            useConfirmDialog();
            setDeleteId(params.id.toString());
          }}
        />,
      ],
    },
  ];
  let navigate = useNavigate();

  const loadData = useCallback(async () => {
    let result = await BaseService.getAll<IInstruction>(
      "/Instructions",
      appState.token!
    );
    if (result.ok && result.data) {
      console.log("result.data");

      console.log(result.data);
      setRows(result.data);
    }
  }, [appState]);

  const handleNavigation = () => {
    navigate("/instruction/create/new");
  };

  const deleteInstruction = async () => {
    let result = await BaseService.delete<IInstruction>(
      "/Instructions/" + deleteId,
      appState.token!
    );
    if (result.ok && result.data) {
      handleClose();
      setAlertMessage({
        message: "Kustutamine õnnestus!",
        alertType: EAlertClass.Success,
      });
    } else {
      setAlertMessage({
        message: "Kustutamine ebaõnnestus!",
        alertType: EAlertClass.Danger,
      });
    }
  };
  const useConfirmDialog = () => {
    setModalState(!modalState);
  };

  const handleClose = () => {
    setModalState(!modalState);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <>
      {alertMessage.message !== "" ? (
        <AlertComponent
          message={alertMessage.message}
          paddingSide={false}
          show={true}
          type={alertMessage.alertType}
        />
      ) : null}
      <Grid container className={"layoutContainer"}>
        <Grid className={"DataTableGrid"} flexDirection={"column"}>
          <Typography variant="h1">Lõiked</Typography>
          <Grid className={"AddButton"}>
            <BasicButton
              btnType={"black"}
              label={"Lisa uus"}
              onClick={handleNavigation}
            />
          </Grid>
        </Grid>
        <TableGrid>
          <DataGrid
            localeText={{
              columnMenuUnsort: "Eemalda valikud",
              columnMenuSortAsc: "Sorteeri A-Z",
              columnMenuSortDesc: "Sorteeri Z-A",
              columnMenuLabel: "Menüü",
              columnMenuFilter: "Filtreeri",
              columnMenuHideColumn: "Peida",
              columnMenuShowColumns: "Näita veerge",
              filterOperatorContains: "Sisaldab",
              filterOperatorEquals: "Ühtib",
              filterOperatorEndsWith: "Lõppeb",
              filterPanelInputLabel: "Otsingusõna",
              filterOperatorStartsWith: "Algab",
              filterOperatorIsAnyOf: "Üks neist",
              filterOperatorIsEmpty: "On tühi",
              filterOperatorIsNotEmpty: "Ei ole tühi",
              filterPanelColumns: "Veerud",
              filterPanelOperators: "Sorteerimis valikud",
              filterPanelAddFilter: "seee",
              filterPanelInputPlaceholder: "Filtreeritav sõna",
              columnsPanelHideAllButton: "Peida kõik",
              columnsPanelShowAllButton: "Näita kõiki valikuid",
              columnsPanelTextFieldPlaceholder: "Veeru nimetus",
              columnsPanelTextFieldLabel: "Leia veerg",
              noRowsLabel: "Kasutajal pole ühtegi lõiget alustatud",
              columnHeaderSortIconLabel: "Sorteeri",
            }}
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </TableGrid>
      </Grid>
      <DialogScreen handleClose={handleClose} isOpened={modalState}>
        <AlertComponent
          message={"Olete kindel, et soovite juhendi kustutada?"}
          show={true}
          type={EAlertClass.Danger}
          paddingSide={false}
        />
        <Grid className={"formButton"}>
          <BasicButton
            btnType={"red"}
            label={"Kustuta"}
            onClick={deleteInstruction}
          />
        </Grid>
      </DialogScreen>
    </>
  );
};
export default InstructionIndex;
