import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import extractMemberNames from "./extractMemberNames.util";

// helper function for date and time formatting
const formatDateTime = (date) =>
  date
    ? new Date(date).toLocaleString(undefined, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    : "";

// pdf generation function
const generatePDF = (
  groupName,
  historyItems,
  selectedGroupMembersIdAndName,
) => {
  const pdf = new jsPDF();

  const url = import.meta.env.VITE_API_FRONT_END_BASE_URL;
  const websiteUrl = url;
  const websiteText = "Explore Group Expense Management at TheKhatha";
  const dateTime = formatDateTime(new Date());

  // Function to add footer link to each page
  const addFooterLink = (pdf) => {
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 255);
    pdf.textWithLink(websiteText, 120, 285, { url: websiteUrl }); //  x, y to position text
  };

  pdf.addImage("blueGreenLogoN.jpg", "JPEG", 15, 5, 8, 6.4); // x, y, width, height

  pdf.setFont("Helvetica", "bold"); // Font style and weight
  pdf.setFontSize(12);
  pdf.text("TheKhatha", 25, 10); //  x, y

  pdf.setFont("Helvetica", "bold"); // Font style and weight
  pdf.setFontSize(14);
  pdf.text(`Group Name: ${groupName}`, 15, 22); //  x, y

  pdf.setFont("Helvetica", "normal"); // Font style and weight
  pdf.setFontSize(10);
  pdf.text(`Date: ${dateTime}`, 145, 22);

  const columns = [
    { header: "Entry#", dataKey: "entryNo" },
    { header: "Amount in Rs", dataKey: "amount" },
    { header: "Purpose", dataKey: "purpose" },
    { header: "Member", dataKey: "member" },
    { header: "Participants", dataKey: "participants" },
    { header: "Category", dataKey: "category" },
    { header: "Date and Time", dataKey: "dateTime" },
    { header: "Description", dataKey: "description" },
  ];

  extractMemberNames(selectedGroupMembersIdAndName);

  const data = historyItems.map((item) => {
    let { participant_member_ids } = item;
    let isAllMembersAreParticipants = false;
    try {
      if (participant_member_ids) {
        participant_member_ids = participant_member_ids.split(",");
      }
      if (
        Array.isArray(selectedGroupMembersIdAndName) &&
        Array.isArray(participant_member_ids) &&
        selectedGroupMembersIdAndName.length === participant_member_ids.length
      ) {
        isAllMembersAreParticipants = true;
      }
    } catch (error) {
      toast.error("Error while printing entry participants.", {
        closeButton: true,
        autoClose: 5000,
      });
    }
    let participantNames = [];
    if (!isAllMembersAreParticipants) {
      participantNames = extractMemberNames(
        selectedGroupMembersIdAndName,
        participant_member_ids,
      );
    }

    return {
      entryNo: item.entry_no,
      amount: item.entry_amount,
      purpose: item.entry_purpose,
      member: item.entry_person,
      participants:
        (Array.isArray(participantNames) && participantNames.length > 0) ||
        isAllMembersAreParticipants
          ? isAllMembersAreParticipants
            ? "All"
            : participantNames.join(", ")
          : "",
      category: item.entry_category,
      dateTime: formatDateTime(item.entry_date),
      description: item.entry_description,
    };
  });

  autoTable(pdf, {
    columns,
    body: data,
    startY: 27,
    styles: {
      overflow: "linebreak",
      cellPadding: 2,
      lineWidth: 0.1, // Set border width
      lineColor: [0, 0, 0], // Set border color
      font: "Helvetica", // Font style
      fontSize: 10, // Font size
    },
    headStyles: {
      fillColor: [75, 75, 200], // Header background color
      textColor: [255, 255, 255], // Header text color (white)
    },
    bodyStyles: {
      textColor: [0, 0, 0], // Body text color (black)
    },
    columnStyles: {
      description: { cellWidth: "auto" }, // Automatically adjust column width
    },
    didDrawPage: (data) => {
      // Add footer link to each page
      addFooterLink(pdf);
    },
  });

  pdf.save(`${groupName}-entries.pdf`);
};

export default generatePDF;
