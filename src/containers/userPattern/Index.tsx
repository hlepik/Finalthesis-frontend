import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { BaseService } from "../../service/base-service";
import { Checkbox, Grid, styled, Typography } from "@mui/material";
import { IUserPattern } from "../../dto/IUserPattern";
import {
  DataGrid,
  GridRenderCellParams,
  GridRowParams,
} from "@mui/x-data-grid";
import CheckSharpIcon from "@mui/icons-material/CheckSharp";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import BasicButton from "../../components/BasicButton";
import { useNavigate } from "react-router-dom";

const TableGrid = styled(Grid)({
  width: "100%",
  height: "500px",
});
const StyledTitle = styled(Typography)({
  marginBottom: "2rem",
});

const UserPatternIndex = () => {
  const appState = useContext(AppContext);
  const [rows, setRows] = useState([] as IUserPattern[]);
  const navigate = useNavigate();
  const loadData = useCallback(async () => {
    if (appState.token !== undefined) {
      let result = await BaseService.getAll<IUserPattern>(
        "/UserPatterns",
        appState.token!
      );

      if (result.ok && result.data) {
        setRows(result.data);
      }
    }
  }, [appState]);

  const columns = [
    {
      field: "instructionTitle",
      headerName: "Nimetus",
      width: 300,
      editable: false,
    },
    {
      field: "instructionDescription",
      headerName: "Kirjeldus",
      width: 300,
      editable: false,
    },
    {
      field: "instructionCategory",
      headerName: "Kategooria",
      width: 150,
      editable: false,
    },
    {
      id: 2,
      field: "hasDone",
      headerName: "Sooritatud",
      width: 150,
      sortable: false,
      editable: false,

      renderCell: (params: GridRenderCellParams<boolean>) => {
        return (
          <Checkbox
            checked={params.value}
            disabled
            icon={<CloseSharpIcon />}
            checkedIcon={<CheckSharpIcon />}
          />
        );
      },
    },
    {
      field: "Jätka",
      type: "actions",
      width: 150,
      getActions: (params: GridRowParams) => [
        <BasicButton
          btnType={"transparent"}
          label={params.row["hasDone"] ? "Vaata" : "Jätka"}
          onClick={() =>
            navigate(`/userPattern/${params.row["instructionId"]}`)
          }
        />,
      ],
    },
  ];

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Grid container className={"layoutContainer"}>
      <StyledTitle variant="h1">Pooleliolevad ja tehtud lõiked</StyledTitle>
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
  );
};

export default UserPatternIndex;
