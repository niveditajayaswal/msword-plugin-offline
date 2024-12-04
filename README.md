# MS Word Plugin Offline

This plugin is a test plugin to demonstrate how to create a plugin for MS Word that can be used offline. This plugin connects to a local server to save selected text from a Word document and then retrieve the saved text using socket-io client.

## Installation

1. Clone the repository
2. Open the project in Visual Studio Code
3. Run the following command to install the required packages:

```bash
npm install
```

4. Run the following command to build the project:

```bash
npm run build:dev
```

5. Run the following command to start the server:

```bash
npm run start
```

6. Setup the backend
open a new terminal and run the following commands:

In Linux:

```bash
cd 'test server'
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

In Windows:

```PowerShell
cd 'test server'
python -m venv venv
.\venv\Scripts\Activate
pip install -r requirements.txt
python app.py
```

7. Open MS Word add click "add-ins".
8. Find addins named `Neural Nexus` and click on it.

## Usage

1. Select the text you want to save.
2. Click on the `Get Selected Text` button.
3. Click on the `Send to Server` button.
4. Click on the `Get from Server` button to retrieve the saved text.

## Other Features

**Add Lorem Ipsum**: Click on the `Add Lorem Ipsum` button to add some dummy text to the document.

**Clear Document**: Click on the `Clear Document` button to clear the document.
