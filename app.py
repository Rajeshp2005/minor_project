import streamlit as st
import pickle

# Load the trained model
MODEL_PATH = "model_RandomForestClassifier.pkl"
VECTORIZER_PATH = "vectorizer.pkl"  # Ensure you saved the vectorizer during training

with open(MODEL_PATH, "rb") as file:
    model = pickle.load(file)

with open(VECTORIZER_PATH, "rb") as file:
    vectorizer = pickle.load(file)

# Streamlit UI
st.title("Text Classification with Random Forest")
st.write("Enter text below, and the model will classify it.")

# User input
user_input = st.text_area("Enter text here:")

# Define label mapping based on your dataset (adjust accordingly)
label_mapping = {0: "Negative", 1: "Neutral", 2: "Positive"}  # Modify based on your classes

if st.button("Predict"):
    if user_input:
        # Convert text to numerical feature vector
        processed_text = vectorizer.transform([user_input])  # Transform text
        prediction = model.predict(processed_text)[0]  # Get single prediction
        readable_label = label_mapping.get(prediction, "Unknown")  # Convert to readable label
        st.success(f"Predicted Sentiment: {readable_label}")
    else:
        st.warning("Please enter text to classify.")

# Run the app using: streamlit run app.py
