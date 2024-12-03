/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office, Word */

Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    document.getElementById("process-button").onclick = processText;
  }
});

// Function to get selected text
async function getSelectedText(): Promise<string> {
  return new Promise((resolve, reject) => {
    Word.run(async (context) => {
      const selection = context.document.getSelection();
      selection.load("text");
      await context.sync();
      resolve(selection.text);
    }).catch(reject);
  });
}

// Function to send text to backend
async function sendToBackend(text: string): Promise<string> {
  try {
    const response = await fetch('http://localhost:8000/process-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text })
    });
    const data = await response.json();
    return data.processed_text;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Function to insert text back into document
// async function insertText(text: string): Promise<void> {
//   return Word.run(async (context) => {
//     const selection = context.document.getSelection();
//     selection.insertText(text, Word.InsertLocation.replace);
//     await context.sync();
//   });
// }

// Main process function
async function processText() {
  try {
    // Show status
    document.getElementById("status").innerHTML = "Processing...";
    
    // Get selected text
    const selectedText = await getSelectedText();
    
    // Send to backend and get processed text
    const processedText = await sendToBackend(selectedText);
    
    // Insert back into document
    // await insertText(processedText);
    
    // Update status
    document.getElementById("status").innerHTML = "Processing complete!";
  } catch (error) {
    document.getElementById("status").innerHTML = `Error: ${error.message}`;
    console.error("Error:", error);
  }
}
