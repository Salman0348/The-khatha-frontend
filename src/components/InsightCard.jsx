import { FaArrowTrendUp } from "react-icons/fa6";
import { MdAccountBalanceWallet } from "react-icons/md";
import { IoFastFood } from "react-icons/io5";
import { RiSpeedUpFill } from "react-icons/ri";
import { FaCircleCheck } from "react-icons/fa6";

import styles from "../css-modules/InsightCard.module.css";

const titleMap = {
  overspending: "Overspending Alert",
  budget_warning: "Budget Warning",
  category_dominance: "Category Dominance",
  velocity_alert: "Spending Velocity",
  positive: "Looking Good",
};

const iconMap = {
  overspending: FaArrowTrendUp,
  budget_warning: MdAccountBalanceWallet,
  category_dominance: IoFastFood,
  velocity_alert: RiSpeedUpFill,
  positive: FaCircleCheck,
};

const severityClass = {
  high: styles.high,
  medium: styles.medium,
  low: styles.low,
};

const InsightCard = ({ insight, insightsInfo }) => {
  const Icon = iconMap[insight.type] || FaCircleCheck;

  //   extra logic for budget warning
  const forecast = insightsInfo?.forecast?.expected_monthly_spending ?? 0;

  const budget = insightsInfo?.metrics?.budget;

  let message = insight.message;

  if (insight.type === "budget_warning" && budget != null) {
    const exceededAmount = forecast - budget;

    message = (
      <>
        You are likely to exceed your budget by{" "}
        <span className={styles.exceededAmountSpan}>
          Rs. {Math.round(exceededAmount).toLocaleString()}
        </span>
      </>
    );
  }

  return (
    <div
      className={`${styles.card} ${
        severityClass[insight.severity] || styles.low
      }`}
    >
      <div className={styles.header}>
        <Icon className={styles.icon} />

        <h6>{titleMap[insight.type] || "Insight"}</h6>
      </div>

      <p>{message}</p>
    </div>
  );
};

export default InsightCard;
