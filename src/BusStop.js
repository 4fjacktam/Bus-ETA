import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle
} from "react";
import { makeStyles } from "@material-ui/core/styles";
import { createTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import moment from "moment";

import Autocomplete from "./Autocomplete";

import kmbwater from "./img/kmb-water.png";

import { isMobile } from 'react-device-detect';

const useStyles = makeStyles((theme) => ({
  // root: {
  //   minWidth: 275
  // },
  title: {
    flexGrow: 2,
    align: "center"
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  typography: {
    align: "center"
  },
  min: {
    align: "center"
  }
}));

let theme = createTheme();
theme = responsiveFontSizes(theme);

const BusStop = (props, ref) => {
  const classes = useStyles();
  const [station, setStation] = useState([]);
  const [lastupdts, setLastupdts] = useState();
  const [lastrefreshts, setLastrefreshts] = useState();
  const [selectStop, setSelectStop] = useState(
    props.defaultStop ? props.defaultStop : "9583BCF159B682BA"
  );
  const [numETA, setNumETA] = useState(
    props.defaultnumETA ? props.defaultnumETA : 1
  );
  const url = "https://data.etabus.gov.hk/v1/transport/kmb/stop-eta/";
  const displayCounter = numETA > 0;

  const changeSelectStop = (stop) => {
    setSelectStop(stop);
  };

  const fetchKMB = () => {
    console.log("fetchKMB");
    fetch(url + selectStop)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setStation(
          result.data.filter(
            (eta) =>
              eta.eta_seq <= numETA &&
              eta.service_type === 1 &&
              (props.isSpecialRoute ? true : !eta.rmk_en.includes("route only"))
          )
        );
        setLastupdts(result.generated_timestamp);
        setLastrefreshts(moment());
      });
  };

  const renderETA = (eta) => {
    var exp = moment(eta);
    var etaInSecond = moment().diff(exp, "seconds") * -1;
    var etaInMin = moment().diff(exp, "minutes") * -1;
    if(eta == null) return <Typography variant={isMobile?"subtitle2":"h5"}>沒有班次</Typography>
    return <Typography variant={isMobile?"h6":"h4"}>{etaInSecond > 60 ? etaInMin + " min" : "- min"}</Typography>

    
  };

  const handleIncrement = () => {
    setNumETA(numETA + 1);
  };

  const handleDecrement = () => {
    setNumETA(numETA - 1);
  };

  useEffect(() => {
    fetchKMB();
    let id = setInterval(() => {
      fetchKMB();
    }, 5000);
    return () => clearInterval(id);
  }, [selectStop, numETA, props.isSpecialRoute]);

  useImperativeHandle(
    ref,
    () => ({
      selectStop,
      numETA
    }),
    [selectStop, numETA]
  );

  return (
    <ThemeProvider theme={theme}>
      <Grid>
        <Grid container style={{ padding: "5px", minWidth: isMobile?"60vw":"40vw" }}>
        
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid align="center" style={{ flex: 2 }}>
              <Autocomplete
                changeSelectStop={changeSelectStop}
                defaultStop={props.defaultStop}
              />
            </Grid>
          </Grid>
          <Grid alignItems="left" justifyContent="center">
            <ButtonGroup>
              <Button onClick={handleIncrement}>+</Button>
              {displayCounter && <Button disabled>{numETA}</Button>}
              {displayCounter && <Button onClick={handleDecrement}>-</Button>}
            </ButtonGroup>
          </Grid>
          <Grid direction="row" style={{ flex: 1, align: "center" }}>
            <Typography align="right" variant="subtitle2">
              Last Update: {moment(lastupdts).format("YYYY/MM/DD HH:mm:ss")}
            </Typography>
            <Typography align="right" variant="subtitle2">
              Last Refresh:{" "}
              {moment(lastrefreshts).format("YYYY/MM/DD HH:mm:ss")}
            </Typography>
          </Grid>
        </Grid>
        <Grid direction="row" justify="space-between" alignItems="center">
          {station.map((route, index) => (
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
              style={{
                minHeight: '10vh'
              }}
            >
              <Grid
                style={{
                  flex: 1,
                }}
              >
                {route.eta_seq === 1 && (
                  <Typography align="center" variant="h3">
                    {route.route}
                  </Typography>
                )}
              </Grid>
              <Grid
                style={{
                  flex: 4
                  //backgroundColor: "red"
                }}
              >
                {route.eta_seq === 1 && (
                  <Typography
                    align="center"
                    variant="h5"
                    className={classes.typography}
                  >
                    <Typography variant="h5" className={classes.typography}>
                      {route.dest_tc}
                    </Typography>
                    {!isMobile &&
                    <Typography variant="h6" className={classes.typography}>
                      {route.dest_en}
                    </Typography>}
                  </Typography>
                )}
              </Grid>
              {/* <ListItemText primary={route.route} secondary={route.dest_tc} /> */}
              <Grid
                style={{
                  flex: 1
                  //backgroundColor: "red"
                }}
              >
                <Typography align="center" className={classes.min}>
                  {/* <Typography>{moment(route.eta).fromNow()}</Typography>
              <Typography>{route.rmk_tc}</Typography> */}

                  {renderETA(route.eta)}
                  <Typography variant={!isMobile?"h6":"subtitle2"}>{route.rmk_tc}</Typography>
                </Typography>
              </Grid>
              {!isMobile && <img
                src={kmbwater}
                className="photo"
                alt="KMB"
                width="100px"
                height="100px"
              />}
            </Grid>
          ))}
        </Grid>
      </Grid>
    </ThemeProvider>);
};

export default forwardRef(BusStop);
