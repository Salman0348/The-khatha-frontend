import { useEffect, useState } from "react";

import ExpenseAnalyticsChart from "./ExpenseAnalyticsChart";

import { getExpenseAnalytics } from "../apis.js";

import {
  getInitialWindowStart,
  getWindowEnd,
  moveWindow,
  formatDateTime,
  getWindowSizeLabel,
} from "../../utils/analyticsDate.utils.js";

import styles from "../css-modules/ExpenseAnalytics.module.css";

const ExpenseAnalytics = ({ show, groupId }) => {
  const [analyticsType, setAnalyticsType] = useState("overall");

  const [analyticsPeriod, setAnalyticsPeriod] = useState("daily");

  const [windowStart, setWindowStart] = useState(
    getInitialWindowStart("daily"),
  );

  const [analyticsData, setAnalyticsData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  /*
    Reset the window when period changes
  */

  const handlePeriodChange = (newPeriod) => {
    setAnalyticsPeriod(newPeriod);

    setWindowStart(getInitialWindowStart(newPeriod));
  };

  /*
    Fetch analytics
  */

  useEffect(() => {
    if (!show || !groupId) {
      return;
    }

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const windowEnd = getWindowEnd(windowStart, analyticsPeriod);

        const now = new Date();

        /*
            Never request beyond
            current date/time.
          */

        const finalEnd = windowEnd > now ? now : windowEnd;

        const response = await getExpenseAnalytics({
          groupId,
          type: analyticsType,
          period: analyticsPeriod,
          startDateTime: formatDateTime(windowStart),
          endDateTime: formatDateTime(finalEnd),
        });

        setAnalyticsData(response.data);
      } catch (error) {
        setError(error.response?.data?.error || "Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [show, groupId, analyticsType, analyticsPeriod, windowStart]);

  /*
    Previous
  */

  const handlePrevious = () => {
    const oneYearAgo = new Date();

    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const previousStart = moveWindow(windowStart, analyticsPeriod, "previous");

    if (previousStart < oneYearAgo) {
      return;
    }

    setWindowStart(previousStart);
  };

  // helper function to get the date one year ago from today
  const getOneYearAgo = () => {
    const date = new Date();

    date.setFullYear(date.getFullYear() - 1);

    return date;
  };

  const isPreviousDisabled =
    moveWindow(windowStart, analyticsPeriod, "previous") < getOneYearAgo();

  /*
    Next
  */

  const handleNext = () => {
    const nextStart = moveWindow(windowStart, analyticsPeriod, "next");

    const now = new Date();

    /*
      Don't allow the start
      of the next window to
      be in the future.
    */

    if (nextStart > now) {
      return;
    }

    setWindowStart(nextStart);
  };

  /*
    Disable Next when
    current window has
    reached current time.
  */

  const windowEnd = getWindowEnd(windowStart, analyticsPeriod);

  const isNextDisabled = windowEnd >= new Date();

  return (
    <section className={styles.analyticsSection}>
      <div className={styles.analyticsHeader}>
        <h5>Expense Analytics</h5>

        <div className={styles.filterContainer}>
          <select
            value={analyticsType}
            onChange={(e) => {
              setAnalyticsType(e.target.value);

              setWindowStart(getInitialWindowStart(analyticsPeriod));
            }}
          >
            <option value="overall">Overall Expenses</option>

            <option value="category">Category Wise</option>
          </select>

          <select
            value={analyticsPeriod}
            onChange={(e) => handlePeriodChange(e.target.value)}
          >
            <option value="hourly">Hourly</option>

            <option value="daily">Daily</option>

            <option value="weekly">Weekly</option>

            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      <div className={styles.navigationContainer}>
        <button onClick={handlePrevious} disabled={isPreviousDisabled}>
          ← Previous
        </button>

        <span>{getWindowSizeLabel(analyticsPeriod)}</span>

        <button onClick={handleNext} disabled={isNextDisabled}>
          Next →
        </button>
      </div>

      {error && <div className={styles.errorContainer}>{error}</div>}

      {!error && (
        <ExpenseAnalyticsChart
          data={analyticsData}
          type={analyticsType}
          period={analyticsPeriod}
          windowStart={windowStart}
          windowEnd={windowEnd}
          loading={loading}
        />
      )}
    </section>
  );
};

export default ExpenseAnalytics;
