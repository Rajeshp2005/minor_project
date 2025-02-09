from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import base64
import io
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

app = Flask(__name__)
CORS(app)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'POST')
    return response

@app.route('/analyze', methods=['POST', 'OPTIONS'])
def analyze_reviews():
    if request.method == 'OPTIONS':
        return '', 200

    try:
        # Get reviews from request
        data = request.json
        reviews = data.get('reviews', [])
        
        # Create DataFrame
        df = pd.DataFrame(reviews)
        
        # Initialize analyzer
        analyzer = SentimentIntensityAnalyzer()
        
        # Analyze sentiment
        df['sentiment'] = df['reviewText'].apply(lambda x: 
            "Positive" if analyzer.polarity_scores(x)['compound'] > 0 
            else "Negative" if analyzer.polarity_scores(x)['compound'] < 0 
            else "Neutral")
        
        # Calculate metrics
        sentiment_counts = df['sentiment'].value_counts(normalize=True) * 100
        compound_scores = df['reviewText'].apply(lambda x: analyzer.polarity_scores(x)['compound'])
        confidence_score = (compound_scores.mean() + 1) / 2 * 10

        # Generate visualization
        plt.figure(figsize=(10, 6))
        sns.barplot(x=sentiment_counts.index, y=sentiment_counts.values, palette='viridis')
        plt.title('Sentiment Distribution')
        
        # Convert plot to base64
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        plot_base64 = base64.b64encode(buffer.getvalue()).decode()
        plt.close()

        return jsonify({
            'success': True,
            'data': {
                'sentiment_distribution': {
                    'positive': round(sentiment_counts.get("Positive", 0), 2),
                    'negative': round(sentiment_counts.get("Negative", 0), 2),
                    'neutral': round(sentiment_counts.get("Neutral", 0), 2)
                },
                'confidence_score': round(confidence_score, 2),
                'total_reviews': len(df),
                'plot': plot_base64
            }
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)