from flask import Flask, request, jsonify
import requests
import os
from flask_cors import CORS
from PIL import Image

# Import the files
from webscraping import scrape_website
from utils import LLM, NewsAPI

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

llm = LLM()
news = NewsAPI()

@app.route('/scrape', methods=['GET'])
def scrape_endpoint():
    """API endpoint to scrape a website, extract keywords, and find news sources."""
    input_url = request.args.get('url')

    if not input_url:
        return jsonify({"error": "No 'url' query parameter provided"}), 400

    page_title, summary = scrape_website(input_url)

    if not summary:
        return jsonify({"error": page_title}), 500

    try:
        # Call the LLM function to extract keywords
        response = llm.extract_keywords_from_summary(summary)
        
        # Call the news function to get matched sources
        news_sources = news.get_news_sources(response)

        articles = [
            {
                "source_name": article.get("source", {}).get("name", "Unknown"),
                "title": article.get("title", "No title"),
                "url": article.get("url", ""),
                "publishedAt": article.get("publishedAt", "Unknown date"),
            }
            for article in news_sources.get("articles", [])
        ]

        return jsonify({
            'extracted_content': response,
            'matched_sources': articles
        }), 200

    except Exception as e:
        return jsonify({"error": f"Processing error: {e}"}), 500

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

    # Call the LLM function to extract keywords from image text
    response = llm.extract_keywords_from_image(image)

    if response == "No text detected in the image.":
        return jsonify({"error": response}),

    # Call the news function to get matched sources
    news_sources = news.get_news_sources(response)

    articles = [
        {
            "source_name": article["source"]["name"],
            "title": article["title"],
            "url": article["url"],
            "publishedAt": article["publishedAt"],
        }
        for article in news_sources["articles"]
    ]

    return jsonify({
        'extracted_content': response,
        'matched_sources': articles
    }), 200    

@app.route('/delete_uploads', methods=['POST'])
def delete_uploads():
    try:
        folder = UPLOAD_FOLDER
        for filename in os.listdir(folder):
            file_path = os.path.join(folder, filename)
            if os.path.isfile(file_path):
                os.unlink(file_path)
        return jsonify({"message": "All images removed successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "main":
    # Start the Flask development server
    app.run(host="127.0.0.1", port=5000, debug=True)