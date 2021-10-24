import {
  Button,
  Card,
  CircularProgress,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import { connect } from "react-redux";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { useCallback, useEffect, useState } from "react";
import SwapSettings from "../../common/SwapSettings";
import etherImg from "../../../assets/ether.png";
import SwapCardItem from "../../Cards/SwapCardItem";
import AddIcon from "@material-ui/icons/Add";
import { DECIMAL_6_ADDRESSES, ETH, etheriumNetwork, tokens } from "../../../constants";
import {
  getPercentage,
  getPriceRatio,
  getToken1Out,
  getToken2Out,
  getTokenOutWithReserveRatio,
  toWei,
} from "../../../utils/helper";
import {
  addLiquidityEth,
  checkAllowance,
  confirmAllowance,
  getPoolShare,
  getLpBalance,
  loadPairAddress,
  addLiquidity,
} from "../../../actions/dexActions";
import { getAccountBalance } from "../../../actions/accountActions";
import tokenThumbnail from "../../../utils/tokenThumbnail";
import BigNumber from "bignumber.js";
import store from "../../../store";
import {
  RESET_POOL_SHARE,
  SET_TOKEN_ABI,
  START_TRANSACTION,
} from "../../../actions/types";
import debounce from "lodash.debounce";
import { getPairAddress, getTokenAbi } from "../../../utils/connectionUtils";
import { Settings } from "@material-ui/icons";
import SwapConfirm from "../../common/SwapConfirm";

const useStyles = makeStyles((theme) => ({
  card: {
    width: 500,
    borderRadius: 15,
    background: `linear-gradient(to bottom,#191B1F,#191B1F)`,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 20,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 0,
      paddingRight: 0,
      width: "95%",
    },
  },
  cardContents: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    zIndex: 2,
    position: "relative",
    width: "auto",
    height: 60,
  },
  avatar_corgib: {
    zIndex: 2,
    width: "auto",
    height: 160,
  },
  cardHeading: {
    paddingTop: 5,
    width: "95%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      paddingTop: 0,
    },
  },
  cardFeature: {
    marginTop: 10,
    marginBottom: 10,
    width: "95%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardSubHeading: {
    color: "#ffffff",
    display: "flex",
    width: "95%",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 0,
    marginBottom: 2,
    [theme.breakpoints.down("sm")]: {
      paddingTop:3,
    },
  },
  settingIcon: {
    color: "#f6f6f6",
    fontSize: 22,
    [theme.breakpoints.down("sm")]: {
      fontSize: 17,
    },
  },
  addIcon: {
    color: "#f6f6f6",
    marginTop: -12,
    marginBottom: -12,
    borderRadius: "36%",
    border: "3px solid #212121",
    transition: "all 0.4s ease",
    fontSize: 28,
    backgroundColor: "#191B1E",
  },

  numbers: {
    color: "#E0077D",
    fontSize: 26,
  },
  tokenPair: {
    display: "flex",
    width: "94%",
    justifyContent: "space-between",
    marginTop: 2,
    marginBottom: 15,
  },
  selectToken: {
    width: 150,
  },
  checkIcon: {
    color: "#E0077D",
  },
  selectPoolContainer: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-evenly",
    },
  },
  feeSelectContainer: {
    width: 140,
    padding: 6,
    marginLeft: 5,
    marginRight: 5,
    border: "0.5px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    "&:hover": {
      background: "rgba(255, 255, 255, 0.1)",
    },
    [theme.breakpoints.down("sm")]: {
      width: 90,
      padding: 2,
      paddingLeft: 5,
      marginLeft: 2,
      marginRight: 2,
    },
  },
  feeSelectHeading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    fontSize: 15,
    fontWeight: 500,
    color: "#e5e5e5",
    [theme.breakpoints.down("sm")]: {
      fontSize: 13,
    },
  },
  feeSelectHeadingSpan: {
    color: "#fce4ec",
    fontSize: 11,
    [theme.breakpoints.down("sm")]: {
      fontSize: 10,
    },
  },
  priceRangeCardContainer: {
    display: "flex",
    width: "90%",
    justifyContent: "space-between",
    marginTop: 2,
    marginBottom: 15,
  },

  addButton: {
    height: 45,
    width: "90%",
    marginTop: 30,
    marginBottom: 5,
  },
  clearButton: {
    color: "#E0077D",
    cursor: "pointer",
    fontSize: 16,
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
  title: {
    paddingTop: 5,
    fontSize: 16,
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
  cardTitle: {
    fontSize: 16,
    color: "#bdbdbd",
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
  hintStyle: {
    fontSize: 13,
    color: "#e5e5e5",
    marginTop: 20,
    [theme.breakpoints.down("sm")]: {
      marginTop: 10,
      fontSize: 11,
    },
  },
  iconButton: {
    margin: 0,
    padding: 2,
  },
  addLiquidityButton: {
    marginTop: 20,
    backgroundColor: "rgba(224, 7, 125, 0.9)",
    color: "white",
    width: "95%",
    textTransform: "none",
    fontSize: 19,
    borderRadius: 20,
    willChange: "transform",
    transition: "transform 450ms ease 0s",
    transform: "perspective(1px) translateZ(0px)",
    padding: "10px 50px 10px 50px",
    "&:hover": {
      background: "rgba(224, 7, 125, 0.7)",
    },
    [theme.breakpoints.down("sm")]: {
      marginTop: 5,
      fontSize: 13,
    },
  },
}));

const AddCard = (props) => {
  const {
    account: { balance, loading, currentNetwork, currentAccount },
    dex: {
      swapSettings,
      approvedTokens,
      poolShare,
      poolReserves,
      pairContractData,
      tokenData,
      transaction,
    },
    addLiquidityEth,
    checkAllowance,
    confirmAllowance,
    getPoolShare,
    handleBack,
    getLpBalance,
    loadPairAddress,
    getAccountBalance,
    addLiquidity,
  } = props;

  const currentDefaultToken = {
    icon: etherImg,
    name: "Ethereum",
    symbol: "ETH",
  };
  const classes = useStyles();
  const [settingOpen, setOpen] = useState(false);
  const [selectedToken1, setToken1] = useState(currentDefaultToken);
  const [selectedToken2, setToken2] = useState({});
  const [token1Value, setToken1Value] = useState(""); // token1 for eth only
  const [token2Value, setToken2Value] = useState(""); // token2 for pbr
  const [localStateLoading, setLocalStateLoading] = useState(false);

  const [swapDialogOpen, setSwapDialog] = useState(false);

  const [addStatus, setStatus] = useState({
    message: "Please select tokens",
    disabled: true,
  });

  const handleSettings = () => {
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
  };

  useEffect(() => {
    async function initSelection() {
      let defaultToken1, defaultToken2;
      if (currentNetwork === etheriumNetwork) {
        defaultToken1 = tokens[0];
        defaultToken2 = tokens[2];
      } else {
        defaultToken1 = {
          icon: tokenThumbnail("PWAR"),
          name: "Polkawar",
          symbol: "PWAR",
        };
        defaultToken2 = {
          icon: tokenThumbnail("BNB"),
          name: "Binance",
          symbol: "BNB",
        };
      }
      setToken1(defaultToken1);
      setToken2(defaultToken2);
      verifySwapStatus(
        { value: token1Value, selected: defaultToken1 },
        { value: token2Value, selected: defaultToken2 }
      );
    }
    initSelection();
  }, [currentNetwork]);

  const currentPairAddress = () => {
    if (
      Object.keys(pairContractData).includes(
        `${selectedToken1.symbol}_${selectedToken2.symbol}`
      )
    ) {
      return pairContractData[
        `${selectedToken1.symbol}_${selectedToken2.symbol}`
      ];
    } else if (
      Object.keys(pairContractData).includes(
        `${selectedToken2.symbol}_${selectedToken1.symbol}`
      )
    ) {
      return pairContractData[
        `${selectedToken2.symbol}_${selectedToken1.symbol}`
      ];
    } else {
      return null;
    }
  };

  const currentTokenApprovalStatus = () => {
    return selectedToken1.symbol === "ETH"
      ? true
      : approvedTokens[selectedToken1.symbol];
  };

  const clearInputState = () => {
    setToken1Value("");
    setToken2Value("");
    setStatus({ disabled: true, message: "Enter Amounts" });
  };

  const loadPairReserves = async () => {

    console.log('loading pair reserves after add liquidity')
    let _pairAddress = currentPairAddress();

    if (!_pairAddress) {
      _pairAddress = await getPairAddress(
        selectedToken1.address,
        selectedToken2.address,
        currentNetwork
      );

      loadPairAddress(
        selectedToken1.symbol,
        selectedToken2.symbol,
        _pairAddress,
        currentNetwork
      );
    }

    if (!_pairAddress) {
      //pair not yet created in the factory
    } else {
      await getLpBalance(
        selectedToken1,
        selectedToken2,
        _pairAddress,
        currentAccount,
        currentNetwork
      );
    }
  }


  // new use effect
  useEffect(() => {
    async function loadPair() {
      if (selectedToken1.symbol && selectedToken2.symbol) {
        setLocalStateLoading(true);
        clearInputState();
        // load erc20 token abi and balance
        const erc20Token =
          selectedToken1.symbol === ETH ? selectedToken2 : selectedToken1;

        await getAccountBalance(erc20Token, currentNetwork);

        let _pairAddress = currentPairAddress();

        await loadPairReserves()
        // if (!_pairAddress) {
        //   _pairAddress = await getPairAddress(
        //     selectedToken1.address,
        //     selectedToken2.address,
        //     currentNetwork
        //   );

        //   loadPairAddress(
        //     selectedToken1.symbol,
        //     selectedToken2.symbol,
        //     _pairAddress,
        //     currentNetwork
        //   );
        // }

        // if (!_pairAddress) {
        //   //pair not yet created in the factory
        // } else {
        //   await getLpBalance(
        //     selectedToken1,
        //     selectedToken2,
        //     _pairAddress,
        //     currentAccount,
        //     currentNetwork
        //   );
        // }

        await checkAllowance(selectedToken1, currentAccount, currentNetwork);

        setLocalStateLoading(false);
      }
    }

    loadPair();
  }, [selectedToken1, selectedToken2, currentNetwork, currentAccount]);

  const handleConfirmAllowance = async () => {
    const allowanceAmount = toWei("999999999");

    await confirmAllowance(
      allowanceAmount,
      selectedToken1,
      currentAccount,
      currentNetwork
    );
  };

  const verifySwapStatus = (token1, token2) => {
    let message, disabled;
    const _token1 = new BigNumber(token1.value ? token1.value : 0);
    const _token2 = new BigNumber(token2.value ? token2.value : 0);

    if (token1.selected.symbol === token2.selected.symbol) {
      message = "Invalid pair";
      disabled = true;
    } else if (!token1.selected.symbol || !token2.selected.symbol) {
      message = "Select both tokens";
      disabled = true;
    } else if (
      (_token1.eq("0") && token1.selected.symbol) ||
      (_token2.eq("0") && token2.selected.symbol)
    ) {
      message = "Enter amounts";
      disabled = true;
    } else if (
      _token1.gt("0") &&
      _token2.gt("0") &&
      token1.selected.symbol &&
      token2.selected.symbol
    ) {
      message = "Add liquidity ";
      disabled = false;
    }

    setStatus({ message, disabled });

    if (!disabled && currentPairAddress()) {
      debouncedPoolShareCall(
        currentPairAddress(),
        { ...selectedToken1, input: token1.value },
        { ...selectedToken2, input: token2.value },
        currentNetwork
      );
    }
  };

  const debouncedPoolShareCall = useCallback(
    debounce((...params) => getPoolShare(...params), 1000),
    [] // will be created only once initially
  );

  const debouncedGetLpBalance = useCallback(
    debounce((...params) => getLpBalance(...params), 1000),
    [] // will be created only once initially
  );

  // const getCurrentPairData = () => {
  //   const pairData = { abi: currentPairAbi(), address: currentPairAddress() };
  //   return pairData;
  // };

  const onToken1InputChange = async (tokens) => {
    setToken1Value(tokens);

    //calculate resetpective value of token 2 if selected
    let _token2Value = "";
    const pairAddress = currentPairAddress();

    if (selectedToken2.symbol && tokens && pairAddress) {
      await debouncedGetLpBalance(
        selectedToken1,
        selectedToken2,
        pairAddress,
        currentAccount,
        currentNetwork
      );

      _token2Value = getTokenOutWithReserveRatio(
        toWei(tokens),
        poolReserves[selectedToken2.symbol],
        poolReserves[selectedToken1.symbol],
      );
      if (new BigNumber(_token2Value).gt(0)) {
        setToken2Value(_token2Value);
        verifySwapStatus(
          { value: tokens, selected: selectedToken1 },
          { value: _token2Value, selected: selectedToken2 }
        );
      }
    } else if (selectedToken2.symbol && !tokens) {
      setToken2Value("");
      if (!addStatus.disabled) {
        setStatus({ disabled: true, message: "Enter Amounts" });
      }
    } else if (selectedToken2.symbol && tokens) {
      // setStatus({ disabled: false, message: "Add Liquidity" });
      verifySwapStatus(
        { value: tokens, selected: selectedToken1 },
        { value: token2Value, selected: selectedToken2 }
      );
    }
  };

  const onToken2InputChange = async (tokens) => {
    setToken2Value(tokens);

    let _token1Value = "";
    const pairAddress = currentPairAddress();

    if (selectedToken1.symbol && tokens && pairAddress) {
      await debouncedGetLpBalance(
        selectedToken1,
        selectedToken2,
        pairAddress,
        currentAccount,
        currentNetwork
      );

      _token1Value = getTokenOutWithReserveRatio(
        toWei(tokens),
        poolReserves[selectedToken1.symbol],
        poolReserves[selectedToken2.symbol],
      );
      if (new BigNumber(_token1Value).eq(0)) {
        verifySwapStatus(
          { value: token1Value, selected: selectedToken1 },
          { value: tokens, selected: selectedToken2 }
        );
      } else {
        setToken1Value(_token1Value);
        verifySwapStatus(
          { value: _token1Value, selected: selectedToken1 },
          { value: tokens, selected: selectedToken2 }
        );
      }
    } else if (selectedToken1.symbol && !tokens) {
      setToken1Value("");
      if (!addStatus.disabled) {
        setStatus({ disabled: true, message: "Enter Amounts" });
      }
    } else if (selectedToken1.symbol && tokens) {
      // setStatus({ disabled: false, message: "Add Liquidity" });
      verifySwapStatus(
        { value: token1Value, selected: selectedToken1 },
        { value: tokens, selected: selectedToken2 }
      );
    }
  };

  const resetInput = () => {
    setToken1Value("0");
    setToken2Value("0");
    store.dispatch({ type: RESET_POOL_SHARE });
  };

  const onToken1Select = (token) => {
    setToken1(token);
    resetInput();

    verifySwapStatus(
      { value: "0", selected: token },
      { value: "0", selected: selectedToken2 }
    );
  };
  const onToken2Select = (token) => {
    setToken2(token);
    resetInput();

    verifySwapStatus(
      { value: "0", selected: selectedToken1 },
      { value: "0", selected: token }
    );
  };

  const handleClearState = () => {
    resetInput();

    verifySwapStatus(
      { value: "", selected: selectedToken1 },
      { value: "", selected: selectedToken2 }
    );
  };

  const handleAddLiquidity = async () => {
    if (selectedToken1.symbol === ETH || selectedToken2.symbol === ETH) {
      let etherToken, erc20Token;
      if (selectedToken1.symbol === ETH) {
        etherToken = {
          ...selectedToken1,
          amount: token1Value,
        };

        const _amount = DECIMAL_6_ADDRESSES.includes(selectedToken2.address) ? toWei(token2Value, 6) : toWei(token2Value)
        erc20Token = {
          ...selectedToken2,
          amount: _amount,
        };

      } else {

        etherToken = {
          ...selectedToken2,
          amount: token2Value,
        };

        const _amount = DECIMAL_6_ADDRESSES.includes(selectedToken1.address) ? toWei(token1Value, 6) : toWei(token1Value)
        erc20Token = {
          ...selectedToken1,
          amount: _amount,
        };
      }

      await addLiquidityEth(
        etherToken,
        erc20Token,
        currentAccount,
        swapSettings.deadline,
        currentNetwork
      );
    } else {
      // addLiquidity

      const _amount1 = DECIMAL_6_ADDRESSES.includes(selectedToken1.address) ? toWei(token1Value, 6) : toWei(token1Value)
      const _amount2 = DECIMAL_6_ADDRESSES.includes(selectedToken2.address) ? toWei(token2Value, 6) : toWei(token1Value)
      await addLiquidity(
        { ...selectedToken1, amount: _amount1 },
        { ...selectedToken2, amount: _amount2 },
        currentAccount,
        swapSettings.deadline,
        currentNetwork
      );
    }

    await loadPairReserves()
  };

  const currentPoolShare = () => {
    if (
      !poolReserves[selectedToken1.symbol] ||
      !poolReserves[selectedToken2.symbol]
    ) {
      return "100";
    }
    const token1Amount = toWei(token1Value);
    const token1Reserves = new BigNumber(poolReserves[selectedToken1.symbol]);
    const share = getPercentage(
      token1Amount,
      token1Reserves.plus(token1Amount).toString()
    );
    return share;
  };

  const disableStatus = () => {
    return addStatus.disabled || loading || localStateLoading;
  };

  const handleAction = () => {
    if (currentTokenApprovalStatus()) {
      handleAddLiquidity();
    } else {
      handleConfirmAllowance();
    }
  };
  // const handleTokenPriceRatio = () => {};
  const currentButton = () => {
    if (localStateLoading) {
      return "Please wait...";
    } else if (addStatus.disabled) {
      return addStatus.message;
    } else {
      return !currentTokenApprovalStatus() ? "Approve" : addStatus.message;
    }
  };

  // liquidity transaction status updates
  useEffect(() => {
    if (!transaction.hash && !transaction.type) {
      return;
    }
    if (
      (transaction.type === "add" && transaction.status === "success") ||
      transaction.status === "failed"
    ) {
      // store.dispatch({ type: START_TRANSACTION })
      setSwapDialog(true);
    }
  }, [transaction]);

  const handleConfirmSwapClose = (value) => {
    setSwapDialog(value);
    if (
      transaction.type === "add" &&
      transaction.status === "success"
    ) {
      store.dispatch({ type: START_TRANSACTION });
      clearInputState();
    } else if (transaction.type === "add" && transaction.status === "failed") {
      store.dispatch({ type: START_TRANSACTION });
    }
  };

  return (
    <>
      <SwapSettings open={settingOpen} handleClose={close} />
      <SwapConfirm
        open={swapDialogOpen}
        handleClose={() => handleConfirmSwapClose(false)}
        selectedToken1={selectedToken1}
        selectedToken2={selectedToken2}
        token1Value={token1Value}
        token2Value={token2Value}
        priceImpact={0}
      />
      <Card elevation={20} className={classes.card}>
        <div className={classes.cardContents}>
          <div className={classes.cardHeading}>
            <IconButton onClick={handleBack} style={{ margin: 0, padding: 0 }}>
              <KeyboardBackspaceIcon
                fontSize="default"
                className={classes.settingIcon}
              />
            </IconButton>
            <h6 className={classes.title}>Add Liquidity</h6>
            <IconButton
              onClick={handleSettings}
              style={{ margin: 0, padding: 0 }}
            >
              <Settings fontSize="default" className={classes.settingIcon} />
            </IconButton>
          </div>

          <div className={classes.cardFeature}>
            <span className={classes.cardTitle}>Select pair</span>
            <span className={classes.clearButton} onClick={handleClearState}>
              Clear all
            </span>
          </div>

          <SwapCardItem
            onInputChange={onToken1InputChange}
            onTokenChange={onToken1Select}
            currentToken={selectedToken1}
            disableToken={selectedToken2}
            inputValue={token1Value}
          />
          <IconButton className={classes.iconButton}>
            <AddIcon fontSize="default" className={classes.addIcon} />
          </IconButton>

          <SwapCardItem
            onInputChange={onToken2InputChange}
            onTokenChange={onToken2Select}
            currentToken={selectedToken2}
            disableToken={selectedToken1}
            inputValue={token2Value}
          />

          {selectedToken1.symbol && selectedToken2.symbol ? (
            <div style={{ width: "95%"}}>
              <div className={classes.cardSubHeading}>
                <span className={classes.hintStyle}>Prices and Pool share</span>
              </div>

              <div className={classes.selectPoolContainer}>
                <div className={classes.feeSelectContainer}>
                  <div className={classes.feeSelectHeading}>
                    {getPriceRatio(token1Value, token2Value)}
                  </div>
                  <span className={classes.feeSelectHeadingSpan}>
                    {`${selectedToken1.symbol} per ${selectedToken2.symbol}`}
                  </span>
                </div>

                <div className={classes.feeSelectContainer}>
                  <div className={classes.feeSelectHeading}>
                    {getPriceRatio(token2Value, token1Value)}
                  </div>
                  <span className={classes.feeSelectHeadingSpan}>
                    {`${selectedToken2.symbol} per ${selectedToken1.symbol}`}
                  </span>
                </div>

                <div className={classes.feeSelectContainer}>
                  <div className={classes.feeSelectHeading}>
                    {`${currentPoolShare()}%`}
                  </div>
                  <span className={classes.feeSelectHeadingSpan}>
                    Share of pool
                  </span>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          <div style={{ marginBottom: 10, width: "95%" }}>
            <span className={classes.hintStyle}>
              By adding liquidity you'll earn 0.2% of all trades on this pair
              proportional to your share of the pool.
            </span>
          </div>

          <Button
            variant="contained"
            disabled={disableStatus()}
            onClick={handleAction}
            className={classes.addLiquidityButton}
          >
            {!addStatus.disabled && loading ? (
              <span>
                {transaction.status === "pending" && "Transaction Pending"}

                <CircularProgress
                  style={{ color: "grey" }}
                  color="secondary"
                  size={30}
                />
              </span>
            ) : (
              currentButton()
            )}
          </Button>
        </div>
      </Card>
    </>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
  dex: state.dex,
});

export default connect(mapStateToProps, {
  addLiquidityEth,
  checkAllowance,
  confirmAllowance,
  getPoolShare,
  getLpBalance,
  loadPairAddress,
  getAccountBalance,
  addLiquidity,
})(AddCard);
