from flask import Flask, request, jsonify, send_file
from diffusers import StableDiffusionPipeline
import torch
import io
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)

# Load Stable Diffusion model
pipe = StableDiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-2-1")
pipe = pipe.to("cuda" if torch.cuda.is_available() else "cpu")

@app.route("/generate", methods=["POST"])
def generate_image():
    data = request.json
    prompt = data.get("prompt", "")
    
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400
    
    # Generate image
    image = pipe(prompt).images[0]
    
    # Save image to a byte stream
    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format="PNG")
    img_byte_arr.seek(0)
    
    return send_file(img_byte_arr, mimetype="image/png")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
