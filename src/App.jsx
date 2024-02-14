import { useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tmImage from "@teachablemachine/image";
import * as blazeface from "@tensorflow-models/blazeface";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import './App.css'

function App() {
  // teachable machine created models
  const DocURL = import.meta.env.VITE_APP_DOCUMENT_DETECT_URL;
  const MaskURL = import.meta.env.VITE_APP_MASK_DETECT_URL;
  // all error messages
  const [displayErrorMessage, setDisplayErrorMessage] = useState('');

  // all model loaded
  const [isLoadedAllModel, setIsLoadedAllModel] = useState(true);

  // object detect for auto crop detection
  const objectModel = useRef(null);
  const [isLoadedObjectModel, setIsLoadedObjectModel] = useState(true);
  // document detection model in useRef
  const docModel = useRef(null);
  const [isLoadedDocModel, setIsLoadedDocModel] = useState(true);
  // mask detection model in useRef
  const maskModel = useRef(null);
  const [isLoadedMaskModel, setIsLoadedMaskModel] = useState(true);
  // face detection model in useRef
  const blazeFaceModel = useRef(null);
  const [isLoadedBlazeFaceModel, setIsLoadedBlazeFaceModel] = useState(true);
  // hand pose detection model in useRef
  const handPoseModel = useRef(null);
  const [isLoadedHandPoseModel, setIsLoadedHandPoseModel] = useState(true);
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js', { scope: '/tensorflow-react/' })
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
  const loadCocoSsdModel = async () => {
    try {
      await tf.ready();
      // await tf.setBackend('webgl'); // Use GPU for faster performance
      setIsLoadedObjectModel(false);
      console.log("AI/ML(coco-ssd) model loading...");
      const startedAt = new Date().getTime();
      const model = await cocoSsd.load();
      const endedAt = new Date().getTime();
      console.log(
        "AI/ML(coco-ssd) model loaded time:",
        (endedAt - startedAt) / 1000
      );
      objectModel.current = model;
      setIsLoadedObjectModel(true);
    } catch (error) {
      console.log(error);
      setDisplayErrorMessage("AI/ML(coco-ssd) model is not loaded!");
    }
  };

  const loadDocModel = async () => {
    try {
      console.log("AI/ML(Document) model loading...");
      const startedAt = new Date().getTime();
      const model = await tmImage.load(
        DocURL + "model.json",
        DocURL + "metadata.json"
      );
      const endedAt = new Date().getTime();
      console.log(
        "AI/ML(Document) model loaded time:",
        (endedAt - startedAt) / 1000
      );
      docModel.current = model;
      setIsLoadedDocModel(true);
    } catch (error) {
      console.log(error);
      setDisplayErrorMessage("AI/ML(Document) model is not loaded!");
    }
  };

  const loadMaskModel = async () => {
    try {
      setIsLoadedMaskModel(false);
      console.log("AI/ML(Mask) model loading...");
      const startedAt = new Date().getTime();
      const model = await tmImage.load(
        MaskURL + "model.json",
        MaskURL + "metadata.json"
      );
      const endedAt = new Date().getTime();
      console.log(
        "AI/ML(Mask) model loaded time:",
        (endedAt - startedAt) / 1000
      );
      maskModel.current = model;
      setIsLoadedMaskModel(true);
    } catch (error) {
      console.log(error);
      setDisplayErrorMessage("AI/ML(Mask) model is not loaded!");
    }
  };

  const loadBlazeFaceModel = async () => {
    try {
      setIsLoadedBlazeFaceModel(false);
      console.log("AI/ML(Blazeface) model loading...");
      const startedAt = new Date().getTime();
      const model = await blazeface.load();
      // const model = await tf.loadGraphModel('../assets/blazeface/model.json');
      const endedAt = new Date().getTime();
      console.log(
        "AI/ML(Blazeface) model loaded time:",
        (endedAt - startedAt) / 1000
      );
      blazeFaceModel.current = model;
      setIsLoadedBlazeFaceModel(true);
    } catch (error) {
      console.log(error);
      setDisplayErrorMessage("AI/ML(Blazeface) model is not loaded!");
    }
  };

  const loadHandModel = async () => {
    try {
      setIsLoadedHandPoseModel(false);
      console.log("AI/ML(Handpose) model loading...");
      const startedAt = new Date().getTime();
      const model = handPoseDetection.SupportedModels.MediaPipeHands;
      const detectorConfig = {
        runtime: "tfjs", // or 'mediapipe',
        maxHands: 2,
        // solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
        // modelType: 'full'
      };
      const detector = await handPoseDetection.createDetector(
        model,
        detectorConfig
      );
      const endedAt = new Date().getTime();
      console.log(
        "AI/ML(Handpose) model loaded time:",
        (endedAt - startedAt) / 1000
      );
      handPoseModel.current = detector;
      setIsLoadedHandPoseModel(true);
    } catch (error) {
      console.log(error);
      setDisplayErrorMessage("AI/ML(Handpose) model is not loaded!");
    }
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Tensorflow JS and Teachable Machine</h1>
      <div className="card">
        <button onClick={() => Promise.all([loadCocoSsdModel()]).then(() => {})} disabled={!isLoadedObjectModel}>
          Coco-ssd Model
        </button>
        <br/>
        <button onClick={() => Promise.all([loadDocModel()]).then(() => {})} disabled={!isLoadedDocModel}>
          Document Model
        </button>
        <br/>
        <button onClick={() => Promise.all([loadMaskModel()]).then(() => {})} disabled={!isLoadedMaskModel}>
          Mask Model
        </button>
        <br/>
        <button onClick={() => Promise.all([loadBlazeFaceModel()]).then(() => {})} disabled={!isLoadedBlazeFaceModel}>
          BlazeFace Model
        </button>
        <br/>
        <button onClick={() => Promise.all([loadHandModel()]).then(() => {})} disabled={!isLoadedHandPoseModel}>
          Hand-Pose-Detection Model
        </button>
      </div>
      <div className="card">
        <button 
          onClick={() => {
            setIsLoadedAllModel(false);
            Promise.all([
              loadCocoSsdModel(),
              loadDocModel(),
              loadMaskModel(),
              loadBlazeFaceModel(),
              loadHandModel()
            ]).then(() => {
              setIsLoadedAllModel(true);
            })
          }} 
          disabled={!isLoadedAllModel}
        >
          Load All parallel
        </button>
      </div>
      <p className="read-the-docs">
      {displayErrorMessage}
      </p>
    </>
  )
}

export default App
