const express = require("express");
const path = require("path");
// import express from 'express';
// import path from 'path';

const app = express();
const PORT = process.env.PORT || 5175;

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Serve index.html for all other routes to enable client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`QR mobile server running on ${PORT}`);
});