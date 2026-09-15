import { HiUsers } from "react-icons/hi";
import styles from "../css-modules/GroupHeader.module.css";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { fetchInsights } from "../apis";
import InsightCard from "./InsightCard";
import { BsChatDots } from "react-icons/bs";
import { MdAccountBalanceWallet } from "react-icons/md";
import { FaHistory } from "react-icons/fa";
import { FiMinimize2 } from "react-icons/fi";
import { FiInfo } from "react-icons/fi";
import { FiBarChart2 } from "react-icons/fi";

import Chat from "./chat/Chat";

import { useGetUnreadCountQuery } from "../store/chatApiSlice";

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

  const [showChat, setShowChat] = useState(false);

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

  // Getting unread messages count
  const { data: unreadData } = useGetUnreadCountQuery(selectedGroupId, {
    skip: !selectedGroupId,
    pollingInterval: 10000,
    // ten seconds delay
  });

  const unreadCount = unreadData?.unreadCount || 0;

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
        {/* Chat button */}
        <div className={styles.chatContainer}>
          <button
            type="button"
            className={styles.chatButton}
            onClick={() => setShowChat(true)}
            title="Group Chat"
          >
            <BsChatDots className={styles.chatIcon} />

            {unreadCount > 0 && (
              <span className={styles.unreadBadge}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {showChat && (
            <Chat
              groupId={selectedGroupId}
              loggedinMemberId={loggedinMemberId}
              onClose={() => setShowChat(false)}
            />
          )}
        </div>

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
                <div className={styles.buttonContent}>
                  <span className={styles.buttonIcon}>
                    <FaHistory size={20} />
                  </span>
                  {showHistory ? "Hide History" : "History"}
                </div>
              </button>
              {/* minimize debts */}
              <button
                className={styles.dropdownItem}
                onClick={() => handleDedtMinimization(selectedGroupId)}
              >
                <div className={styles.buttonContent}>
                  <span className={styles.buttonIcon}>
                    <FiMinimize2 size={20} />
                  </span>
                  Minimize Debts
                </div>
              </button>

              {/* show analytics */}
              <button
                className={styles.dropdownItem}
                onClick={() => handleShowAnalytics(selectedGroupId)}
              >
                <div className={styles.buttonContent}>
                  <span className={styles.buttonIcon}>
                    <FiBarChart2 size={20} />
                  </span>
                  Analytics
                </div>
              </button>
              {/* show group info */}
              <button
                className={styles.dropdownItem}
                onClick={() =>
                  handleGroupInfo(selectedGroupId, loggedinMemberId)
                }
              >
                <div className={styles.buttonContent}>
                  <span className={styles.buttonIcon}>
                    <FiInfo size={20} />
                  </span>
                  Group Info
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupHeader;
