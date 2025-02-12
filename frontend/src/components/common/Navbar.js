import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import clsx from "clsx";
import MenuIcon from "@material-ui/icons/Menu";
import PeopleAltOutlined from "@material-ui/icons/PeopleAltOutlined";
import FlareOutlined from "@material-ui/icons/FlareOutlined";
import TouchAppOutlined from "@material-ui/icons/TouchAppOutlined";
import CategoryIcon from "@material-ui/icons/Category";
import SwapVertIcon from "@material-ui/icons/SwapVert";

import { EqualizerOutlined } from "@material-ui/icons";
import Wallet from "./Wallet";
import AccountDialog from "./AccountDialog";
import etherIcon from "../../assets/ether.png";
import binanceIcon from "../../assets/binance.png";
import { etheriumNetwork } from "../../constants";
import DotCircle from "./DotCircle";
import { connect } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import connectors from "../../contracts/connections/connectors";
import { isMetaMaskInstalled } from "../../utils/helper";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
// import { Link } from "react-router-dom";
import NetworkSelect from "./NetworkSelect";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  appBarBackground: {
    boxShadow: "none",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
  },
  menuButton: {
    textTransform: "none",
  },
  title: {
    fontWeight: 600,
    fontSize: 22,
  },
  iconText: {
    fontSize: 15,
  },
  icon: {},

  sectionDesktop: {
    marginLeft: 40,
    marginRight: 40,
    [theme.breakpoints.down("md")]: {
      marginLeft: 5,
      marginRight: 5,
    },
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  sectionMobile: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "space-between",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  row1: {
    width: "90vw",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  home: {
    "text-decoration": "none",
    color: "black",
    cursor: "pointer",
    marginRight: 5,
    marginLeft: 5,
  },
  nav: {
    marginRight: 15,
  },

  list: {
    width: "250px",
    height: "100%",
    backgroundColor: "transparent",
    color: "#f9f9f9",
  },
  fullList: {
    width: "auto",
  },
  menuTitleMobile: {
    paddingLeft: 25,
    fontWeight: 400,
    verticalAlign: "baseline",
    textAlign: "left",
    fontSize: 16,
    color: "#eeeeee",
  },
  navbarItemsDesktop: {
    paddingRight: 10,
    fontWeight: 500,
    lineHeight: "24px",
    verticalAlign: "baseline",
    letterSpacing: "-1px",
    margin: 0,
    padding: "9px 14px 0px",
    cursor: "pointer",
    fontSize: "1.05vw",
    color: theme.palette.primary.appLink,
  },
  navbarButton: {
    backgroundColor: "#f9f9f9",
    color: "#C80C81",
    borderRadius: 10,
    height: 35,
    marginRight: 40,
    padding: 20,
    fontSize: 14,
    fontWeight: 700,
    textTransform: "none",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.7)",
    },
    [theme.breakpoints.down("sm")]: {
      marginRight: 0,
      marginLeft: 15,
      width: 150,
    },
  },
  mobileButton: {
    borderRadius: "50px",
    background: `linear-gradient(to bottom,#D9047C, #BF1088)`,
    lineHeight: "24px",
    verticalAlign: "baseline",
    letterSpacing: "-0.8px",
    margin: 0,
    color: "#ffffff",
    padding: "5px 15px 5px 15px",
    fontWeight: 600,
  },
  leftMargin: {
    marginLeft: 159,
    [theme.breakpoints.down("lg")]: {
      marginLeft: 100,
    },
  },
  numbers: {
    color: "#E0077D",
    fontSize: 26,
    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
    },
  },
  network: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: theme.palette.primary.iconBack,
    borderRadius: 15,
    padding: 6,
    paddingLeft: 8,
    paddingRight: 15,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    marginRight: 5,
    marginLeft: 15,

    "&:hover": {
      background: "rgba(224, 208, 217,1)",
    },
  },
  networkIcon: {
    width: "auto",
    height: 20,
    fontSize: 25,
  },
  menuIcon: {
    color: "rgba(255, 255, 255, 0.5)",
  },
  logo: {
    height: 44,

    [theme.breakpoints.down("sm")]: {
      height: 30,
      width: "auto",
    },
  },
  list: {
    paddingTop: 20,
    width: "250px",
    borderLeft: "5px solid pink",
    borderColor: "#3A1242",
    // borderColor: "#220c3d",
    height: "100%",
    backgroundColor: "#100525",
  },
}));

const Navbar = (props) => {
  const {
    account: { currentNetwork },
  } = props;
  const classes = useStyles();

  const [state, setState] = React.useState({
    right: false,
  });

  const [alertObject, showAlert] = React.useState({
    status: false,
    message: "",
  });

  const [accountDialog, setAccountDialog] = useState(false);

  const toggleDrawer = (anchor, open) => (event) => {
    setState({ ...state, [anchor]: open });
  };

  const { active, account, chainId, activate, deactivate } = useWeb3React();

  const createConnectHandler = async (connector) => {
    try {
      // const connector = connectors.injected;

      if (
        connector instanceof WalletConnectConnector &&
        connector.walletConnectProvider?.wc?.uri
      ) {
        connector.walletConnectProvider = undefined;
      }

      await activate(connector);
      localStorage.connected = "yes";
    } catch (error) {
      console.error("createConnectHandler", error);
    }
  };

  useEffect(() => {
    if (!active && localStorage.connected === "yes") {
      if (isMetaMaskInstalled()) {
        createConnectHandler(connectors.injected);
      } else {
        createConnectHandler(connectors.walletconnect);
      }
    }
  }, [active]);

  const handleLogout = () => {
    localStorage.connected = "none";
    deactivate();
  };

  const handleWalletClick = () => {
    console.log("active", active);
    if (active) {
      setAccountDialog(true);
    } else {
      if (isMetaMaskInstalled()) {
        createConnectHandler(connectors.injected);
      } else {
        createConnectHandler(connectors.walletconnect);
      }
    }
  };

  const handleClose = () => {
    showAlert({ status: false, message: "" });
  };
  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {[
          {
            name: "Stake",
            link: "https://stake.polkabridge.org/",
            id: "staking",
            icon: <EqualizerOutlined />,
          },
          {
            name: "Farm",
            link: "https://farm.polkabridge.org/",
            id: "intro",
            icon: <TouchAppOutlined />,
          },
          {
            name: "Launchpad",
            link: "https://launchpad.polkabridge.org/",
            id: "characters",
            icon: <PeopleAltOutlined />,
          },
          { name: "Swap", link: "/", id: "items", icon: <SwapVertIcon /> },
          {
            name: "Lending",
            link: "#",
            id: "features",
            icon: <FlareOutlined />,
          },
          {
            name: "Prediction",
            link: "#",
            id: "usecase",
            icon: <CategoryIcon />,
          },
        ].map((tab, index) => (
          <a href={tab.link}>
            <ListItem
              button
              key={tab.name}
              onClick={toggleDrawer(anchor, false)}
            >
              <ListItemText
                primary={tab.name}
                className={classes.menuTitleMobile}
              />
            </ListItem>
          </a>
        ))}
        <ListItem button>
          <div className={classes.network}>
            <img
              className={classes.networkIcon}
              src={currentNetwork === etheriumNetwork ? etherIcon : binanceIcon}
              alt={currentNetwork}
            />
            <span style={{ color: "white", marginLeft: 5 }}>
              {currentNetwork === etheriumNetwork ? "Ethereum" : "BSC"}
            </span>
          </div>
        </ListItem>
        <ListItem button style={{ paddingLeft: 35 }}>
          <Wallet onWalletClick={handleWalletClick} />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className={classes.grow}>
      <AccountDialog
        open={accountDialog}
        handleLogout={handleLogout}
        handleClose={() => setAccountDialog(false)}
      />
      <AppBar
        color="transparent"
        position="fixed"
        className={classes.appBarBackground}
      >
        <Toolbar className={classes.sectionDesktop}>
          <a href="/">
            {" "}
            <img
              alt="logo"
              src="https://polkabridge.org/logo.png"
              className={classes.logo}
            />
          </a>

          <div className={classes.leftMargin} />

          <div>
            <a
              href="https://stake.polkabridge.org/"
              className={classes.navbarItemsDesktop}
            >
              Stake <DotCircle />
            </a>
          </div>
          <div>
            <a
              href="https://farm.polkabridge.org"
              target="_blank"
              rel="noreferrer"
              className={classes.navbarItemsDesktop}
            >
              Farm
              <DotCircle />
            </a>
          </div>
          <div>
            <a
              href="https://launchpad.polkabridge.org"
              target="_blank"
              className={classes.navbarItemsDesktop}
            >
              Launchpad <DotCircle />
            </a>
          </div>
          <div>
            <a
              href="/"
              className={classes.navbarItemsDesktop}
              style={{ color: "#DF097C" }}
            >
              Swap <DotCircle />
            </a>
          </div>

          <div>
            <a href="#" className={classes.navbarItemsDesktop}>
              Lending <DotCircle />
            </a>
          </div>

          <div>
            <a href="#" className={classes.navbarItemsDesktop}>
              Prediction <DotCircle />
            </a>
          </div>

          <div>
            <a
              href="https://corgib.polkabridge.org/bet"
              className={classes.navbarItemsDesktop}
            >
              Betting <DotCircle />
            </a>
          </div>

          <div className={classes.grow} />
          {/* <div className={classes.network}>
            <img
              className={classes.networkIcon}
              src={currentNetwork === etheriumNetwork ? etherIcon : binanceIcon}
              alt={currentNetwork}
            />
            <span style={{ color: "#212121", marginLeft: 5 }}>
              {currentNetwork === etheriumNetwork ? "Ethereum" : "BSC"}
            </span>
          </div> */}
          <NetworkSelect selectedNetwork={chainId} />
          <Wallet onWalletClick={handleWalletClick} />
        </Toolbar>

        <Toolbar className={classes.sectionMobile}>
          <div className={classes.row1}>
            <div>
              <a href="/">
                {" "}
                <img
                  alt="logo"
                  variant="square"
                  src="https://polkabridge.org/logo.png"
                  className={classes.logo}
                />
              </a>
            </div>

            {/* <Wallet onWalletClick={() => setAccountDialog(true)} /> */}
            <div>
              {["right"].map((anchor) => (
                <React.Fragment key={anchor}>
                  <IconButton
                    aria-label="Menu"
                    aria-haspopup="true"
                    className={classes.menuIcon}
                    onClick={toggleDrawer(anchor, true)}
                  >
                    <MenuIcon className={classes.menuIcon} />
                  </IconButton>

                  <SwipeableDrawer
                    anchor={anchor}
                    disableSwipeToOpen={false}
                    open={state[anchor]}
                    onClose={toggleDrawer(anchor, false)}
                    onOpen={toggleDrawer(anchor, true)}
                    classes={{ paper: classes.appBarBackground }}
                  >
                    {list(anchor)}
                  </SwipeableDrawer>
                </React.Fragment>
              ))}
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar />{" "}
    </div>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
});
export default connect(mapStateToProps, {})(React.memo(Navbar));
