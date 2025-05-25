import pandas as pd
import matplotlib.pyplot as plt
from textblob import TextBlob

# Sample social media posts (replace this with your real data)
posts = [
    "I love this new phone! The camera quality is amazing.",
    "I'm feeling really sad about what happened yesterday.",
    "It's an average product, not too good, not too bad.",
    "Absolutely fantastic experience with the service!",
    "Worst customer support ever. Totally disappointed.",
    "Meh, it's okay I guess. Could be better.",
    "Thrilled to announce our product launch! Stay tuned.",
    "Why is this app so slow and buggy?!",
    "Happy to be a part of this amazing community.",
    "I don't know what to say. Mixed feelings."
]

# Create DataFrame
df = pd.DataFrame(posts, columns=["Post"])

# Analyze Sentiment using TextBlob
def analyze_sentiment(text):
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity
    if polarity > 0.1:
        sentiment = "Positive"
    elif polarity < -0.1:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"
    return pd.Series([polarity, subjectivity, sentiment])

df[['Polarity', 'Subjectivity', 'Sentiment']] = df['Post'].apply(analyze_sentiment)

# Export to CSV
df.to_csv("sentiment_results.csv", index=False)
print("✅ Results saved to 'sentiment_results.csv'")

# Plot Histogram of Sentiments
plt.figure(figsize=(8, 5))
df['Sentiment'].value_counts().plot(kind='bar', color=['green', 'red', 'gray'])
plt.title("Sentiment Distribution")
plt.xlabel("Sentiment")
plt.ylabel("Number of Posts")
plt.tight_layout()
plt.savefig("sentiment_histogram.png")
plt.show()
