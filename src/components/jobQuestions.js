// JobQuestions.js

import React, { useState, useEffect } from 'react';

const JobQuestions = ({ jobId, fetchedJobs, jobDetails }) => {
  const [questions, setQuestions] = useState([]);
  const [videoUrls, setVideoUrls] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`reson/question/${jobId}`);
        if (response.ok) {
          const questionsData = await response.json();
          setQuestions(questionsData);
        } else {
          console.error('Error fetching questions:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching questions:', error.message);
      }
    };

    fetchQuestions();
  }, [jobId]);

  useEffect(() => {
    const fetchVideoUrls = async () => {
      if (!fetchedJobs) return; // Add a nullish coalescing operator check
  
      const urls = {};
      const latestJobId = fetchedJobs.length > 0 ? fetchedJobs[fetchedJobs.length - 1].job_id : 0;
      await Promise.all(
        questions.map(async (question) => {
          if (question.question_video_url) {
            const url = await getVideoUrl(question.question_video_url, jobDetails.jobTitle, latestJobId);
            urls[question.question_video_url] = url;
          }
        })
      );
      setVideoUrls(urls);
    };
  
    fetchVideoUrls();
  }, [questions, fetchedJobs, jobDetails]);
  
  

  const getVideoUrl = async (s3key, jobTitle, latestJobId) => {
    if (s3key && jobTitle && latestJobId) {
      const folderName = `${jobTitle.replace(/\s+/g, '-').toLowerCase()}_job${latestJobId}`;
      const userFolder = `${folderName}/profile`;
      const res2 = await fetch(`/api/video?file=${s3key}&key=${s3key}&folder=${userFolder}`);
      const { durl, dkey } = await res2.json();
      const fetchS3Url = await fetch(durl, {
        method: 'GET'
      });
      return fetchS3Url.url;
    }
  };
  

  return (
    <div>
      <h2>Questions for this job:</h2>
      <div>
      {questions.map((question, index) => (
  <div key={index}>
    <h3>{question.question_title}</h3>
    {question.question_video_url && videoUrls[question.question_video_url] ? (
      <video controls src={videoUrls[question.question_video_url]} />
    ) : (
      <p>No video available</p>
    )}
  </div>
))}

      </div>
    </div>
  );
};

export default JobQuestions;