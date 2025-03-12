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
            contents = ["Thoroughly check the image for any text. Summarise it into a string of 3 keywords, without punctuation. If no text is found, respond with 'No text detected in the image.'", image]
        )
        print(response.text)
        return response.text
    
    def extract_keywords_from_summary(self, summary):
        response = self.client.models.generate_content(
            model=MODEL,
            contents=["Summarise the text into a string of 3 keywords, without any punctuation.", summary],
        )
        return response.text
    
# class to return news sources
class NewsAPI:
    DOMAINS = [
        "who.int",  
        "un.org",  
        "imf.org",  
        "worldbank.org",  
        "oecd.org",  
        "mothership.sg",
        "straitstimes.com",
        "channelnewsasia.com",
        "todayonline.com",
        "zaobao.com.sg",
        "businesstimes.com.sg",
        "bbc.com",
        "bbc.co.uk",
        "reuters.com",
        "apnews.com",
        "theguardian.com",
        "nytimes.com",
        "washingtonpost.com",
        "cnn.com",
        "npr.org",  
        "wsj.com",  
        "bloomberg.com",
        "abcnews.go.com",
        "cbsnews.com",
        "nbcnews.com",
        "latimes.com",
        "snopes.com",
        "factcheck.org",
        "politifact.com",
        "fullfact.org",  
        "truthout.org",  
        "sciencedirect.com",
        "nature.com",
        "sciencemag.org",
        "nationalgeographic.com",
        "newscientist.com",
        "malwarebytes.com",
        "kaspersky.com",
        "mcafee.com",
    ]

    def __init__(self):
        self.client = NewsApiClient(api_key=os.getenv("NEWSAPI_API_KEY"))

    def get_news_sources(self, keywords):
        domains_str = ','.join(self.DOMAINS)
        all_headlines = self.client.get_everything(
            q=keywords,
            domains=domains_str,
            sort_by='relevancy',
            language='en'
        )
        return {
            "status": all_headlines["status"],
            "totalResults": all_headlines["totalResults"],
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
                for article in all_headlines["articles"]
            ]
        }