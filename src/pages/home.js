import { useState, useRef, useEffect } from 'react';
import AWS from 'aws-sdk';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import JobQuestions from '../components/jobQuestions';

AWS.config.update({
  accessKeyId: 'AKIA5FTZEE4RFEEHWNNQ',
  secretAccessKey: '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',
  region: 'Europe (Frankfurt) eu-central-1',
});

Modal.setAppElement('body');

const s3 = new AWS.S3();

const Home = () => {
  const router = useRouter();
  const videoElement = useRef(null);
  const [stream, setStream] = useState(null);
  const mediaRecorder = useRef(null);
  const recordedChunks = useRef([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isRecordingStopped, setIsRecordingStopped] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);
  const [jobDetails, setJobDetails] = useState({
    jobTitle: '',
    jobDescription: '',
  });
  const [createdJobs, setCreatedJobs] = useState([]);
  const [fetchedJobs, setFetchedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobLink, setSelectedJobLink] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
const [editedJobTitle, setEditedJobTitle] = useState('');
const [editedJobDescription, setEditedJobDescription] = useState('');
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false);
  const openJobDetailsModal = (job) => {
    setIsJobDetailsModalOpen(true);
    const jobTitle = job.job_title || 'unknown-job';
  
    // Generate a unique link based on job details or job ID
    const uniqueLink = `/job/${job.job_id}-${jobTitle.replace(/\s+/g, '-').toLowerCase()}`;
  
    // Set the unique link in the state
    setSelectedJobLink(uniqueLink);
    setSelectedJob(job);
  };
  
  const closeJobDetailsModal = () => {
    setIsJobDetailsModalOpen(false);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('reson/jobs');
        if (response.ok) {
          const jobs = await response.json();
          setFetchedJobs(jobs);
          console.log(jobs)
        } else {
          console.error('Error fetching jobs:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error.message);
      }
    };

    fetchJobs();
  }, []);
  const handleLogout = () => {
    router.push('/login');
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsRecordingModalOpen(false);
  };

  const openRecordingModal = () => {
    setIsRecordingModalOpen(true);
    startRecording();
  };

  const closeRecordingModal = () => {
    stopRecording();
    setIsRecordingStopped(true);
  };

  const CloseRecording = () => {
    setIsRecordingModalOpen(false);
    window.location.reload();
  }

  const startRecording = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(userStream);
      if (videoElement.current) {
        videoElement.current.srcObject = userStream;
        mediaRecorder.current = new MediaRecorder(userStream);
        mediaRecorder.current.ondataavailable = handleDataAvailable;
        mediaRecorder.current.onstop = () => {
          setCurrentVideoUrl(URL.createObjectURL(new Blob(recordedChunks.current, { type: 'video/mp4' })));
        };
        mediaRecorder.current.start();
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const stopRecording = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      if (videoElement.current) {
        videoElement.current.srcObject = null;
      }
      if (mediaRecorder.current) {
        mediaRecorder.current.stop();
      }
    }
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.current.push(event.data);
    }
  };

  const uploadVideoUrlsToAPI = async (jobId, videoUrl) => {
    const questionData = {
      job_id: jobId,
      question_title: 'Some default title',
      question_video_url: videoUrl,
    };
  
    try {
      const response = await fetch('reson/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });
  
      if (response.ok) {
        const newQuestion = await response.json();
        toast.success('Question created successfully:', newQuestion);
        console.log('Question created successfully:', newQuestion);
      } else {
        console.error('Error creating question:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating question:', error.message);
    }
  };
  

  const uploadToS3 = async () => {
    setIsLoading(true);
  
    if (recordedChunks.current.length > 0) {
      const blob = new Blob(recordedChunks.current, { type: 'video/mp4' });
  
      const timestamp = new Date().toISOString().replace(/[-T:]/g, '').split('.')[0];
  
      const latestJobId = fetchedJobs.length > 0 ? fetchedJobs[fetchedJobs.length - 1].job_id : 0;
  
      const folderName = `${jobDetails.jobTitle.replace(/\s+/g, '-').toLowerCase()}_job${latestJobId}`;
      const fileName = `video-${timestamp}.mp4`;
      const key = `${folderName}/${fileName}`;
  
      const params = {
        Bucket: 'reson-videos',
        Key: key,
        Body: blob,
        ContentType: 'video/mp4',
      };
  
      try {
        const response = await s3.upload(params).promise();
        toast.success('Video uploaded to S3 successfully!');
        console.log('Video uploaded to S3 successfully!');
  
        // Call the function to upload the video URL to the questions API
        await uploadVideoUrlsToAPI(latestJobId, response.Location);
      } catch (error) {
        toast.error('Error uploading video to S3. Please try again.');
        console.error('Error uploading video to S3:', error);
      }
  
      recordedChunks.current = [];
      setIsLoading(false);
      setCurrentVideoUrl(null);
      setIsRecordingStopped(false);
      if (videoElement.current) {
        videoElement.current.srcObject = null;
      }
      startRecording();
    }
  };
  
  

  const handleModalSubmit = async () => {
    closeModal();
    setCurrentVideoUrl(null);

    const jobData = {
      employer_id: 1,
      job_title: jobDetails.jobTitle,
      job_category: 'IT',
      job_description: jobDetails.jobDescription,
      job_video_link: 'null',
      date_updated: new Date().toISOString(),
    };

    try {
      const response = await fetch('reson/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      if (response.ok) {
        const newJob = await response.json(); // assuming the response contains the created job with job_id
        toast.success('Job created successfully!');
        const newJobs = [...createdJobs, newJob];
        setFetchedJobs(newJobs);
        openRecordingModal();
        setIsRecordingStopped(false);
        console.log('Job created successfully!');
      } else {
        toast.error('Error creating job. Please try again.');
        console.error('Error creating job:', response.statusText);
      }
    } catch (error) {
      toast.error('Error creating job. Please try again.');
      console.error('Error creating job:', error.message);
    }
  };

  const handleUploadClick = () => {
    uploadToS3();
    setIsRecordingStopped(false);
    setCurrentVideoUrl(null);
    recordedChunks.current = [];
  };
  const handleCancelUpload = () => {
    setIsRecordingStopped(false);
    setCurrentVideoUrl(null);
    recordedChunks.current = [];
    setIsLoading(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedJobTitle(selectedJob.job_title);
    setEditedJobDescription(selectedJob.job_description);
    
  };

  const addQuestionClick = () => {
    setIsEditing(false);
    closeJobDetailsModal();
    setIsRecordingModalOpen(true); // Open the recording modal
  startRecording();
  }
  
  const handleSaveChanges = async () => {
    // Make API call to update job details
    const updatedJobData = {
      employer_id: 1,
      job_id: selectedJob.job_id,
      job_title: editedJobTitle,
      job_category: 'IT',
      job_description: editedJobDescription,
      job_video_link: 'null',
      date_updated: new Date().toISOString(),
      
    };
  
    try {
      const response = await fetch(`reson/jobs/${selectedJob.job_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedJobData),
      });
  
      if (response.ok) {
        const updatedJob = await response.json();
        // Update selected job details
        setSelectedJob(updatedJob);
        toast.success('Job details updated successfully!');
        setIsEditing(false);
      } else {
        toast.error('Error updating job details. Please try again.');
      }
    } catch (error) {
      console.error('Error updating job details:', error.message);
      toast.error('Error updating job details. Please try again.');
    }
  };
  
  const addAnswers = () => {
    router.push(`/job/${selectedJob.job_id}`)
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {/* Left Navbar */}
        <div style={{ backgroundColor: '#fff', padding: '20px', color: '#fff', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button style={{ backgroundColor: '#000', color: '#fff', border: 'none', fontSize: '16px', fontWeight: '500', borderRadius: '5px', marginTop: '2.2rem', height: '40px', lineHeight: '22px', padding: '9px 14px', width: '130px' }} onClick={openModal}>Create Job</button>
          <button onClick={handleLogout} style={{ backgroundColor: 'red', color: 'white', padding: '10px', borderRadius: '5px', border: 'none', fontSize: '16px', fontWeight: '500', marginTop: '75vh', height: '40px', lineHeight: '22px', padding: '9px 14px', width: '130px' }}>
      Logout
    </button>
        </div>

        {/* Right Content */}
        <div style={{ flex: 2, textAlign: 'center', padding: '20px', backgroundColor: '#e6e6e6' }}>
          <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Create Job Modal" style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'fixed',
            },
            content: {
              backgroundColor: 'rgb(240, 240, 240)',
              color: '#000',
              borderRadius: '10px',
              maxWidth: '100vw',
              padding: '20px',
            },
          }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '3rem' }}>Create Job</h2>
              <label style={{
                fontSize: '2rem', display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <input
                  type="text"
                  name="jobTitle"
                  placeholder='Job Title'
                  value={jobDetails.jobTitle}
                  onChange={(e) => setJobDetails({ ...jobDetails, jobTitle: e.target.value })}
                  style={{ margin: '10px 0', padding: '8px', borderRadius: '5px', border: 'none', fontSize: '1.2rem', width: '25vw', height: '5vh', color: 'black' }}
                />
              </label>
              <br />
              <label style={{
                fontSize: '2rem', display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <input
                  name="jobDescription"
                  placeholder='Job Description'
                  value={jobDetails.jobDescription}
                  onChange={(e) => setJobDetails({ ...jobDetails, jobDescription: e.target.value })}
                  style={{ margin: '10px 0', padding: '8px', borderRadius: '5px', border: 'none', fontSize: '1.2rem', height: '5vh', width: '25vw' }}
                />
              </label>
              <br />
              <button onClick={handleModalSubmit} style={{
                backgroundColor: '#000', color: '#fff', padding: '10px', borderRadius: '5px', border: 'none',
                fontSize: '2rem', marginTop: '60px'
              }}>Next</button>
            </div>
          </Modal>

          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
  {fetchedJobs.length >= 1 && fetchedJobs.map((job, index) => (
    <div key={index} style={{
      backgroundColor: 'rgb(192,192,192)',
      margin: '20px',
      borderRadius: '40px',
      textAlign: 'center',
      width: '20vw',
      height: '40vh',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      position: 'relative',    }}
      onClick={() => openJobDetailsModal(job)}
      >
      <p style={{ position: 'absolute', bottom: '6rem', left: '1rem', margin: 0, color: 'white', textShadow: 'rgba(0, 0, 0, 0.48) 0px 1px 2px', fontSize: '18px', fontWeight: '500', fontFamily: 'sans-serif' }}>{job.job_title}</p>
      <div style={{
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '2rem',
        borderRadius: '0 0 40px 40px',
      }}>
        <button onClick={() => console.log('Open job details for:', job.job_title)} style={{ border: 'none', backgroundColor: '#fff', color: 'rgb(119, 119, 119)' }}>No Interactions Yet</button>
      </div>
    </div>
  ))}
</div>

{selectedJob && (
  <Modal
  isOpen={isJobDetailsModalOpen}
  onRequestClose={closeJobDetailsModal}
  contentLabel="Job Details Modal"
>
  <div style={{ textAlign: 'center' }}>
    <h3>Selected Job: {selectedJob.job_title}</h3>
    {isEditing ? (
      <>
        <input
          type="text"
          value={editedJobTitle}
          onChange={(e) => setEditedJobTitle(e.target.value)}
        />
        <br />
        <textarea
          value={editedJobDescription}
          onChange={(e) => setEditedJobDescription(e.target.value)}
        />
        <br />
        <button onClick={handleSaveChanges}>Save Changes</button>
      </>
    ) : (
      <>
        <p>Job Description: {selectedJob.job_description}</p>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'center'}}>
        <button onClick={handleEditClick}>Edit</button>
        <button onClick={addQuestionClick}>Add Question</button>
        <button onClick={addAnswers}>Link</button>
    <button onClick={closeJobDetailsModal}>Close</button>
    </div>
        {/* <JobQuestions jobId={selectedJob.job_id} fetchedJobs={fetchedJobs} jobDetails={jobDetails} /> */}
      </>
    )}
  </div>
</Modal>

)}





<Modal
  isOpen={isRecordingModalOpen}
  onRequestClose={closeRecordingModal}
  contentLabel="Recording Modal"
  style={{
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed',
      overflow: 'hidden',
      margin: 0,
      padding: 0,
    },
    content: {
      backgroundColor: 'transparent',
      color: '#000',
      border: 'none',
      maxWidth: '100vw',
      height: '90vh',
      padding: 0,
      overflow: 'hidden',
    },
  }}
>
  <div style={{ textAlign: 'center', position: 'relative' }}>
    <video ref={videoElement} style={{ width: '100%', height: '100%' }} autoPlay></video>
    <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button style={{ backgroundColor: 'transparent', color: '#fff', padding: '15px', borderRadius: '50%', border: 'none', height: '50px', width: '50px', marginBottom: '20px', fontSize: '14px' }} onClick={CloseRecording}>
        <span style={{ fontSize: '22px' }}>X</span>
        <br />
        Esc
      </button>
    </div>
    <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
    {isRecordingStopped ? (
  <>
    {currentVideoUrl && <video controls style={{ width: '100%' }} src={currentVideoUrl} />}
    <div>
      <button style={{ backgroundColor: '#000', color: '#fff', border: 'none', fontSize: '16px', fontWeight: '500', borderRadius: '5px', marginTop: '2.2rem', height: '40px', lineHeight: '22px', padding: '9px 14px' }} onClick={handleUploadClick}>Upload</button>
      <button style={{ backgroundColor: '#FF0000', color: '#fff', border: 'none', fontSize: '16px', fontWeight: '500', borderRadius: '5px', marginTop: '2.2rem', height: '40px', lineHeight: '22px', padding: '9px 14px', marginLeft: '10px' }} onClick={handleCancelUpload}>Cancel</button>
    </div>
  </>
) : (
  <>
    {isLoading && (
      <div style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
        <p style={{ color: 'white', fontSize: '48px'}}>Loading...</p>
      </div>
    )}
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20rem', gap: '2rem',position: 'absolute', bottom: '2rem' }}>
      <button style={{ backgroundColor: 'rgb(227, 23, 78)', color: '#FF0000', padding: '15px', borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.24)', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 30px', height: '80px', width: '80px', outline: 'rgba(255, 255, 255, 0.3) solid 8px' }} onClick={startRecording}>.</button>
      <button style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#fff', padding: '15px', borderRadius: '50%', border: 'none', height: '48px', width: '48px' }} onClick={closeRecordingModal}>X</button>
    </div>
  </>
)}

    </div>
  </div>
</Modal>

          

        </div>
      </div>
    </>
  );
};

export default Home;
