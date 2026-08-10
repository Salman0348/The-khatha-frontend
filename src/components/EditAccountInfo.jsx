import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { toast } from "react-toastify";

import styles from "../css-modules/AccountModal.module.css";

const EditAccountInfo = ({ setIsOpen }) => {
  const [account, setAccount] = useState(null);
  const [show, setShow] = useState(false);

  const [accountType, setAccountType] = useState("");
  const [accountTitle, setAccountTitle] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const [accountLoading, setAccountLoading] = useState(false);
  const [accountError, setAccountError] = useState("");

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const getAccount = async () => {
    try {
      setAccountLoading(true);
      setAccountError("");

      const response = await axios.get(`${baseURL}/api/v1/account`, {
        withCredentials: true,
      });

      const accountData = response.data.data;

      setAccount(accountData);

      setAccountType(accountData?.account_type || "");
      setAccountTitle(accountData?.account_title || "");
      setAccountNumber(accountData?.account_number || "");
    } catch (error) {
      setAccountError(
        error.response?.data?.error || "Unable to fetch account.",
      );
    } finally {
      setAccountLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    if (!accountType || !accountTitle || !accountNumber) {
      setAccountError("All account fields are required.");
      return;
    }

    try {
      setAccountLoading(true);
      setAccountError("");

      await axios.post(
        `${baseURL}/api/v1/account`,
        {
          accountType,
          accountTitle,
          accountNumber,
        },
        {
          withCredentials: true,
        },
      );

      await getAccount();

      toast.success("Account Info saved successfully", {
        closeButton: true,
        autoClose: 5000,
      });
    } catch (error) {
      setAccountError(
        error.response?.data?.error || "Unable to create account.",
      );

      toast.error("Error while saving your account info", {
        closeButton: true,
        autoClose: 5000,
      });
    } finally {
      setAccountLoading(false);
    }
  };

  const handleUpdateAccount = async () => {
    if (!accountType || !accountTitle || !accountNumber) {
      setAccountError("All account fields are required.");
      return;
    }

    if (!hasAccountChanged) {
      return;
    }

    try {
      setAccountLoading(true);
      setAccountError("");

      await axios.put(
        `${baseURL}/api/v1/account`,
        {
          accountType,
          accountTitle,
          accountNumber,
        },
        {
          withCredentials: true,
        },
      );

      await getAccount();

      toast.success("Account Info updated successfully", {
        closeButton: true,
        autoClose: 5000,
      });
    } catch (error) {
      setAccountError(
        error.response?.data?.error || "Unable to update account.",
      );

      toast.error("Error while updating your account info", {
        closeButton: true,
        autoClose: 5000,
      });
    } finally {
      setAccountLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setAccountLoading(true);
      setAccountError("");

      await axios.delete(`${baseURL}/api/v1/account`, {
        withCredentials: true,
      });

      setAccount(null);
      setAccountType("");
      setAccountTitle("");
      setAccountNumber("");

      toast.success("Account Info deleted successfully", {
        closeButton: true,
        autoClose: 5000,
      });
    } catch (error) {
      setAccountError(
        error.response?.data?.error || "Unable to delete account.",
      );

      toast.error("Error while deleting your account info.", {
        closeButton: true,
        autoClose: 5000,
      });
    } finally {
      setAccountLoading(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    setAccountError("");
    setAccount(null);
    setAccountType("");
    setAccountTitle("");
    setAccountNumber("");
  };

  const handleShow = () => setShow(true);

  useEffect(() => {
    if (show) {
      getAccount();
    }
  }, [show]);

  const hasAccountChanged =
    account &&
    (accountType !== (account.account_type || "") ||
      accountTitle !== (account.account_title || "") ||
      accountNumber !== (account.account_number || ""));

  return (
    <>
      <div
        onClick={() => {
          handleShow();
          setIsOpen((prev) => !prev);
        }}
        className={styles.creatBtnTxt}
        style={{
          backgroundColor: "var(--white-color)",
          color: "black",
          cursor: "pointer",
        }}
      >
        Edit Account Info
      </div>

      <Modal show={show} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>Your Account Information</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {accountLoading && !account ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" size="sm" />
            </div>
          ) : (
            <>
              <div className={styles.accountForm}>
                <div className={styles.accountInput}>
                  <label>Account Type</label>

                  <input
                    type="text"
                    value={accountType}
                    onChange={(e) => {
                      setAccountType(e.target.value);
                      setAccountError("");
                    }}
                    placeholder="e.g. Easypaisa"
                  />
                </div>

                <div className={styles.accountInput}>
                  <label>Account Title</label>

                  <input
                    type="text"
                    value={accountTitle}
                    onChange={(e) => {
                      setAccountTitle(e.target.value);
                      setAccountError("");
                    }}
                    placeholder="Account title"
                  />
                </div>

                <div className={styles.accountInput}>
                  <label>Account Number</label>

                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => {
                      setAccountNumber(e.target.value);
                      setAccountError("");
                    }}
                    placeholder="Account number"
                  />
                </div>
              </div>

              {accountError && (
                <p className={styles.accountError}>{accountError}</p>
              )}

              <div className={styles.accountActions}>
                {account ? (
                  <>
                    <Button
                      variant="primary"
                      onClick={handleUpdateAccount}
                      disabled={accountLoading || !hasAccountChanged}
                    >
                      {accountLoading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            className="me-2"
                          />
                          Updating...
                        </>
                      ) : (
                        "Update"
                      )}
                    </Button>

                    <Button
                      variant="danger"
                      onClick={handleDeleteAccount}
                      disabled={accountLoading}
                    >
                      {accountLoading ? "Deleting..." : "Delete"}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleCreateAccount}
                    disabled={
                      accountLoading ||
                      !accountType ||
                      !accountTitle ||
                      !accountNumber
                    }
                  >
                    {accountLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Creating...
                      </>
                    ) : (
                      "Add Account"
                    )}
                  </Button>
                )}
              </div>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
            className={styles.closeBtn}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditAccountInfo;
