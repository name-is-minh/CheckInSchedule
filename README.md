# ScheduleScript

ScheduleScript is a Google Apps Script project that integrates with Google Sheets to manage worker schedules. This script allows you to add workers directly from a custom menu in Google Sheets, making it easy to keep track of personnel.

## Features

- **Add Worker**: Adds a new worker's name to the Google Sheet.
- **Custom Menu**: Adds a custom menu in Google Sheets for easy access to script functions.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [clasp](https://github.com/google/clasp) (Command Line Apps Script Projects) tool
- A Google account with access to Google Sheets and Google Apps Script

## Setup Instructions

### 1. Install `clasp`

```bash
npm install -g @google/clasp
```

### 2. Authenticate `clasp`
```bash
clasp login
```

### 3. Create a new project
```bash
clasp create --type standalone --title "<name of your project>"
```

### 4. Link to an Existing Script
```bash
clasp settings scriptId YOUR_SCRIPT_ID
```

### 5. Pull and Push
```bash
clasp pull
```
```bash
clasp push
```

## Google Sheets Integration
### Open Script Editor
In Google Sheets, open the script editor:

Extensions -> Apps Script



