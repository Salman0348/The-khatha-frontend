import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import styles from "../css-modules/Dashboard.module.css";
import GroupList from "./GroupList";
import MemberList from "./MemberList";
import GroupHeader from "./GroupHeader";
import HistoryList from "./HistoryList";
import GroupsDropDown from "./GroupsDropDown";
import AddEntryForm from "./AddEntryForm";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfileUpdatedDefault } from "../store/userSlice";
import Spinner from "react-bootstrap/esm/Spinner";
import GroupListSkeleton from "./GroupListSkeleton";
import {
  setGrpDeletedDefault,
  setIsGroupInfoUpdated,
} from "../store/groupsSlice";

const Dashboard = () => {
  const loggedInUser = useSelector((state) => state.user.userInfo);
  const { isGroupInfoUpdated, isGrpDeleted, deletedGrpId } = useSelector(
    (state) => state.groups
  );
  const { isUserProfileUpdated } = useSelector((state) => state.user); //for refetching groups and it's members when user profile is updated: in useEffect dependencies
  const dispatch = useDispatch();

  const [groups, setGroups] = useState(null); //come from group fetching
  const [groupsMembersResults, setGroupsMembersResults] = useState([]); //come from groups members fetching
  const [addEntryResponse, SetAddEntryResponse] = useState(null); //for refething groups and it's members when new entry is added: in useEffect dependencies
  const [addNewGroupResponse, SetAddNewGroupResponse] = useState(null); //for refetching groups and it's member swhen new group is created/added: in useEffect dependencies

  const [historyItems, setHistoryItems] = useState(null);

  const [historyController, setHistoryController] = useState(null);

  const [isFetchingHistoryEntriesLoading, setIsFetchingHistoryEntriesLoading] =
    useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [selectedGroupAdminId, setSelectedGroupAdminId] = useState(null);

  const [showHistory, setShowHistory] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
  const [
    selectedGrouploggedinUserMemberId,
    setSelectedGrouploggedinUserMemberId,
  ] = useState(null);

  //setting the loggedin user member id for selected group
  useEffect(() => {
    if (selectedGroupMembers.length > 0) {
      const loggedinUserMemberObj = selectedGroupMembers.find(
        (group) => group.user_id === loggedInUser.id
      );
      setSelectedGrouploggedinUserMemberId(loggedinUserMemberObj.member_id);
    }
  }, [selectedGroupMembers]);

  //setting the selected group members: state
  useEffect(() => {
    // Abort previous history fetch if any upon changing selected groups by the user
    if (historyController) {
      historyController.abort();
    }

    if (selectedGroup) {
      setSelectedGroupAdminId(selectedGroup.admin_id);
      const selectedGroupId = selectedGroup.group_id;
      const targetedGroup = groupsMembersResults.find(
        (group) => group.group_id === selectedGroupId
      );
      if (targetedGroup) {
        const targetedGroupMembers = JSON.parse(targetedGroup.group_members);
        setSelectedGroupMembers(targetedGroupMembers || []);
      }
    }
  }, [selectedGroup, groupsMembersResults]);

  //groups and it's members fetching
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchGroups = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.get(`${baseURL}/api/v1/groups`, {
          withCredentials: true,
          signal,
        });
        if (response.status === 200) {
          setGroups(response.data?.results);
          if (response.data?.results.length > 0) {
            const groupIds = response.data.results.map(
              (group) => group.group_id
            );
            fetchGroupsMembers(groupIds);
          }
        }
      } catch (err) {
        if (axios.isCancel(err)) {
        } else {
          toast.error("Error fetching groups", {
            closeButton: true,
            autoClose: 5000,
          });
        }
      }
    };
    fetchGroups();
    dispatch(setUserProfileUpdatedDefault());
    if (isGroupInfoUpdated) {
      dispatch(setIsGroupInfoUpdated(false)); //back to default
    }
    if (isGrpDeleted) {
      if (selectedGroup && selectedGroup.group_id === deletedGrpId) {
        setSelectedGroup(null);
      }
      dispatch(setGrpDeletedDefault());
    }
    return () => {
      controller.abort();
    };
  }, [
    addEntryResponse,
    addNewGroupResponse,
    isUserProfileUpdated,
    isGroupInfoUpdated,
    isGrpDeleted,
  ]);

  const fetchGroupsMembers = async (groupIds) => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(
        `${baseURL}/api/v1/groups-members`,
        { groupIds },
        { withCredentials: true }
      );
      setGroupsMembersResults(response.data?.groupsMembersResults);
    } catch (error) {
      toast.error("Error fetching groups Members", {
        closeButton: true,
        autoClose: 5000,
      });
    }
  };

  //group history entries fetching
  const fetchtHistoryEntries = async () => {
    if (isFetchingHistoryEntriesLoading) {
      return;
    }
    if (historyController) {
      historyController.abort();
    }
    const newHistoryController = new AbortController();
    setHistoryController(newHistoryController);

    const selectedGroupId = selectedGroup?.group_id;
    try {
      setIsFetchingHistoryEntriesLoading(true);
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const historyEntriesResponse = await axios.get(
        `${baseURL}/api/v1/history-entries`,
        {
          params: {
            selectedGroupId,
          },
          withCredentials: true,
          signal: newHistoryController.signal,
        }
      );
      if (historyEntriesResponse.status === 200) {
        const historyEntries = historyEntriesResponse?.data?.results;
        setHistoryItems(historyEntries);
      }
    } catch (err) {
      if (!axios.isCancel(err)) {
        toast.error("Error fetching history entries", {
          closeButton: true,
          autoClose: 5000,
        });
      }
    } finally {
      setIsFetchingHistoryEntriesLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (historyController) {
        historyController.abort(); // Cleanup
      }
    };
  }, [historyController]);

  /*can also take null when the group back button is cliked*/
  const handleSelectedGroup = (group) => {
    setSelectedGroup(group);
    setSelectedGroupMembers([]);
    setShowHistory(false); // Hide history when selecting a new group
    setHistoryItems(null);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const entryMembersCallback = (member) => {
    return { member_id: member.member_id, member_name: member.member_name };
  };

  return (
    <div className={styles.dashboardContainer}>
      <Header />
      <div
        className={`${styles.dashboard} ${
          selectedGroup ? styles.showMembers : styles.showGroups
        }`}
      >
        <div className={`${styles.groupSection} ${styles.scrollBar}`}>
          <div className={styles.groupListHeading}>
            <span className={styles.headingName}>Groups </span>
            <GroupsDropDown
              showCreateGroupModal={showCreateGroupModal}
              setShowCreateGroupModal={setShowCreateGroupModal}
              SetAddNewGroupResponse={SetAddNewGroupResponse}
            />
          </div>
          {groups && groups.length > 0 ? (
            <GroupList
              groups={groups}
              selectedGroup={selectedGroup}
              getSelectedGroup={handleSelectedGroup}
            />
          ) : groups && groups.length === 0 ? (
            <div className={styles.noGroupsDiv}>
              <p>No groups for you</p>
              <button
                onClick={() => setShowCreateGroupModal(true)}
                className={styles.noGroupsBtn}
              >
                Create New Group
              </button>
            </div>
          ) : (
            <GroupListSkeleton />
          )}
        </div>
        <div
          className={`${styles.memberSection} ${
            showHistory
              ? styles.memberSectionSmallWidth
              : styles.memberSectionLargeWidth
          }`}
        >
          {selectedGroup ? (
            <>
              <GroupHeader
                selectedGroupName={selectedGroup.group_name}
                selectedGroupPic={selectedGroup.group_pic_url}
                handleSelectedGroup={handleSelectedGroup} //for back btn
              />
              <MemberList
                selectedGroupMembers={selectedGroupMembers}
                showHistory={showHistory}
                selectedGroupAdminId={selectedGroupAdminId}
              />
              <AddEntryForm
                selectedGrouploggedinUserMemberId={
                  selectedGrouploggedinUserMemberId
                }
                SetAddEntryResponse={SetAddEntryResponse}
                addEntryResponse={addEntryResponse}
                selectedGroupMembers={selectedGroupMembers.map(
                  entryMembersCallback
                )}
              />
            </>
          ) : (
            groups &&
            groups.length > 0 && (
              <p className={styles.grpMemsInstMssg}>
                Select a group to see its members
              </p>
            )
          )}
        </div>
        {selectedGroup && showHistory && (
          <div className={styles.historySection}>
            {historyItems?.length > 0 ? (
              <>
                <HistoryList
                  historyItems={historyItems}
                  groupName={selectedGroup?.group_name}
                  selectedGroupMembers={selectedGroupMembers.map(
                    entryMembersCallback
                  )}
                />
              </>
            ) : historyItems?.length === 0 ? (
              <div className={styles.noEntriesDivOrSpinner}>No entries yet</div>
            ) : (
              <div className={styles.noEntriesDivOrSpinner}>
                <Spinner
                  animation="border"
                  role="status"
                  className={styles.groupsFetchingSpinner}
                />
              </div>
            )}
          </div>
        )}

        {selectedGroup && (
          <button onClick={toggleHistory} className={styles.historyBtn}>
            {showHistory ? (
              <span>
                Hide
                <span className={styles.hiddenPartOfHistoryOnMobile}>
                  &nbsp;History
                </span>
              </span>
            ) : (
              <div
                className={styles.showHistoryBtnDiv}
                onClick={() => {
                  fetchtHistoryEntries();
                }}
              >
                <span className={styles.hiddenPartOfHistoryOnMobile}>
                  Show&nbsp;
                </span>{" "}
                History
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
