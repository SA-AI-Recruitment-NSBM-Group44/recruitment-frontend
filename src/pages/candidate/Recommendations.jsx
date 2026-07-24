<<<<<<< HEAD
import { useEffect, useState } from "react";
import client from "../../api/client";
import MatchScoreBadge from "../../components/MatchScoreBadge.jsx";
import "./Recommendations.css";


export default function Recommendations() {


  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);





  useEffect(() => {


    client
      .get("/api/ai/recommendations?candidateId=1")

      .then((response) => {

        setJobs(response.data);

        setLoading(false);

      })

      .catch((error) => {

        console.log(
          "Recommendation loading error:",
          error
        );

        setLoading(false);

      });


  }, []);







  // Loading state

  if (loading) {


    return (

      <div className="recommendation-page">


        <div className="page-header">

          <h1>
            🤖 Jobs picked for you
          </h1>


          <p>
            AI is analyzing your profile...
          </p>


        </div>



        <div className="skeleton-card"></div>

        <div className="skeleton-card"></div>


      </div>

    );

  }







  // Empty state

  if (jobs.length === 0) {


    return (

      <div className="recommendation-page">


        <div className="empty-card">


          <h2>
            📄 Upload a CV to unlock recommendations
          </h2>


          <p>
            Add your resume and let AI find suitable jobs for you.
          </p>


        </div>


      </div>

    );

  }








  return (


    <div className="recommendation-page">





      <div className="page-header">


        <h1>
          🤖 Jobs picked for you
        </h1>


        <p>
          AI-powered job recommendations based on your skills and CV
        </p>


      </div>







      {

        jobs.map((job) => (


          <div 
            className="job-card"
            key={job.jobId}
          >






            <div className="job-header">



              <div>


                <h2>
                  {job.title}
                </h2>


                <span className="job-type">
                  AI Recommended
                </span>


              </div>






              {/* Reusable Score Component */}

              <MatchScoreBadge 
                score={job.score}
              />






            </div>







            <div className="divider"></div>








            <div className="analysis-box">


              <h3>
                🤖 AI Reasoning
              </h3>



              <p>

                {job.reasoning}

              </p>


            </div>









            <div className="skills-section">



              <h3>
                ✨ Matched Skills
              </h3>






              {

                job.matchedSkills &&
                job.matchedSkills.length > 0

                ?


                job.matchedSkills.map(

                  (skill,index)=>(


                    <span

                      className="chip"

                      key={index}

                    >

                      ✓ {skill}

                    </span>


                  )


                )


                :

                (

                  <p>
                    No matched skills available
                  </p>

                )


              }





            </div>







          </div>



        ))


      }





    </div>


  );


}
=======
﻿
>>>>>>> 4b7e401 (Frontend updates)
