from flask import Flask, request, jsonify
import requests
import os
from flask_cors import CORS
from PIL import Image

# Import the files
from webscraping import scrape_website
from MachineLearning.example import extract_keywords

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/scrape', methods=['GET'])
def scrape_endpoint():
    # Retrieve the 'url' parameter from the query string
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
        # Example: Extract keywords from the scraped text
        keywords = extract_keywords(output_string)
        
        return jsonify({"content": keywords})
    
    except requests.exceptions.RequestException as e:
        # Handle any request-related exceptions
        return jsonify({"error": str(e)}), 500

@app.route('/image', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # Open the image for processing
    image = Image.open(file_path)
    width, height = image.size  # Example: Get image dimensions
    
    return jsonify({
        'message': 'File uploaded successfully',
        'filename': file.filename,
        'width': width,
        'height': height
    }), 200    

if __name__ == "__main__":
    # Start the Flask development server
    app.run(host="127.0.0.1", port=5000, debug=True)
