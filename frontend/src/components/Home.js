import React, { useEffect } from "react";
import { connect } from "react-redux";
import store from "../store";

import { getNetworkNameById } from "../utils/helper";
import { CHANGE_NETWORK, CONNECT_WALLET } from "../actions/types";
import { loadTokens } from "../actions/dexActions";
import { getAccountBalance } from "../actions/accountActions";
import { useWeb3React } from "@web3-react/core";

const Home = ({ loadTokens, getAccountBalance }) => {
  const { active, account, chainId } = useWeb3React();

  useEffect(() => {
    if (!chainId || !active) {
      return;
    }

    const _network = getNetworkNameById(chainId);

    store.dispatch({
      type: CONNECT_WALLET,
      payload: account,
    });
    store.dispatch({
      type: CHANGE_NETWORK,
      payload: _network,
    });

    getAccountBalance(account, _network);
    loadTokens(_network);
  }, [chainId, active, account]);

  useEffect(() => {
    async function onNetworkChangeUpdate() {
      if (typeof window.web3 !== "undefined") {
        window.ethereum.on("accountsChanged", async (accounts) => {
          if (accounts.length === 0) {
            localStorage.connected = "none";
            return;
          }
        });

        window.ethereum.on("disconnect", (error) => {
          console.log("disconnected ", error);
          localStorage.connected = "none";
        });
      }
    }
    onNetworkChangeUpdate();
  }, []);

  return <></>;
};

export default connect(null, {
  loadTokens,
  getAccountBalance,
})(Home);
