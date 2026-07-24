export default function StatusBadge({ status }) {

  const colors = {
    Submitted: "gray",
    Shortlisted: "green",
    Rejected: "red",
    UnderReview: "blue",
    Interviewing: "purple",
    Offered: "green"
  };


  return (
    <span className={`status-badge ${colors[status] || "gray"}`}>
      {status}
    </span>
  );
}