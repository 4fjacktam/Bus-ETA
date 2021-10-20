/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";

import Stations from "./station.json";
import { isMobile } from 'react-device-detect';

const useStyles = makeStyles({
  option: {
    fontSize: 15,
    "& > span": {
      marginRight: 10,
      fontSize: 18
    }
  }
});

export default function StopSelect(props) {
  const classes = useStyles();
  const getAllStation = () => {
    fetch("https://data.etabus.gov.hk/v1/transport/kmb/stop")
      .then((res) => res.json())
      .then((result) => {
        return result.data;
      });
  };
  const [isLoading, setIsLoading] = useState(true);
  const [station, setStation] = useState([]);

  useEffect(() => {
    fetch("https://data.etabus.gov.hk/v1/transport/kmb/stop")
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setStation(result.data);
        setIsLoading(false);
        // console.log("station", station);
        // console.log(
        //   station.find((element) => element.stop === "8AFF8B43EC3E547F")
        // );
      });
  }, []);

  useEffect(() => {
    console.log("useeffect get station", getAllStation());
  }, []);

  return !isLoading ? (
    <Autocomplete
      id="country-busstop"
      onChange={(event, value) => {
        //console.log(value.stop);
        if (value !== null) props.changeSelectStop(value.stop);
      }}
      defaultValue={station.find(
        (element) => element.stop === props.defaultStop
      )}
      
      options={station}
      classes={{
        option: classes.option
      }}
      autoHighlight
      getOptionLabel={(option) => option.name_tc + " " + option.name_en}
      renderOption={(option) => (
        <React.Fragment>
          {option.name_tc} {option.name_en}
        </React.Fragment>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a bus stop"
          variant="outlined"
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password" // disable autocomplete and autofill
          }}
        />
      )}
    />
  ) : (
    "Loading"
  );
}
