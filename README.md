# Team-96-Techfest2025

## Set Up 

1. Clone the repository:
   
``` git clone https://github.com/phyosandarwin/Team-96-Techfest2025.git```

2. Navigate into project directory and set up virtual environment:
For windows:

```python -m venv [env name]```

## Inspiration
With the spread of misinformation and the prevalence of echo chambers, people often encounter content that reinforces their beliefs or leaves them conflicted about what to trust. To overcome this dilemma and break out of biased information bubbles, we built VerifiAI where users can simply copy a URL or upload a screenshot, and within seconds, users can view the reliability of the article. They can then instantly share the results with their social circles, helping to combat the spread of misinformation. 

## What it does
With VerifiAI, users can upload image screenshots of text or provide article URLs where the content is summarised into keywords by multimodal Gemini 2.0 Flash model. The extracted keywords are then used to query for real-time news results using the NewsAPI. Users can then share the results with their social circles to combat misinformation collectively.

## How we built it
Our app is divided into 3 main parts, which are Frontend, Backend and AI. For the Frontend part, our app is interactive and user-centric, and it is built using HTML/CSS and JavaScript. Our backend is built with Python and Flask. The AI part would be the use of Gemini 2.0 Flash model to carry out multimodal data input processing, such as our image to text conversion as well as text summarisation. We also make use of external API such as NewsAPI to verify the authenticity of the information. 

## Challenges we ran into
We had to carefully establish communication between our Flask backend and JavaScript frontend.
When designing the UI/UX for Verification Results, striking a balance between simplicity and transparency was challenging — we aimed to create an intuitive interface that clearly presents verification results without overwhelming users with technical details.

## Accomplishments that we're proud of
1. Our platform offers an intuitive interface featuring both image screenshots and URL verification links, giving users multiple options to upload and confirm the authenticity of their news and articles.
2. Our classification system is straightforward. We divide it into 3 different sections (Fake, Neutral and Reliable) which are easy for users to understand the content.
3. Rather than providing just the score, we also provide users with the matched sources to help them judge content authenticity.

## What we learned
We learnt to integrate Machine learning techniques into our backend, including Prompt engineering, where we tried out Zero-shot prompting, Single-shot prompting, and Few-shot prompting. Zero-shot prompting worked the best for our use case. 

## What's next for VerifiAI
1. A collaborative platform where multiple users can log in, and submit image or URL inputs for fact-checking. The results would be recorded and displayed on a shared dashboard, allowing users to see what claims have been verified in their social circle. Users can be notified when a previously fact-checked claim resurfaces, helping them stay vigilant. 
2. Integrated browser extension that automatically flags potentially misleading articles while browsing.
3. Interactive AI chatbot that users can query for fact-checks.
