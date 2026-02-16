# Hour Planner

A React web app that tracks working hours against a monthly target. It pulls actual hours from a Google Sheet, displays them on a calendar, and calculates how many hours per day are needed to hit the target for the remaining days in the month.

## Setup

### Prerequisites

- Node.js (v18+)
- A Google account with access to your timesheet Google Sheet

### Install dependencies

```
npm install
```

### Google Cloud Setup

#### 1. Create a Google Cloud project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or select an existing one)

#### 2. Enable the Google Sheets API

1. Go to **APIs & Services → Library**
2. Search for "Google Sheets API" and click **Enable**

#### 3. Configure the OAuth consent screen

1. Go to **APIs & Services → OAuth consent screen**
2. Choose **External** user type
3. Fill in the required fields (app name, support email)
4. Under **Data Access**, add the scope `https://www.googleapis.com/auth/spreadsheets.readonly`
5. Add your Google email as a **Test user** (required while the app is in "Testing" status)
6. Save

#### 4. Create OAuth credentials

1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials → OAuth client ID**
3. Application type: **Web application**
4. Under **Authorized JavaScript origins**, add `http://localhost:5173`
5. Click **Create**
6. Copy the **Client ID** (looks like `123456789-xxxxxxxx.apps.googleusercontent.com`)

### Configure environment variables

Copy the example env file and fill in your Google OAuth Client ID:

```
cp .env.example .env
```

```
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### Run the app

```
npm run dev
```

The app will open at `http://localhost:5173`. You'll be prompted to sign in with Google on first load.

### Connect your Google Sheet

On first launch, the app will ask for your Google Sheet ID. You can find it in the sheet URL:

```
https://docs.google.com/spreadsheets/d/SHEET_ID_IS_THIS_PART/edit#gid=0
```

The Sheet ID is the long string between `/d/` and `/edit`. Enter it in the app and click **Save**. It will be remembered in your browser. You can change or clear it at any time using the buttons next to the Sync button.

## Google Sheet Format

The app expects your timesheet to follow this structure:

- **Tab naming:** Short month + year (e.g. `Feb 2026`)
- **Rows 1–4:** Metadata (ignored)
- **Row 5:** Column headers
- **Row 6+:** Data rows
- **Column B:** Date in `MM/DD/YY` format
- **Column H:** Hours worked (decimal)

Multiple rows per day are supported — hours are summed per date.
