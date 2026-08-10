import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import styles from "../css-modules/SettlementModal.module.css";
import { useSelector } from "react-redux";

const SettlementModal = ({ show, onHide, settlements, loading, error }) => {
  const loggedinUserInfo = useSelector((state) => state.user.userInfo);

  return (
    <Modal show={show} onHide={onHide} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Optimized Settlements</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Loading */}
        {loading && (
          <div className={styles.messageContainer}>
            <Spinner
              animation="border"
              role="status"
              className={styles.spinner}
            />

            <p>Calculating optimized settlements...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className={styles.errorContainer}>
            <p>{error}</p>
          </div>
        )}

        {/* No settlements */}
        {!loading && !error && settlements?.length === 0 && (
          <div className={styles.messageContainer}>
            <p className={styles.successMessage}>Everyone is settled up!</p>

            <p>No payments are required at this time.</p>
          </div>
        )}

        {/* Settlements */}
        {!loading && !error && settlements?.length > 0 && (
          <div className={styles.settlementContainer}>
            <p className={styles.description}>
              The following payments will minimize the number of transactions
              needed to settle all group debts.
            </p>

            {settlements.map((settlement, index) => {
              const isLoggedinUserPayer =
                loggedinUserInfo &&
                settlement.from_user_id === loggedinUserInfo.id;

              const isLoggedinUserReciever =
                loggedinUserInfo &&
                settlement.to_user_id === loggedinUserInfo.id;

              return (
                <div
                  key={`${settlement.from_member_id}-${settlement.to_member_id}-${index}`}
                  className={`${styles.settlementItem} ${isLoggedinUserPayer ? styles.settlementItemRed : isLoggedinUserReciever ? styles.settlementItemGreen : ""}`}
                >
                  <div className={styles.memberInfo}>
                    <span className={styles.memberName}>
                      {loggedinUserInfo &&
                      settlement.from_user_id === loggedinUserInfo.id
                        ? "You"
                        : settlement.from_member_name}
                    </span>

                    <span className={styles.paysText}>
                      {loggedinUserInfo &&
                      settlement.from_user_id === loggedinUserInfo.id
                        ? "pay"
                        : "pays"}
                    </span>

                    <span className={styles.memberName}>
                      {loggedinUserInfo &&
                      settlement.to_user_id === loggedinUserInfo.id
                        ? "You"
                        : settlement.to_member_name}
                    </span>
                  </div>

                  <div className={styles.amount}>
                    Rs. {Number(settlement.amount).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
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

export default SettlementModal;
