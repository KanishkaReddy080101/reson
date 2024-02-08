import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import JobQuestions from '../../components/jobQuestions';

const Job = () => {
  const router = useRouter();
  const { job_id } = router.query; // Get the job_id from the route parameters
  const [jobDetails, setJobDetails] = useState('');

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`https://resonapi.uarl.in/jobs/${job_id}`);
        if (response.ok) {
          const jobData = await response.json();
          setJobDetails(jobData);
        } else {
          console.error('Error fetching job details:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching job details:', error.message);
      }
    };
  
    if (job_id) {
      fetchJobDetails();
    }
  }, [job_id]);
  

  return (
    <>
      {jobDetails && (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Job Title: {jobDetails.job_title}</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.6' }}>Job Description: {jobDetails.job_description}</p>
          <JobQuestions jobId={job_id} jobDetails={jobDetails} />
        </div>
      )}
      
    </>
  );
};

export default Job;
