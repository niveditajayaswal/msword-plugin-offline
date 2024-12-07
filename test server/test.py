import requests
import json


def test_ask_endpoint():
    # URL of the running Flask app
    url = "http://127.0.0.1:5000/ask"

    # Test payload
    payload = {"question": input("Enter your question: ")}

    try:
        # Send POST request to the /ask endpoint
        response = requests.post(url, json=payload)

        # Check if the response is successful
        if response.status_code == 200:
            data = response.json()
            print("Response time:", data.get("response_time"))
            print("Answer:", data.get("answer"))
        else:
            print("Failed with status code:", response.status_code)
            print("Error message:", response.json())

    except Exception as e:
        print("An error occurred:", e)


if __name__ == "__main__":
    test_ask_endpoint()
