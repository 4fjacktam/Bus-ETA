import React, { useState, useEffect, createRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";

//checkbox
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

//cookies
import Cookies from "universal-cookie";

import BusStop from "./BusStop";

const useStyles = makeStyles((theme) => ({
  BusStop: {
    flexGrow: 2,
    align: "center"
  }
}));

export default function SimpleCard() {
  const classes = useStyles();
  const [numStop, setNumStop] = useState(1);
  const [openSideBar, setOpenSideBar] = useState(false);
  const [isSpecialRoute, setIsSpecialRoute] = useState(false);
  const [elRefs, setElRefs] = useState([]);
  const [arrayDefaultStops, setArrayDefaultStops] = useState([]);
  const cookies = new Cookies();

  const handleCheckBox = (event) => {
    setIsSpecialRoute(event.target.checked);
  };

  const handleOpenSideBar = () => {
    setOpenSideBar(true);
  };

  const handleCloseSideBar = () => {
    setOpenSideBar(false);
  };

  const handleSave = () => {
    const StationJSON = JSON.stringify(elRefs);
    console.log(elRefs);
    console.log(StationJSON);

    const cookies = new Cookies();

    cookies.set("station", StationJSON, {
      path: "/",
      maxAge: 2147483647
    });
  };

  const handleAddStation = () => {
    setArrayDefaultStops((state) => [
      ...state,
      {
        current: { stop: "", numETA: 1 }
      }
    ]);
  };

  const handleRemoveAll = () => {
    setArrayDefaultStops([]);
  };

  const displayCounter = numStop > 0;
  const arrLength = numStop;

  useEffect(() => {
    setElRefs((elRefs) =>
      Array(arrayDefaultStops.length)
        .fill()
        .map((_, i) => elRefs[i] || createRef())
    );
  }, [
    //numStop,
    arrayDefaultStops
  ]);

  useEffect(() => {
    console.log("elRefs", elRefs);
  }, [elRefs]);

  useEffect(() => {
    const station = cookies.get("station");
    if (station) {
      setArrayDefaultStops(station);
    }
  }, []);

  return (
    <Grid>
      <AppBar color="secondary">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={handleOpenSideBar}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Bus Arrival Time
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="baseline"
      >
        {arrayDefaultStops.map((e, i) => (
          <Grid style={{ flex: 1 }}>
            <BusStop
              ref={elRefs[i]}
              isSpecialRoute={isSpecialRoute}
              defaultStop={e.current.selectStop}
              defaultnumETA={e.current.numETA}
            />
          </Grid>
        ))}
      </Grid>
      <SwipeableDrawer open={openSideBar} onOpen={openSideBar}>
        <Button onClick={handleCloseSideBar}>Close</Button>
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={handleAddStation}>add</Button>
        <Button onClick={handleRemoveAll}>remove all</Button>
        {/* <ButtonGroup>
          <Button onClick={handleIncrement}>+</Button>
          {displayCounter && <Button disabled>{numStop}</Button>}
          {displayCounter && <Button onClick={handleDecrement}>-</Button>}
        </ButtonGroup> */}

        <FormGroup column>
          <FormControlLabel
            control={
              <Checkbox checked={isSpecialRoute} onChange={handleCheckBox} />
            }
            label="特別路線"
          />
        </FormGroup>
      </SwipeableDrawer>
    </Grid>
  );
}
