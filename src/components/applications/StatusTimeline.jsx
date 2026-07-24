export default function StatusTimeline({ currentStatus }) {

  const stages = [
    "Submitted",
    "UnderReview",
    "Shortlisted",
    "Interviewing",
    "Offered"
  ];


  const rejected = currentStatus === "Rejected";


  const currentIndex = stages.indexOf(currentStatus);


  return (
    <div className="timeline">

      {
        stages.map((stage, index) => (

          <div
            key={stage}
            className="timeline-item"
          >

            <div
              className={
                rejected && stage === "Shortlisted"
                  ? "circle rejected"
                  :
                  index <= currentIndex
                  ? "circle active"
                  : "circle"
              }
            >
              {index + 1}
            </div>


            <span>
              {stage}
            </span>


            {
              index !== stages.length - 1 &&
              (
                <div
                  className={
                    index < currentIndex
                    ? "line active-line"
                    : "line"
                  }
                />
              )
            }

          </div>

        ))
      }


      {
        rejected && (
          <div className="rejected-message">
            Application Rejected
          </div>
        )
      }

    </div>
  );
}