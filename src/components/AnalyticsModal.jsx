import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import styles from "../css-modules/AnalyticsModal.module.css";
import ExpenseAnalytics from "./ExpenseAnalytics";

const AnalyticsModal = ({
  show,
  onHide,
  expenseForecast,
  selectedGroupId,
  loading,
  error,
}) => {
  const { forecast, forecastFeatures } = expenseForecast || {};
  const groupId = selectedGroupId;

  return (
    <Modal show={show} onHide={onHide} backdrop="static" centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Expense Forecast & Analytics</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* =========================================
            CURRENT MONTH EXPENSE FORECAST
        ========================================== */}
        <section className={styles.forecastSection}>
          <h5 className={styles.sectionTitle}>
            Current Month Expense Forecast
          </h5>

          {/* Loading */}
          {loading && (
            <div className={styles.messageContainer}>
              <Spinner
                animation="border"
                role="status"
                className={styles.spinner}
              />

              <p>Calculating your expense forecast...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className={styles.errorContainer}>
              <p>{error}</p>
            </div>
          )}

          {/* Forecast */}
          {!loading && !error && expenseForecast && (
            <div className={styles.forecastContainer}>
              {/* Predicted Expense */}
              <div className={styles.forecastCard}>
                <span className={styles.cardLabel}>
                  Predicted Monthly Expense
                </span>

                <span className={styles.cardValue}>
                  Rs.{" "}
                  {Number(forecast?.expected_monthly_spending).toLocaleString(
                    "en-PK",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}
                  <div className={styles.aiLabelDiv}>
                    <span>AI Forecast</span>
                  </div>
                </span>
              </div>

              {/* Current Expense */}
              <div className={styles.forecastCard}>
                <span className={styles.cardLabel}>Current Month Spending</span>

                <span className={styles.cardValue}>
                  Rs.{" "}
                  {Number(
                    forecastFeatures?.current_month_spending,
                  ).toLocaleString("en-PK", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              {/* Historical Average */}
              <div className={styles.forecastCard}>
                <span className={styles.cardLabel}>
                  Average (Last 3 Months)
                </span>

                <span className={styles.cardValue}>
                  Rs.{" "}
                  {Number(
                    forecastFeatures?.average_last_3_months,
                  ).toLocaleString("en-PK", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              {/* Remaining Days */}
              <div className={styles.forecastCard}>
                <span className={styles.cardLabel}>Days Remaining</span>

                <span className={styles.cardValue}>
                  {forecastFeatures?.days_remaining}
                </span>
              </div>
            </div>
          )}
        </section>

        {/* =========================================
            EXPENSE ANALYTICS
        ========================================== */}

        <ExpenseAnalytics show={show} groupId={groupId} />
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onHide}
          className={styles.closeBtn}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AnalyticsModal;
