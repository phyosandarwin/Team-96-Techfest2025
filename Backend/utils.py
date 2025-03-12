from google import genai
from google.genai import types
from newsapi import NewsApiClient
import os
from dotenv import load_dotenv
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path=env_path)

MODEL = "gemini-2.0-flash"
# class for LLM
class LLM:
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    def extract_keywords_from_image(self, image):
        response = self.client.models.generate_content(
            model=MODEL,
            contents = ["Summarise the text in the image into three words. If no text is found in the image, respond with 'No text detected in the image.'", image]
        )
        return response.text
    
    def extract_keywords_from_summary(self, summary):
        response = self.client.models.generate_content(
            model=MODEL,
            contents=["Summarise the text into a short keyphrase. Do not add any punctuation.", summary],
        )
        return response.text
    
# class to return news sources
class NewsAPI:
    def __init__(self):
        self.client = NewsApiClient(api_key=os.getenv("NEWSAPI_API_KEY"))

    def get_news_sources(self, keywords):

        top_headlines = self.client.get_everything(q=keywords, sort_by='relevancy', language='en')
        return {
            "status": top_headlines["status"],
            "totalResults": top_headlines["totalResults"],
            "articles": [
                {
                    "source": {
                        "id": article["source"]["id"],
                        "name": article["source"]["name"]
                    },
                    "title": article["title"],
                    "url": article["url"],
                    "publishedAt": article["publishedAt"],
                    "content": article["content"]
                }
                for article in top_headlines["articles"]
            ]
        }
