import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useSelector } from "react-redux";

import styles from "../css-modules/AnalyticsModal.module.css";

const GroupInfoModal = ({
  show,
  onHide,
  groupInfo,
  selectedGroupId,
  loading,
  error,
  loggedInMemberId,
  onBudgetChange,
}) => {
  const [budget, setBudget] = useState("");
  const budgetInfo = groupInfo?.budgetInfo;

  const membersAccountDetailsList = groupInfo?.membersAccountDetailsList || [];

  const loggedinUserInfo = useSelector((state) => state.user.userInfo);

  const originalBudget =
    budgetInfo?.budget == null ? "" : Number(budgetInfo.budget);
  const currentBudget = budget === "" ? "" : Number(budget);

  const isUnchanged = originalBudget === currentBudget;

  useEffect(() => {
    if (budgetInfo) {
      setBudget(budgetInfo.budget ?? "");
    }
  }, [budgetInfo]);

  const handleBudgetChange = () => {
    if (isUnchanged) return;

    onBudgetChange(loggedInMemberId, budget);
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Group Info</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Budget section */}
        <section>
          <h4 className={styles.sectionTitle}>Budget</h4>

          <div className={styles.budgetContainer}>
            <label htmlFor="budgetInput" className={styles.budgetLabel}>
              Your Budget
            </label>

            <input
              type="number"
              value={budget}
              id="budgetInput"
              onChange={(e) => setBudget(e.target.value)}
              className={styles.budgetInput}
            />

            <Button
              variant="primary"
              onClick={handleBudgetChange}
              disabled={loading || budget === "" || isUnchanged}
              className={styles.budgetButton}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    className={styles.spinner}
                  />
                  Updating...
                </>
              ) : (
                "Change"
              )}
            </Button>
          </div>

          {error && <p className="text-danger mt-2">{error}</p>}
        </section>

        {/* Accounts info section */}
        <section className={styles.accountsSection}>
          <h4 className={styles.sectionTitle}>Members Account Information</h4>

          {membersAccountDetailsList.length === 0 ? (
            <p className={styles.noAccount}>
              No account information available.
            </p>
          ) : (
            <div className={styles.accountsList}>
              {membersAccountDetailsList.map((member) => (
                <div key={member.member_id} className={styles.accountCard}>
                  <h5 className={styles.memberName}>
                    {member.user_id === loggedinUserInfo?.id
                      ? "Yours"
                      : member.username}
                  </h5>

                  {member.account_type ? (
                    <>
                      <div className={styles.accountDetail}>
                        <span className={styles.accountLabel}>
                          Account Type:
                        </span>
                        <span className={styles.accountValue}>
                          {member.account_type}
                        </span>
                      </div>

                      <div className={styles.accountDetail}>
                        <span className={styles.accountLabel}>
                          Account Title:
                        </span>
                        <span className={styles.accountValue}>
                          {member.account_title || "Not provided"}
                        </span>
                      </div>

                      <div className={styles.accountDetail}>
                        <span className={styles.accountLabel}>
                          Account Number:
                        </span>
                        <span className={styles.accountValue}>
                          {member.account_number || "Not provided"}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className={styles.noAccount}>
                      No account information provided.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
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

export default GroupInfoModal;
