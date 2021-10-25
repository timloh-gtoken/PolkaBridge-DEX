import React, { useEffect } from "react";
import useStyles from "./styles";
import TopTokens from "./TopTokens";
import BarChart from "./BarChart";
import AreaChart from "./AreaChart";
import PercentLabel from "../../common/PercentLabel";
import { Card } from "@material-ui/core";
import {
  useGlobalChartData,
  useGlobalData,
  useGlobalTransactions,
} from "../../../contexts/GlobalData";
import { formattedPercent } from "../../../utils/timeUtils";
import { useAllTokenData } from "../../../contexts/TokenData";
import { useAllPairData } from "../../../contexts/PairData";
import Loader from "../../common/Loader";
import TabPage from "../../TabPage";
import { formatCurrency } from "../../../utils/formatters";
import BigNumber from "bignumber.js";
// import makeStyles from "@material-ui/core/styles/makeStyles";

const Analytics = () => {
  const classes = useStyles();
  const allPairs = useAllPairData();
  const allTokens = useAllTokenData();
  const transactions = useGlobalTransactions();
  const globalData = useGlobalData();

  const chartData = useGlobalChartData();

  useEffect(() => {
    console.log("analyticsTest:  globalData load ", globalData);
  }, [globalData]);
  return (
    <div className={classes.responsive}>
      <div className="mb-3">
        <TabPage data={2} />
      </div>
      <h3 className={classes.heading}>PolkaBridge DEX Overview</h3>

      <div className="mt-2 row g-3" style={{ padding: 10 }}>
        <div className="col-md-6">
          <Card elevation={10} className={classes.card}>
            {chartData && globalData && (
              <div>
                <span className={classes.cardSpan}>Total value locked</span>
                <p className={classes.cardP}>
                  {"$" +
                    formatCurrency(globalData.totalLiquidityUSD)}
                  <small>
                    {formattedPercent(globalData.liquidityChangeUSD)}
                  </small>
                </p>
                <div className={classes.chart}>
                  <AreaChart chartData={chartData ? chartData[0] : []} />
                </div>
              </div>
            )}
            {!globalData && (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "100%" }}
              >
                <Loader />
              </div>
            )}
          </Card>
        </div>
        <div className="col-md-6">
          <Card elevation={10} className={classes.card}>
            {globalData !== null && (
              <div>
                <span className={classes.cardSpan}>Volume 24H</span>
                <p className={classes.cardP}>
                  {"$" +
                    formatCurrency(globalData.oneDayVolumeUSD)
                  }
                  <small>
                    {formattedPercent(globalData.volumeChangeUSD)}
                  </small>
                </p>
                <div className={classes.chart}>
                  <BarChart chartData={chartData ? chartData[0] : []} />
                </div>
              </div>
            )}
            {!globalData && (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "100%" }}
              >
                <Loader />
              </div>
            )}
          </Card>
        </div>
      </div>
      <div style={{ padding: 10 }}>
        {globalData && (
          <Card elevetation={10} className={classes.priceStatContainer}>
            <div className={classes.statsGroup}>
              <span className={classes.statLabel}>Volume 24H:</span>
              <span className={classes.statAmount}>
                $ {formatCurrency(new BigNumber(globalData.oneDayVolumeUSD))}
              </span>

              <PercentLabel
                percentValue={globalData.volumeChangeUSD}
                braces={true}
              />
            </div>

            <div className={classes.statsGroup}>
              <span className={classes.statLabel}>Fees 24H:</span>
              <span className={classes.statAmount}>
                ${" "}
                {formatCurrency(
                  globalData.oneDayVolumeUSD * 0.02
                )}
              </span>

              <PercentLabel
                percentValue={globalData.volumeChangeUSD}
                braces={true}
              />
            </div>

            <div className={classes.statsGroup}>
              <span className={classes.statLabel}>TVL</span>
              <span className={classes.statAmount}>
                {"$" +
                  formatCurrency(globalData.totalLiquidityUSD)}
              </span>

              <PercentLabel
                percentValue={globalData.liquidityChangeUSD}
                braces={true}
              />
            </div>
          </Card>
        )}
      </div>

      <div className={classes.tokenList}>
        <div style={{ padding: 10 }}>
          <div className={classes.tokenListHeading}>Top Tokens</div>
          <TopTokens
            tableType="TopTokens"
            allTokens={allTokens ? allTokens : {}}
          />
        </div>
      </div>

      <div className={classes.tokenList}>
        <div style={{ padding: 10 }}>
          <div className={classes.tokenListHeading}>Top Pools</div>
          <TopTokens tableType="TopPools" allPairs={allPairs ? allPairs : {}} />
        </div>
      </div>

      <div className={classes.tokenList}>
        <div style={{ padding: 10 }}>
          <div className={classes.tokenListHeading}>Transactions</div>
          <TopTokens
            tableType="Transactions"
            allTransactions={transactions ? transactions : {}}
          />
        </div>
      </div>
      <div className="mb-5"></div>
      {/* 

    
    */}
    </div>
  );
};

export default Analytics;
