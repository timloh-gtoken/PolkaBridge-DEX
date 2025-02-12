import React, { useState } from "react";
import {
  Button,
  Dialog,
  Divider,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import CloseIcon from "@material-ui/icons/Close";
import { fromWei, toWei } from "../../../utils/helper";
import { formattedNum } from "../../../utils/formatters";
import TransactionStatus from "../../common/TransactionStatus";
import { connect } from "react-redux";
import {
  stakeLpTokens,
  unstakeLpTokens,
  getFarmInfo,
  getLpBalanceFarm,
} from "../../../actions/farmActions";
import BigNumber from "bignumber.js";
import { useMemo } from "react";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 450,
    borderRadius: 15,

    borderRadius: 30,
    backgroundColor: "transparent",
    filter: "drop-shadow(0 0 0.5rem #212121)",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    paddingBottom: 15,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 7,
      paddingRight: 7,
      width: "98%",
    },
  },
  tokenTitle: {
    fontWeight: 500,
    fontSize: 16,
    paddingBottom: 3,
    color: "#e5e5e5",
  },
  maxButton: {
    width: "fit-content",
    backgroundColor: "rgba(223, 9, 124,0.5)",
    color: "white",
    textTransform: "none",
    fontSize: 14,
    padding: "2px 2px 2px 2px",
    marginBottom: 4,
    marginRight: 4,
    borderRadius: 15,
    willChange: "transform",
    transition: "transform 450ms ease 0s",
    transform: "perspective(1px) translateZ(0px)",
    "&:hover": {
      background: "rgba(224, 7, 125, 0.7)",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
      width: "80%",
    },
  },
  header: {
    color: "white",
    fontSize: 22,
    fontWeight: 600,
  },
  section: {
    color: "#cecece",
    fontSize: 16,
    fontWeight: 600,
  },
  inputSection: {
    padding: 7,
    width: "100%",
    borderRadius: 30,
    padding: 20,
    backgroundColor: "rgba(41, 42, 66, 0.01)",

    marginTop: 20,
    borderRadius: 15,
    background: `#29323c`,
    [theme.breakpoints.down("xs")]: {
      padding: 15,
      width: "100%",
    },
  },
  confirmButton: {
    backgroundColor: "rgba(224, 7, 125, 0.9)",
    color: "white",
    textTransform: "none",
    fontSize: 17,
    borderRadius: 15,
    willChange: "transform",
    transition: "transform 450ms ease 0s",
    transform: "perspective(1px) translateZ(0px)",
    padding: "8px 50px 8px 50px",
    "&:hover": {
      background: "rgba(224, 7, 125, 0.7)",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
  cancelButton: {
    backgroundColor: "#2C2F35",
    color: "white",
    textTransform: "none",
    fontSize: 17,
    borderRadius: 20,

    padding: "8px 50px 8px 50px",

    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
    },
  },
  input: {
    backgroundColor: "transparent",
    height: 50,

    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    borderWidth: "1px",
    fontSize: 18,
    width: 190,
    color: "white",
    outline: "none",
    padding: 10,
    [theme.breakpoints.down("sm")]: {
      width: 80,
      padding: 7,
      fontSize: 15,
      marginTop: 10,
      height: 50,
      width: 250,
    },
  },
}));

const StakeDialog = ({
  open,
  type,
  poolInfo,
  handleClose,
  dex: { transaction },
  farm: { farms, lpBalance },
  account: { currentAccount, currentNetwork },
  stakeLpTokens,
  unstakeLpTokens,
  getFarmInfo,
  getLpBalanceFarm,
}) => {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState("");

  const parseLpBalance = useMemo(
    () =>
      fromWei(
        lpBalance?.[poolInfo.poolAddress]?.lpBalance,
        poolInfo.poolDecimals
      ),
    [poolInfo.pid, lpBalance]
  );
  const parseStakedAmount = useMemo(
    () =>
      fromWei(
        farms?.[poolInfo.poolAddress]?.stakeData?.amount,
        poolInfo.poolDecimals
      ),
    [poolInfo.pid, farms]
  );

  const handleMax = () => {
    if (type === "stake") {
      setInputValue(
        parseLpBalance,
        poolInfo.pid,
        currentAccount,
        currentNetwork
      );
    } else {
      setInputValue(
        parseStakedAmount,
        poolInfo.pid,
        currentAccount,
        currentNetwork
      );
    }
  };

  const confirmStake = async () => {
    const inputTokens = inputValue
      ? toWei(inputValue, poolInfo.poolDecimals)
      : 0;

    if (new BigNumber(inputTokens).lte(0)) {
      return;
    }

    if (
      type === "stake" &&
      new BigNumber(inputTokens).gt(
        lpBalance?.[poolInfo.poolAddress]?.lpBalance
      )
    ) {
      return;
    }

    if (
      type === "unstake" &&
      new BigNumber(inputTokens).gt(
        farms?.[poolInfo.poolAddress]?.stakeData?.amount
      )
    ) {
      return;
    }

    if (type === "stake") {
      await stakeLpTokens(
        inputTokens,
        poolInfo.poolAddress,
        poolInfo.pid,
        currentAccount,
        currentNetwork
      );
    } else {
      await unstakeLpTokens(
        inputTokens,
        poolInfo.poolAddress,
        poolInfo.pid,
        currentAccount,
        currentNetwork
      );
    }

    // update pool after transaction:
    await Promise.all([
      getFarmInfo(
        poolInfo.poolAddress,
        poolInfo.pid,
        currentAccount,
        currentNetwork
      ),
      getLpBalanceFarm(poolInfo.poolAddress, currentAccount, currentNetwork),
    ]);
  };

  const closeAction = () => {
    handleClose();
    setTimeout(() => {
      setInputValue("");
    }, 500);
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      disableBackdropClick
      className={classes.dialog}
      color="transparent"
      PaperProps={{
        style: {
          borderRadius: 15,
          backgroundColor: "#121827",
          color: "#f9f9f9",
        },
      }}
    >
      {transaction.type === null && (
        <div className={classes.card}>
          <div className="d-flex justify-content-between align-items-center">
            <h1 className={classes.header}>
              {type === "stake" ? "Stake" : "Unstake"} LP token
            </h1>
            <div>
              <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={closeAction}
              >
                <CloseIcon
                  style={{ color: "rgba(224, 7, 125, 0.9)", padding: 0 }}
                />
              </IconButton>
            </div>
          </div>
          <div className="mt-2">
            <Divider style={{ backgroundColor: "grey", height: 1 }} />
          </div>
          <div className={classes.inputSection}>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <div>
                <h1 className={classes.section}>
                  {type === "stake" ? "Stake" : "Unstake"}
                </h1>
              </div>
              <div>
                {type === "stake" ? (
                  <h1 className={classes.section}>
                    Balance: {formattedNum(parseLpBalance)}
                  </h1>
                ) : (
                  <h1 className={classes.section}>
                    Lp staked: {formattedNum(parseStakedAmount)}
                  </h1>
                )}
              </div>
            </div>
            <div className="d-flex flex-wrap justify-content-between align-items-center mt-2">
              <div>
                {/* <div className={classes.tokenTitle}>0.00</div> */}
                <input
                  className={classes.input}
                  placeholder="0.00"
                  onChange={({ target: { value } }) => setInputValue(value)}
                  value={inputValue}
                  type="number"
                />
              </div>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <div>
                  <Button className={classes.maxButton} onClick={handleMax}>
                    Max
                  </Button>
                </div>
                <div>
                  <h1 className={classes.section}>{poolInfo.farmPool} LP</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-around align-items-center mt-3">
            <Button
              variant="text"
              className={classes.cancelButton}
              onClick={closeAction}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              className={classes.confirmButton}
              onClick={confirmStake}
            >
              Confirm
            </Button>
          </div>
          <div className="d-flex justify-content-center align-items-center mt-4 mb-2">
            <Link to="liquidity">
              {" "}
              <div
                className={classes.tokenTitle}
                style={{ color: "rgba(223, 9, 124,0.9)" }}
              >
                Get {poolInfo.farmPool} LP <OpenInNewIcon fontSize="small" />{" "}
              </div>{" "}
            </Link>
            <div className={classes.tokenAmount}></div>
          </div>
        </div>
      )}

      <div>
        {transaction.type !== null && (
          <div>
            <TransactionStatus onClose={closeAction} />
          </div>
        )}
      </div>
    </Dialog>
  );
};

const mapStateToProps = (state) => ({
  dex: state.dex,
  farm: state.farm,
  account: state.account,
});

export default connect(mapStateToProps, {
  stakeLpTokens,
  unstakeLpTokens,
  getFarmInfo,
  getLpBalanceFarm,
})(StakeDialog);
