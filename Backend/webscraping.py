import requests
from bs4 import BeautifulSoup

def scrape_website(url):
    """
    Takes a URL, sends a GET request, parses the HTML,
    and returns scraped data (page title and H1 tags).
    """
    # Send a GET request to the provided URL
    response = requests.get(url)
    
    # Raise an HTTPError if an unsuccessful status code is returned
    response.raise_for_status()
    
    # Parse the HTML content
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Extract the page title
    page_title = soup.title.string if soup.title else "No title found"
    
    # Extract text from all <h1> tags
    tags = soup.find_all('main')
    texts = [words.get_text(strip=True) for words in tags]
    
    return page_title, texts
