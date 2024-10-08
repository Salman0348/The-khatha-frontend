const extractMemberNames = (membersArray, idsArray) => {
  try {
    return membersArray
      .filter((member) => idsArray.includes(member.member_id.toString()))
      .map((member) => member.member_name);
  } catch (error) {
    return []; // Return an empty array as fall back
  }
};

export default extractMemberNames;
