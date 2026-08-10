import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import styles from "../css-modules/ExpenseAnalytics.module.css";

const CATEGORY_COLORS = {
  "Food & Dining": "var(--leading-color)",
  Transportation: "#36A2EB",
  Shopping: "#FFCE56",
  Groceries: "#4BC0C0",
  "Bills & Utilities": "#9966FF",
  Healthcare: "#FF9F40",
  Entertainment: "#9B59B6",
  Education: "#2ECC71",
  Travel: "#E67E22",
  Miscellaneous: "#95A5A6",
};

const FALLBACK_CATEGORY_COLOR = "#8884D8";

const ExpenseAnalyticsChart = ({
  data,
  type,
  period,
  windowStart,
  windowEnd,
  loading,
}) => {
  // helper function to format date and time
  const formatDateTime = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  };

  //   helper function to format period for display
  const formatPeriod = (periodKey) => {
    const date = new Date(periodKey.replace(" ", "T"));

    if (period === "hourly") {
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    }

    if (period === "daily") {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }

    if (period === "weekly") {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }

    if (period === "monthly") {
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    }

    return periodKey;
  };

  if (loading) {
    return <div className={styles.chartMessage}>Loading analytics...</div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className={styles.chartMessage}>
        <p>
          No expense data available for
          <br />
          <strong>
            {formatDateTime(windowStart)}
            {" — "}
            {formatDateTime(windowEnd)}
          </strong>
        </p>
      </div>
    );
  }

  /*
    Overall chart
  */

  if (type === "overall") {
    return (
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            {/* <CartesianGrid strokeDasharray="3 3" /> */}

            <XAxis dataKey="period_key" tickFormatter={formatPeriod} />

            <YAxis />

            <Tooltip
              labelFormatter={(label) => formatPeriod(label)}
              formatter={(value) => [
                `Rs. ${Number(value).toFixed(2)}`,
                "Amount",
              ]}
            />

            <Bar
              dataKey="total_amount"
              radius={[10, 10, 0, 0]}
              maxBarSize={80}
              fill={"var(--leading-color)"}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  /*
    Category-wise chart
  */

  const categories = [...new Set(data.map((item) => item.category))];

  const groupedData = [];

  data.forEach((item) => {
    let existing = groupedData.find(
      (entry) => entry.period_key === item.period_key,
    );

    if (!existing) {
      existing = {
        period_key: item.period_key,
      };

      groupedData.push(existing);
    }

    existing[item.category] = Number(item.total_amount);
  });

  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={groupedData}>
          {/* <CartesianGrid strokeDasharray="3 3" /> */}

          <XAxis dataKey="period_key" tickFormatter={formatPeriod} />

          <YAxis />

          <Tooltip
            labelFormatter={(label) => formatPeriod(label)}
            formatter={(value, name) => [
              `Rs. ${Number(value).toFixed(2)}`,
              name,
            ]}
          />

          <Legend />

          {categories.map((category, index) => (
            <Bar
              key={category + index}
              dataKey={category}
              stackId="a"
              maxBarSize={80}
              fill={CATEGORY_COLORS[category] || FALLBACK_CATEGORY_COLOR}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseAnalyticsChart;
