import { Controller, useFormContext } from "react-hook-form";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import AlertComponent, { EAlertClass } from "../AlertComponent";
import { BaseService } from "../../service/base-service";
import { IUnit } from "../../dto/IUnit";
import { AppContext } from "../../context/AppContext";

const Main = () => {
  const { setValue, control, getFieldState, clearErrors } = useFormContext();
  const appState = useContext(AppContext);
  const [units, setUnits] = useState<IUnit[]>([] as IUnit[]);

  const loadData = useCallback(async () => {
    let result = await BaseService.getAll<IUnit>("/Units", appState.token!);

    if (result.ok && result.data) {
      setUnits(result.data);
    }
  }, [appState]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Grid container>
      <Grid className="measurementsForm">
        <Grid className="imageGrid">
          <AlertComponent
            message={
              "Ennem mõõtude võtmist siduge vööle peenikene pael ja kontrollige, et see oleks samal kõrgusel nii eest kui ka tagant."
            }
            show={true}
            type={EAlertClass.Info}
            paddingSide={false}
          />
          <AlertComponent
            message={
              "Kõikide ümbermõõtude võtmisel hoidke üks sõrm keha ja mõõdulindi vahel, et anda pisut avaruust."
            }
            show={true}
            type={EAlertClass.Info}
            paddingSide={false}
          />
          <AlertComponent
            message={
              "Kõik mõõdud arvestatakse samades ühikutes, mille olete valinud parempoolsest valikust."
            }
            show={true}
            type={EAlertClass.Info}
            paddingSide={false}
          />
        </Grid>
        <Grid className="InputGrid">
          <Grid item xs={12}>
            <Controller
              control={control}
              name="userData.length"
              render={({ field: { value }, fieldState: { error } }) => (
                <TextField
                  error={!!error}
                  fullWidth
                  helperText={error ? error.message : null}
                  variant="standard"
                  type={"number"}
                  InputProps={{ inputProps: { min: 1, step: 0.5 } }}
                  onChange={(e) => {
                    setValue(
                      "length",
                      e.target.value.length > 0
                        ? parseFloat(e.target.value)
                        : ""
                    );
                    clearErrors("length");
                  }}
                  label="Üldpikkus"
                  required
                  value={value}
                />
              )}
              rules={{
                required: "Üldpikkuse sisestamine on kohustuslik.",
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              control={control}
              name={"userData.unitId"}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormControl variant="standard" fullWidth error={!!error}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Mõõtühik*
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={value}
                    onChange={(e) => {
                      onChange(e);
                      clearErrors("unitId");
                    }}
                  >
                    {units.map((unit) => (
                      <MenuItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {getFieldState("unitId").invalid && (
                    <FormHelperText>
                      {getFieldState("unitId")!.error!.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
              rules={{
                required: "Mõõtühiku valimine on kohustuslik.",
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Main;
