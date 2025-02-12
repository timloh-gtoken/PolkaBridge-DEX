import React, { useEffect } from "react";
import useStyles from "./styles";
import BarChart from "./components/Charts/BarChart";
import AreaChart from "./components/Charts/AreaChart";
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
import TopTokensTable from "./components/Tables/TopTokensTable";
import TopPoolsTable from "./components/Tables/TopPoolsTable";
import Transactions from "./components/Tables/TransactionsTable";
import { Link } from "react-router-dom";

const Analytics = () => {
  const classes = useStyles();
  const allPairs = useAllPairData();
  const allTokens = useAllTokenData();
  const transactions = useGlobalTransactions();
  const globalData = useGlobalData();

  const chartData = useGlobalChartData();

  // useEffect(() => {
  //   if (!transactions) {
  //     return
  //   }

  //   console.log("analyticsTest  ", { transactions });
  // }, [transactions]);

  return (
    <div>
      <div className="mb-3 d-flex justify-content-center">
        <TabPage data={3} />
      </div>
      {/* <h3 className={classes.heading}>PolkaBridge DEX Overview</h3> */}
      <div className="mt-2 row g-3" style={{ padding: 10 }}>
        <div className="col-md-6">
          <Card elevation={10} className={classes.card}>
            {chartData && globalData && (
              <div>
                <span className={classes.cardSpan}>Total value locked</span>
                <div className="d-flex justify-content-start align-items-center">
                  <p className={classes.cardP}>
                    {"$" +
                      formatCurrency(
                        !globalData ? "0" : globalData.totalLiquidityUSD
                      )}
                  </p>
                  <p
                    className={classes.cardP}
                    style={{ fontSize: 17, paddingLeft: 12 }}
                  >
                    {formattedPercent(
                      !globalData ? "0" : globalData.liquidityChangeUSD
                    )}
                  </p>
                </div>
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
                <div className="d-flex justify-content-start align-items-center">
                  <p className={classes.cardP}>
                    {"$" +
                      formatCurrency(
                        !globalData
                          ? "0"
                          : isNaN(globalData.oneDayVolumeUSD)
                          ? globalData.totalVolumeUSD
                          : globalData.oneDayVolumeUSD
                      )}
                  </p>
                  <p
                    className={classes.cardP}
                    style={{ fontSize: 17, paddingLeft: 12 }}
                  >
                    {formattedPercent(
                      !globalData ? "0" : globalData.volumeChangeUSD
                    )}
                  </p>
                </div>

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
          <Card elevation={10} className={classes.priceStatContainer}>
            <div className={classes.statsGroup}>
              <span className={classes.statLabel}>Volume 24H:</span>
              <div className="d-flex align-items-center justify-content-end">
                <span className={classes.statAmount}>
                  $
                  {formatCurrency(
                    isNaN(globalData.oneDayVolumeUSD)
                      ? globalData.totalVolumeUSD
                      : globalData.oneDayVolumeUSD
                  )}
                </span>

                <PercentLabel
                  percentValue={globalData.volumeChangeUSD}
                  braces={true}
                />
              </div>
            </div>

            <div className={classes.statsGroup}>
              <div>
                <span className={classes.statLabel}>Fees 24H:</span>
              </div>
              <div className="d-flex align-items-center justify-content-end">
                <div className={classes.statAmount}>
                  $
                  {formatCurrency(
                    (isNaN(globalData.oneDayVolumeUSD)
                      ? globalData.totalVolumeUSD
                      : globalData.oneDayVolumeUSD) * 0.02
                  )}
                </div>

                <div>
                  <PercentLabel
                    percentValue={globalData.volumeChangeUSD}
                    braces={true}
                  />
                </div>
              </div>
            </div>

            <div className={classes.statsGroup}>
              <span className={classes.statLabel}>TVL: </span>
              <div className="d-flex align-items-center justify-content-end">
                <span className={classes.statAmount}>
                  {"$" + formatCurrency(globalData.totalLiquidityUSD)}
                </span>

                <PercentLabel
                  percentValue={globalData.liquidityChangeUSD}
                  braces={true}
                />
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="p-2">
        <div className="d-flex justify-content-between">
          <div className={classes.tokenListHeading}>Top Tokens</div>
          <div
            className="d-flex-end"
            style={{
              fontSize: 13,
              color: "#bdbdbd",
              marginTop: 35,
              marginBottom: 10,
              paddingLeft: 2,
              fontWeight: 500,
              letterSpacing: 0.7,
              cursor: "pointer",
              minWidth: 100,
              textAlign: "right",
            }}
          >
            <Link to="charts/tokens">View All</Link>
          </div>
        </div>
        <div className="d-flex justify-content-center ">
          <TopTokensTable data={allTokens} />
        </div>
      </div>

      <div className="p-2">
        <div className="d-flex justify-content-between">
          <div className={classes.tokenListHeading}>Top Pool</div>
          <div
            className="d-flex-end"
            style={{
              fontSize: 13,
              color: "#bdbdbd",
              marginTop: 35,
              marginBottom: 10,
              paddingLeft: 2,
              fontWeight: 500,
              letterSpacing: 0.7,
              cursor: "pointer",
              minWidth: 100,
              textAlign: "right",
            }}
          >
            <Link to="charts/pools">View All</Link>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <TopPoolsTable data={allPairs} />
        </div>
      </div>

      <div className="p-2">
        <div className={classes.tokenListHeading}>Transactions</div>
        <div className="d-flex justify-content-center">
          <Transactions data={transactions} />
        </div>
      </div>
      {/* <div className="d-flex justify-content-center pt-10">
        <div className={classes.tokenListHeading}>

          Chart is unavailable,
          will be available soon.</div>
      </div> */}
    </div>
  );
};

export default Analytics;
