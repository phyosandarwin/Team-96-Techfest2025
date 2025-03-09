from newspaper import Article
import requests

def scrape_website(url):
    article = Article(url)

    # get basic information about article
    article.download()
    article.parse()
    article_title = article.title

    # breaking down article content
    article.nlp()
    article_summary = article.summary

    return article_title, article_summary


