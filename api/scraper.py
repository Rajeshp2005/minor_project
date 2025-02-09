import requests
from bs4 import BeautifulSoup
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def scrape_daraz_reviews(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    
    reviews = []
    page = 1
    
    while True:
        page_url = f"{url}?page={page}"
        response = requests.get(page_url, headers=headers)
        
        if response.status_code != 200:
            break
            
        soup = BeautifulSoup(response.content, 'html.parser')
        review_elements = soup.find_all("div", class_="mod-reviews")
        
        if not review_elements:
            break
            
        for review in review_elements:
            try:
                review_text = review.find("div", class_="content").get_text(strip=True)
                review_date = review.find("div", class_="top").get_text(strip=True)
                author = review.find("div", class_="middle").get_text(strip=True)
                
                reviews.append({
                    "reviewText": review_text,
                    "date": review_date,
                    "author": author
                })
            except:
                continue
                
        page += 1
        
    return reviews

@app.route('/scrape', methods=['POST'])
def scrape():
    try:
        url = request.json.get('url')
        if not url:
            return jsonify({"error": "URL is required"}), 400
            
        reviews = scrape_daraz_reviews(url)
        return jsonify({"success": True, "reviews": reviews})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=3000, debug=True)