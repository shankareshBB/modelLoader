import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import RecordRTC from 'recordrtc';

const WebcamRecorder = () => {
  const webcamRef = useRef(null);
  const [recorder, setRecorder] = useState(null);
  const [videoURL, setVideoURL] = useState('');
  const [facingMode, setFacingMode] = useState('user');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaContainerFormat, setMediaContainerFormat] = useState('default');

  useEffect(() => {
    return () => {
      if (recorder) {
        recorder.destroy();
      }
    };
  }, [recorder]);

  const handleStartRecording = () => {
    if (webcamRef.current?.stream) {
      const stream = webcamRef.current.stream;
      let recorderConfig = {
        type: 'video',
        mimeType: getMimeType(),
        videoBitsPerSecond: 100000,
        frameInterval: 1000 / 24, // 24 fps
      };

      const newRecorder = new RecordRTC(stream, recorderConfig);
      newRecorder.startRecording();
      setRecorder(newRecorder);
      setIsRecording(true);
    } else {
      alert("Webcam not available or permissions not granted.");
    }
  };

  const handleStopRecording = () => {
    if (recorder) {
      recorder.stopRecording(() => {
        const recordedBlob = recorder.getBlob();
        setVideoURL(URL.createObjectURL(recordedBlob));
        recorder.reset();
        setIsRecording(false);
      });
    }
  };

  const handleClearRecording = () => {
    if (videoURL) {
      URL.revokeObjectURL(videoURL);
      setVideoURL('');
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
      case 'mkv': return 'video/x-matroska;codecs=avc1';
      default: return 'video/webm';
    }
  };

  return (
    <div className="recordrtc">
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
          <option value="mkv">MKV</option>
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
          <video src={videoURL} controls muted></video>
        </div>
      )}
    </div>
  );
};

export default WebcamRecorder;