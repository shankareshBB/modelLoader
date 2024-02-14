// const CACHE_NAME = 'tensorflow-models-cache';

// self.addEventListener('install', event => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then(cache => {
//         console.log("Opened cache");
//       return cache.addAll([
//         // coco ssd
//         'https://storage.googleapis.com/tfjs-models/savedmodel/ssdlite_mobilenet_v2/model.json',
//         // document model
//         "https://teachablemachine.withgoogle.com/models/ikFAYzyyu/model.json",

//         // mask model 
//         "https://teachablemachine.withgoogle.com/models/_08Yck2dy/model.json",

//         // blazeface
//         'https://tfhub.dev/tensorflow/tfjs-model/blazeface/1/default/1/model.json?tfjs-format=file',
         
//         // handpose model
//         "https://tfhub.dev/mediapipe/tfjs-model/handpose_3d/detector/full/1/model.json?tfjs-format=file",
//         "https://tfhub.dev/mediapipe/tfjs-model/handpose_3d/landmark/full/1/model.json?tfjs-format=file"
//         // Add more model files if necessary
//       ]);
//     })
//   );
// });

// self.addEventListener('fetch', event => {
//   event.respondWith(
//     caches.match(event.request).then(response => {
//         console.log("response from fetch request: ", {response});
//       // Cache hit - return response
//       if (response) {
//         return response;
//       }
//       return fetch(event.request);
//     })
//   );
// });



const CACHE_NAME = 'tensorflow-models-cache-v1';
const urlsToCache = [
    // coco ssd
    'https://storage.googleapis.com/tfjs-models/savedmodel/ssdlite_mobilenet_v2/model.json',
    // document model
    "https://teachablemachine.withgoogle.com/models/ikFAYzyyu/model.json",

    // mask model 
    "https://teachablemachine.withgoogle.com/models/_08Yck2dy/model.json",

    // blazeface
    'https://tfhub.dev/tensorflow/tfjs-model/blazeface/1/default/1/model.json?tfjs-format=file',
     
    // handpose model
    "https://tfhub.dev/mediapipe/tfjs-model/handpose_3d/detector/full/1/model.json?tfjs-format=file",
    "https://tfhub.dev/mediapipe/tfjs-model/handpose_3d/landmark/full/1/model.json?tfjs-format=file"
    // Add more model files if necessary
  ]

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
    const request = event.request;
  
    // Skip caching for requests from browser extensions
    if (request.url.startsWith('chrome-extension://')) {
      return;
    }
  
    event.respondWith(
      caches.match(request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }
  
          // Clone the request
          const fetchRequest = request.clone();
  
          return fetch(fetchRequest).then(
            function(response) {
              // Check if we received a valid response
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
  
              // Clone the response
              const responseToCache = response.clone();
              // Save the response for future matching
              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(request, responseToCache);
                });
  
              return response;
            }
          );
        })
      );
  });

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//       .then(function(response) {
//         // Cache hit - return response
//         if (response) {
//           return response;
//         }
//         // Clone the request
//         var fetchRequest = event.request.clone();

//         return fetch(fetchRequest).then(
//           function(response) {
//             // Check if we received a valid response
//             if(!response || response.status !== 200 || response.type !== 'basic') {
//               return response;
//             }

//             // Clone the response
//             var responseToCache = response.clone();
//             // Save the response for future matching
//             caches.open(CACHE_NAME)
//               .then(function(cache) {
//                 // cache.put(event.request, responseToCache);
//                 cache.put(event.request, responseToCache);
//               });

//             return response;
//           }
//         );
//       })
//     );
// });