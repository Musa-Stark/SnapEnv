#!/bin/bash

# Run server in background
npm run dev > /dev/null 2>&1 &

# Wait for server
sleep 3

# Open browser
xdg-open http://localhost:3000