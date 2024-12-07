# import threading
from flask import Flask, request, jsonify
import os
from flask.cli import F
from langchain_groq import ChatGroq
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
from flask_cors import CORS

import time


load_dotenv()

groq_api_key = "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"
os.environ["GOOGLE_API_KEY"] = "AIzaSyDLggVsJM9ukyY_XmPpRu7_j28IVnr24kU"

app = Flask(__name__)
CORS(app)


llm = ChatGroq(groq_api_key=groq_api_key, model_name="Llama3-8b-8192")


def get_prompt():
    return ChatPromptTemplate.from_template(
        """
        Answer the questions based on the provided context only.
        Please provide the most accurate response based on the question.
        Do not start the answer with `Based on the provided context,` or `According to the provided context,`.
        Do not provide any information that is not present in the context.
        Do not provide any information that is not asked for.
        Always provide the most accurate and concise response.
        <context>
        {context}
        <context>
        Questions:{input}
        """
    )


vector_store = None


def initialize_vector_store():
    global vector_store
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    loader = PyPDFDirectoryLoader("./doms")
    docs = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    final_documents = text_splitter.split_documents(docs[:20])
    vector_store = FAISS.from_documents(final_documents, embeddings)


@app.route("/ask", methods=["POST"])
def ask():
    global vector_store
    question = request.json.get("question")
    if not question:
        return jsonify({"error": "No question provided."}), 400

    if vector_store:
        document_chain = create_stuff_documents_chain(llm, get_prompt())
        retriever = vector_store.as_retriever()
        retrieval_chain = create_retrieval_chain(retriever, document_chain)

        start = time.process_time()
        response = retrieval_chain.invoke({"input": question})
        end = time.process_time()

        # Log fetched document parts
        for doc in response["context"]:
            # logging.info(f"Fetched Document: {doc.page_content}")
            print(f"Fetched Document: {doc.page_content}")

        return jsonify(
            {
                "response_time": f"{end - start:.2f} seconds",
                "answer": response["answer"],
            }
        )
    else:
        return jsonify({"error": "Vector store is not initialized."}), 500


@app.route("/tell", methods=["POST"])
def tell():
    global vector_store
    document_content = request.json.get("context")
    if not document_content:
        return jsonify({"error": "No document provided."}), 400

    if vector_store:
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=200
        )
        document = Document(page_content=document_content)
        final_documents = text_splitter.split_documents([document])
        vector_store = FAISS.from_documents(final_documents, embeddings)
        return jsonify({"message": "Document added to the vector store."})
    else:
        return jsonify({"error": "Vector store is not initialized."}), 500


@app.route("/reset", methods=["POST"])
def reset():
    global vector_store
    vector_store = None
    initialize_vector_store()
    return jsonify({"message": "Vector store reset."})


if __name__ == "__main__":
    initialize_vector_store()
    app.run(debug=True)
