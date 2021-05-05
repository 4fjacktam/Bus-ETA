import React, { useState, useEffect } from "react";
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

  const handleCheckBox = (event) => {
    setIsSpecialRoute(event.target.checked);
  };

  const handleIncrement = () => {
    setNumStop(numStop + 1);
  };

  const handleDecrement = () => {
    setNumStop(numStop - 1);
  };

  const handleOpenSideBar = () => {
    setOpenSideBar(true);
  };

  const handleCloseSideBar = () => {
    setOpenSideBar(false);
  };

  const displayCounter = numStop > 0;

  return (
    <Grid>
      <AppBar
        color="secondary"
        //position="sticky"
      >
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
        {[...Array(numStop)].map((e, i) => {
          return (
            <Grid style={{ flex: 1 }}>
              <BusStop isSpecialRoute={isSpecialRoute} />
            </Grid>
          );
        })}
      </Grid>
      <SwipeableDrawer open={openSideBar}>
        <Button onClick={handleCloseSideBar}>Close</Button>
        <ButtonGroup>
          <Button onClick={handleIncrement}>+</Button>
          {displayCounter && <Button disabled>{numStop}</Button>}
          {displayCounter && <Button onClick={handleDecrement}>-</Button>}
        </ButtonGroup>

        <FormGroup column>
          <FormControlLabel
            control={
              <Checkbox
                checked={isSpecialRoute}
                onChange={handleCheckBox}
                name="checkedA"
              />
            }
            label="特別路線"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={true}
                onChange={""}
                name="checkedB"
                color="primary"
              />
            }
            label="Primary"
          />
        </FormGroup>
      </SwipeableDrawer>
    </Grid>
  );
}
