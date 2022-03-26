import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { DataGrid } from "@mui/x-data-grid";
import { IInstruction } from "../../dto/IInstruction";
import { Grid, styled, Typography } from "@mui/material";
import BasicButton, { IBtnType } from "../../components/BasicButton";
import { EDialogType } from "../../types/EDialogType";
import { useNavigate } from "react-router-dom";
import { BaseService } from "../../service/base-service";
import { ICategory } from "../../dto/ICategory";
import { COLOR_GOLD } from "../../utils/constants";
const TableGrid = styled(Grid)(({ theme }) => ({
  width: "100%",
}));
const InstructionIndex = () => {
  const appState = useContext(AppContext);
  const [rows, setRows] = useState<IInstruction[]>([] as IInstruction[]);
  const columns = [
    {
      field: "name",
      headerName: "Nimetus",
      width: 150,
      editable: true,
    },
  ];
  let navigate = useNavigate();

  const loadData = useCallback(async () => {
    let result = await BaseService.getAll<IInstruction>(
      "/Instructions",
      appState.token!
    );
    if (result.ok && result.data) {
      setRows(result.data);
    }
  }, [appState]);

  const handleNavigation = () => {
    navigate("/instruction/create");
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Grid container className={"PageContainer"}>
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
      <TableGrid border={1}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
        />
      </TableGrid>
    </Grid>
  );
};
export default InstructionIndex;
