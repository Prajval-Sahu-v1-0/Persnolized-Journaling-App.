#!/bin/bash

# Navigate to the app directory
cd /home/sahu/Documents/Journal/odensjournal

# Start Next.js in background
npm run dev > /dev/null 2>&1 &
NEXT_PID=$!

# Wait exactly enough for localhost:3000 to be ready. 
# Next.js dev server usually takes a few seconds to boot up.
sleep 5

# Open the app in a standalone window, trying common Chromium-based browsers for app mode
if command -v google-chrome &> /dev/null; then
    google-chrome --app="http://localhost:3000"
elif command -v google-chrome-stable &> /dev/null; then
    google-chrome-stable --app="http://localhost:3000"
elif command -v chromium-browser &> /dev/null; then
    chromium-browser --app="http://localhost:3000"
elif command -v chromium &> /dev/null; then
    chromium --app="http://localhost:3000"
elif command -v brave-browser &> /dev/null; then
    brave-browser --app="http://localhost:3000"
else
    # Fallback to default browser if no Chromium-based app mode is found
    xdg-open "http://localhost:3000"
fi

# When the standalone browser window is closed, kill the development server
kill $NEXT_PID
