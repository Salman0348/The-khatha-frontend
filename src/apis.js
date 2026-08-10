import axios from "axios";
import {
  signInFailure,
  signInRequest,
  signInSuccess,
  signUpFailure,
  signUpRequest,
  signUpSuccess,
  statusChange,
} from "./store/authSlice"; //actions

// sign in call
const signInUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/login`;

const signIn = (signInCredentials) => async (dispatch) => {
  dispatch(signInRequest());
  try {
    const response = await axios.post(signInUrl, signInCredentials, {
      withCredentials: true,
    });
    if (response.status === 200) {
      dispatch(signInSuccess());
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      if (error.response.data.error === "FIELDS_REQUIRED") {
        dispatch(signInFailure("All fieds are required"));
      } else if (error.response.data.error === "INVALID_CREDENTIALS") {
        dispatch(signInFailure("Invalid email or password"));
      }
    } else if (error.response && error.response.status === 500) {
      dispatch(signInFailure("Internal server error"));
    } else {
      dispatch(signInFailure("Network error or unexpected issue"));
    }
  }
};

//sign up call
const signUpUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/signup`;
const signUp = (signUpCredentials) => async (dispatch) => {
  dispatch(signUpRequest());
  try {
    const response = await axios.post(signUpUrl, signUpCredentials);
    if (response.status === 200) {
      dispatch(signUpSuccess());
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      if (error.response.data.error === "FIELDS_REQUIRED") {
        dispatch(signUpFailure("All fieds are required"));
      } else if (error.response.data.error === "NAME_LIMIT_EXCEEDED") {
        dispatch(signInFailure("Username cannot exceed 20 characters"));
      }
    } else if (error.response && error.response.status === 409) {
      if (error.response.data.error === "USER_EXISTS") {
        dispatch(signUpFailure("User with this email already exists"));
      } else if (error.response.data.error === "USER_EXISTS_IN_PENDING_USER") {
        dispatch(statusChange("USER_EXISTS_IN_PENDING_USER"));
      }
    } else if (error.response && error.response.status === 500) {
      dispatch(signUpFailure("Internal server error"));
    } else {
      dispatch(signUpFailure("Network error or unexpected issue"));
    }
  }
};

// debt minimization call
const minimizeDebtUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/minimize-debt`;
const minimizeDebts = async (groupId) => {
  try {
    const response = await axios.get(minimizeDebtUrl, {
      params: { groupId },
      withCredentials: true,
    });
    if (response.status !== 200) {
      throw new Error("Failed to minimize debt");
    }
    return await response.data;
  } catch (error) {
    console.error("Error occurred while minimizing debt:", error);
    throw error;
  }
};

// expense-forecast call
const analyticsUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/expense-forecast`;
const fetchExpenseForecast = async (selectedGroupId) => {
  try {
    const response = await axios.get(analyticsUrl, {
      params: { groupId: selectedGroupId },
      withCredentials: true,
    });
    if (response.status !== 200) {
      throw new Error("Failed to fetch expense forecast");
    }
    return await response.data;
  } catch (error) {
    console.error("Error occurred while fetching expense forecast:", error);
    throw error;
  }
};

//analytics call
const expenseAnalyticsUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/expense-analytics`;
const getExpenseAnalytics = async ({
  groupId,
  type,
  period,
  startDateTime,
  endDateTime,
}) => {
  try {
    const response = await axios.get(expenseAnalyticsUrl, {
      params: {
        groupId,
        type,
        period,
        startDateTime,
        endDateTime,
      },
      withCredentials: true,
    });
    if (response.status !== 200) {
      throw new Error("Failed to fetch expense analytics");
    }

    return await response.data;
  } catch (error) {
    console.error("Error occurred while fetching expense analytics:", error);
    throw error;
  }
};

// group info call
const groupInfoUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/group-info`;
const fetchGroupInfo = async (selectedGroupId, memberId) => {
  try {
    const response = await axios.get(groupInfoUrl, {
      params: { groupId: selectedGroupId, memberId },
      withCredentials: true,
    });
    if (response.status !== 200) {
      throw new Error("Failed to fetch group info");
    }
    return await response.data;
  } catch (error) {
    console.error("Error occurred while fetching group info:", error);
    throw error;
  }
};

// budget patching
const groupBudgetUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/edit-budget`;
const patchGroupBudget = async (memberId, budget) => {
  try {
    const response = await axios.patch(
      groupBudgetUrl,
      {
        memberId,
        budget,
      },
      {
        withCredentials: true,
      },
    );
    if (response.status !== 200) {
      throw new Error("Failed to edit group budget");
    }
    return await response.data;
  } catch (error) {
    console.error("Error occurred while editing group budget:", error);
    throw error;
  }
};

// fetching insights for logged in member in a specific group
const financialAdvisorUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/financial-advisor`;
const fetchInsights = async (selectedGroupId) => {
  try {
    const response = await axios.get(financialAdvisorUrl, {
      params: { groupId: selectedGroupId },
      withCredentials: true,
    });
    if (response.status !== 200) {
      throw new error("Failed to fetch Insights.");
    }
    return await response.data;
  } catch (error) {
    console.error("Error occured while fetching insights.", error);
    throw error;
  }
};

export {
  signIn,
  signUp,
  minimizeDebts,
  fetchExpenseForecast,
  getExpenseAnalytics,
  fetchGroupInfo,
  patchGroupBudget,
  fetchInsights,
};
