import requests
from bs4 import BeautifulSoup

def scrape_website(url):
    """
    Takes a URL, sends a GET request, parses the HTML,
    and returns scraped data (page title and main content).
    """
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        # Check if the response contains HTML content
        if 'html' not in response.headers.get('Content-Type', '').lower():
            return "Invalid content type", []
        
        # Use lxml parser for faster parsing
        soup = BeautifulSoup(response.text, 'lxml')
        
        page_title = soup.title.string.strip() if soup.title else "No title found"
        tags = soup.find_all('main') or soup.find_all('body')  # Fallback to body if main is missing
        texts = [words.get_text(strip=True) for words in tags]
        
        return page_title, texts
        
    except requests.exceptions.RequestException as e:
        return f"Request error: {e}", []
    except Exception as e:
        return f"Parsing error: {e}", []



