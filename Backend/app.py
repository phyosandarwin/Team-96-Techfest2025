from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

# Import the fieles 
from webscraping import scrape_website
from MachineLearning.example import extract_keywords

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/scrape', methods=['GET'])
def scrape_endpoint():
    # Retrieve the 'url' parameter from the query string, e.g., /scrape?url=https://example.com
    input_url = request.args.get('url')
    
    # If no URL provided, return 400 Bad Request
    if not input_url:
        return jsonify({"error": "No 'url' query parameter provided"}), 400
    
    try:
        # Use the scrape_website function from webscraping.py
        page_title, texts = scrape_website(input_url)
        
        # Build output string
        output_string = f"Page Title: {page_title}\n"
        output_string += "Text:\n"
        for text in texts:
            output_string += f" - {text}\n"


        # Add the Machine learning function here 
        # Here is an example, where we just extracted the keywords from the output string 
        # TODO: Add the ML functions to call 
        keywords = extract_keywords(output_string)
        
        return jsonify({"content": keywords})
    
    except requests.exceptions.RequestException as e:
        # Handle any request-related exceptions
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Start the Flask development server
    app.run(host="127.0.0.1", port=5000, debug=True)
