const express = require('express');

const app = express();


const server = require('http').createServer(app);
const port = process.env.port || 80;
