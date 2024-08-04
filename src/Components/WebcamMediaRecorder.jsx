import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';

const WebcamMediaRecorder = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [videoURL, setVideoURL] = useState('');
  const [facingMode, setFacingMode] = useState('user');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaContainerFormat, setMediaContainerFormat] = useState('default');

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const handleStartRecording = () => {
    setRecordedChunks([]);
    if (webcamRef.current && webcamRef.current.stream) {
      const stream = webcamRef.current.stream;
      const options = { mimeType: getMimeType() };
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } else {
      alert("Webcam not available or permissions not granted.");
    }
  };

  const handleDataAvailable = ({ data }) => {
    if (data.size > 0) {
      setRecordedChunks((prev) => prev.concat(data));
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: getMimeType() });
      const url = URL.createObjectURL(blob);
      setVideoURL(url);
    }
  }, [recordedChunks]);

  const handleClearRecording = () => {
    if (videoURL) {
      URL.revokeObjectURL(videoURL);
      setVideoURL('');
      setRecordedChunks([]);
    }
  };

  const handleSwitchCamera = () => {
    setFacingMode(facingMode === 'user' ? 'environment' : 'user');
  };

  const getMimeType = () => {
    switch (mediaContainerFormat) {
      case 'vp8': return 'video/webm;codecs=vp8';
      case 'vp9': return 'video/webm;codecs=vp9';
      case 'h264': return 'video/mp4';
      default: return 'video/webm';
    }
  };

  return (
    <div className="webcam-recorder">
      <h2 className="header">
        <span>Recording Format: </span>
        <select 
          value={mediaContainerFormat} 
          onChange={(e) => setMediaContainerFormat(e.target.value)}
          className="media-container-format"
        >
          <option value="default">default (WebM)</option>
          <option value="vp8">VP8</option>
          <option value="vp9">VP9</option>
          <option value="h264">H264</option>
        </select>
      </h2>
      <Webcam
        audio={true}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ 
          facingMode,
          frameRate: 24
        }}
      />
      <div>
        <button onClick={handleStartRecording} disabled={isRecording}>
          Start Recording
        </button>
        <button onClick={handleStopRecording} disabled={!isRecording}>
          Stop Recording
        </button>
        <button onClick={handleSwitchCamera} disabled={isRecording}>
          Switch Camera
        </button>
        <button onClick={handleClearRecording} disabled={!videoURL}>
          Clear Recording
        </button>
      </div>
      {videoURL && (
        <div>
          <h3>Recorded Video:</h3>
          <video src={videoURL} controls />
        </div>
      )}
    </div>
  );
};

export default WebcamMediaRecorder;