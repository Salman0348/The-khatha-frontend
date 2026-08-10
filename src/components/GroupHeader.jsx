import { HiUsers } from "react-icons/hi";
import styles from "../css-modules/GroupHeader.module.css";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { fetchInsights } from "../apis";
import InsightCard from "./InsightCard";

import { useEffect, useRef, useState } from "react";

const GroupHeader = ({
  selectedGroupName,
  selectedGroupPic,
  selectedGroupId,
  handleSelectedGroup,
  showHistory,
  toggleHistory,
  fetchtHistoryEntries,
  handleMinimizeDebts,
  getAnalytics,
  getGroupInfo,
  selectedGrouploggedinUserMemberId: loggedinMemberId,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const [insightsInfo, setInsightsInfo] = useState([]);
  const insightRecommendations = insightsInfo?.recommendations || null;

  const [showInsights, setShowInsights] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState("");

  const menuRef = useRef();
  const insightsRef = useRef();

  const handleToggleHistory = () => {
    toggleHistory();
    if (!showHistory) {
      fetchtHistoryEntries();
    }
    setShowMenu(false);
  };

  const handleDedtMinimization = (selectedGroupId) => {
    handleMinimizeDebts(selectedGroupId);
    setShowMenu(false);
  };
  // Handle showing analytics
  const handleShowAnalytics = (selectedGroupId) => {
    getAnalytics(selectedGroupId);
    setShowMenu(false);
  };

  // handle show group info
  const handleGroupInfo = (selectedGroupId, loggedinMemberId) => {
    getGroupInfo(selectedGroupId, loggedinMemberId);
    setShowMenu(false);
  };

  // handling insights
  const handleInsightsButton = async () => {
    setShowInsights(true);
    try {
      setLoadingInsights(true);

      const response = await fetchInsights(selectedGroupId);
      setInsightsInfo(response?.advisor);
    } catch (error) {
      setInsightsError("Error occured while fetching insights.");
    } finally {
      setLoadingInsights(false);
    }
  };

  // for three dots menu
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  // for insights container
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (insightsRef.current && !insightsRef.current.contains(e.target)) {
        setShowInsights(false);
      }
    };
    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return (
    <div className={styles.outerDiv}>
      <div className={styles.leftSection}>
        <div
          className={styles.backBtnDiv}
          onClick={() => {
            handleSelectedGroup(null);
          }}
        >
          <MdKeyboardArrowLeft className={styles.leftArrow} />
        </div>
        <div className={styles.groupImgDiv}>
          {selectedGroupPic ? (
            <img
              src={selectedGroupPic}
              alt="group_pic"
              className={styles.groupImg}
            />
          ) : (
            <HiUsers size={27} color="white" />
          )}
        </div>
        <span className={styles.grpNameSpan}>{selectedGroupName}</span>
      </div>

      {/* right section for Insights and three dot button */}
      <div className={styles.rightSection}>
        {/* Insights div */}
        <div className={styles.insightsContainer} ref={insightsRef}>
          <IoSparkles
            className={styles.insightsIcon}
            onClick={() => handleInsightsButton()}
            title="Insights"
          />
          {showInsights && (
            <div className={styles.insightsPopUpContainer}>
              <h6 className={styles.InsightsHeader}>
                Insights based on your spending in this group
              </h6>
              {loadingInsights ? (
                <p>Loading...</p>
              ) : insightsError ? (
                <p>{insightsError}</p>
              ) : (
                insightRecommendations?.map((item, index) => (
                  <InsightCard
                    key={`${index}-${item}`}
                    insight={item}
                    insightsInfo={insightsInfo}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* three dots button and menu */}
        <div className={styles.menuContainer} ref={menuRef}>
          <BsThreeDotsVertical
            className={styles.threeDots}
            onClick={() => setShowMenu((prev) => !prev)}
          />{" "}
          {showMenu && (
            <div className={styles.dropdownMenu}>
              {/* history */}
              <button
                className={styles.dropdownItem}
                onClick={handleToggleHistory}
              >
                {showHistory ? "Hide History" : "History"}
              </button>
              {/* minimize debts */}
              <button
                className={styles.dropdownItem}
                onClick={() => handleDedtMinimization(selectedGroupId)}
              >
                Minimize Debts
              </button>

              {/* show analytics */}
              <button
                className={styles.dropdownItem}
                onClick={() => handleShowAnalytics(selectedGroupId)}
              >
                Analytics
              </button>
              {/* show group info */}
              <button
                className={styles.dropdownItem}
                onClick={() =>
                  handleGroupInfo(selectedGroupId, loggedinMemberId)
                }
              >
                Group Info
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupHeader;
