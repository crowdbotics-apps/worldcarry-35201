import time
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options


class AMAZONScraper:
    MAX_RETRIES = 5
    WAIT_BETWEEN_RETRY = 1

    def __init__(self, soup: BeautifulSoup) -> None:
        self.soap = soup

    @staticmethod
    def get_title(soup: BeautifulSoup) -> str:
        try:
            title = soup.select("#productTitle")[0].get_text().strip()
        except Exception as ex:
            title = "Title not available"
        return title

    @staticmethod
    def get_image_url(soup: BeautifulSoup) -> str:
        try:
            image_url = soup.find("div", {"id": "imgTagWrapperId"}).img['src']
        except Exception as ex:
            image_url = "Image not available"
        return image_url

    @staticmethod
    def get_price(soup: BeautifulSoup) -> str:
        price = 'Not Found'

        # price range case
        try:
            price = soup.find("span", {"class": "a-price-range"}).get_text().split('$')
            price = '${} - ${}'.format(price[1], price[-1])
            return price
        except Exception as ex:
            pass
        # single quoation
        try:
            price_int = soup.find("span", {"class": "a-price-whole"}).get_text()
            price_decimal = soup.find("span", {"class": "a-price-fraction"}).get_text()
            price = '${}{}'.format(price_int, price_decimal)
            return price
        except Exception as ex:
            pass

        try:
            price = soup.find("span", {"class": "a-size-medium a-color-price"}).get_text().strip()
            return price
        except Exception as ex:
            pass

        return price

    @staticmethod
    def get_category(soup: BeautifulSoup) -> str:
        try:
            category = soup.find("a", {"class": "a-link-normal a-color-tertiary"}).get_text().strip()
        except Exception as ex:
            category = "Category not available"
        return category

    def get_details(self) -> dict:
        soap = self.soap
        title = self.get_title(soap)
        image_url = self.get_image_url(soap)
        price = self.get_price(soap)
        category = self.get_category(soap)
        return {'title': title, 'image_url': image_url, 'price': price, 'category': category}


class EBAYScraper:
    MAX_RETRIES = 5
    WAIT_BETWEEN_RETRY = 1

    def __init__(self, soup: BeautifulSoup) -> None:
        self.soap = soup

    @staticmethod
    def get_title(soup: BeautifulSoup) -> str:
        try:
            title = soup.find("h1", {"class": "x-item-title__mainTitle"}).get_text()
        except Exception as ex:
            title = "Title not available"
        return title

    @staticmethod
    def get_image_url(soup: BeautifulSoup) -> str:
        try:
            image_url = soup.find("img", {"id": "icImg"})['src']
        except Exception as ex:
            image_url = "Image not available"
        return image_url

    @staticmethod
    def get_price(soup: BeautifulSoup) -> str:
        price = 'Not Found'
        # price range case
        try:
            price = soup.find("span", {"id": "prcIsum"}).get_text()
            if ["GBP", "EUR"] not in price:
                price = "${}".format(price.split()[1])
            else:
                price = soup.find("span", {"id": "convbidPrice"}).get_text().split("(")[0].split(" ")[1]
            return price
        except Exception as ex:
            pass

        # single quoation
        try:
            price = soup.find("span", {"id": "prcIsum_bidPrice"}).get_text().split(' ')[1]
            return price
        except Exception as ex:
            pass

        try:
            price = soup.find("span", {"id": "mm-saleDscPrc"}).get_text().split(' ')[1]
            return price
        except Exception as ex:
            pass

        try:
            price = soup.find("div", {"class": "display-price"}).get_text()
            return price
        except Exception as ex:
            pass

        return price

    @staticmethod
    def get_category(soup: BeautifulSoup) -> str:
        print("print-1")
        try:
            image_url = soup.find_all("a", {"class": "seo-breadcrumb-text"})[0].get_text()
        except Exception as ex:
            image_url = "Category not available"
        return image_url

    def get_details(self) -> dict:
        soap = self.soap
        title = self.get_title(soap)
        image_url = self.get_image_url(soap)
        price = self.get_price(soap)
        category = self.get_category(soap)
        return {'title': title, 'image_url': image_url, 'price': price, 'category': category}


def get_product_details(url: str) -> dict:
    options = Options()
    options.add_argument('--headless')
    options.add_argument("start-maximized")
    options.add_argument("disable-infobars")
    options.add_argument("--disable-extensions")
    options.add_argument("--disable-gpu")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--no-sandbox")
    driver = webdriver.Chrome(chrome_options=options)
    driver.get(url)
    time.sleep(3)
    page = driver.page_source
    driver.quit()
    soup = BeautifulSoup(page, 'html.parser') #  If this line causes an error, run 'pip install html5lib' or install html5lib
    # provider can either be amazon or ebay for now.
    if 'amazon' in url:
        scraper = AMAZONScraper(soup=soup)
        data = scraper.get_details()

    elif 'ebay' in url:
        scraper = EBAYScraper(soup=soup)
        data = scraper.get_details()
    else:
        return {'status': False, 'error': 'Invalid Url: {}'.format(url), 'data': None}

    return {'status': True, 'error': None, 'data': data}
