/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

// ISO 3166-1 alpha-2
// ⚠️ No support for IE 11

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
  const [station, setStation] = useState([]);

  useEffect(() => {
    fetch("https://data.etabus.gov.hk/v1/transport/kmb/stop")
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setStation(result.data);
      });
  }, []);

  return (
    <Autocomplete
      id="country-select-demo"
      onChange={(event, value) => {
        //console.log(value.stop);
        if (value !== null) props.changeSelectStop(value.stop);
      }}
      style={{ minWidth: 600 }}
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
  );
}

// From https://bitbucket.org/atlassian/atlaskit-mk-2/raw/4ad0e56649c3e6c973e226b7efaeb28cb240ccb0/packages/core/select/src/data/countries.js
