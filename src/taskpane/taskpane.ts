/* global Word console */
import { LoremIpsum } from "lorem-ipsum";

export async function insertText(text: string) {
  try {
    await Word.run(async (context) => {
      let body = context.document.body;
      body.insertParagraph(text, Word.InsertLocation.end);
      await context.sync();
    });
  } catch (error) {
    console.log("Error: " + error);
  }
}

export async function getSelectedData(): Promise<string> {
  let text = "";
  try {
    await Word.run(async (context) => {
      const range = context.document.getSelection();
      range.load("text");
      await context.sync();
      text = range.text;
    });
  } catch (error) {
    console.log("Error: " + error);
  }
  return text;
}

export async function getDocumentText() {
  let text = "";
  try {
    await Word.run(async (context) => {
      const body = context.document.body;
      body.load("text");
      await context.sync();
      text = body.text;
    });
  } catch (error) {
    console.log("Error: " + error);
  }
  return text;
}

export async function writeToDocument(text: string) {
  try {
    await Word.run(async (context) => {
      const body = context.document.body;
      body.insertText(text, Word.InsertLocation.end);
      await context.sync();
    });
  } catch (error) {
    console.log("Error: " + error);
  }
}

export async function clearDocument() {
  try {
    await Word.run(async (context) => {
      const body = context.document.body;
      body.clear();
      await context.sync();
    });
  } catch (error) {
    console.log("Error: " + error);
  }
}

export async function addLoremIpsum() {
  const lorem = new LoremIpsum();
  const text = lorem.generateSentences(5);
  insertText(text);
}

export async function addParagraph(text: string = "") {
  try {
    await Word.run(async (context) => {
      const body = context.document.body;
      let paragraph = body.paragraphs.getLast();
      paragraph = paragraph.insertParagraph(text, Word.InsertLocation.after);
    });
  } catch (error) {
    console.log("Error: " + error);
  }
}
