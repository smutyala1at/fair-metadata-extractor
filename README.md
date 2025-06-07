# Fair Metadata Extractor

A Next.js web application that extracts research metadata from GitHub and GitLab repositories. This tool analyzes repository content using a fine-tuned large language model to extract valuable information such as dependencies, installation instructions, authors, contributors, funding information, DOI, license, and keywords.

## Features

- Extract comprehensive research metadata from code repositories
- Support for both GitHub and GitLab repositories
- Beautiful and responsive UI built with Next.js and Tailwind CSS
- Integration with Ollama LLM API via Flask and ngrok for backend
- Handles various dependency formats across programming languages

## Architecture

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **UI Components**: Custom UI built with shadcn/ui and Radix UI primitives
- **Backend**: Next.js API routes
- **LLM Service**: Flask application exposing Ollama models through ngrok

## Project Structure

The project consists of two main components:

### 1. Frontend Application (`/frontend`)

The Next.js web application that provides the user interface for repository analysis.

### 2. LLM Service (`/colab`)

The Jupyter notebook-based service that runs the LLM model for metadata extraction.

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn for the frontend
- GPU-enabled environment (Google Colab, Kaggle, local GPU) for the LLM service
- Python 3.8+ for the LLM service
- Access to Hugging Face and ngrok accounts for API tokens

## Frontend Setup

### Installation

1. Clone the repository
```bash
git clone git@github.com:smutyala1at/fair-metadata-extractor.git
cd frontend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env` file based on `.env.example` and update the LLM API URL with your ngrok URL

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## LLM Service Setup

The `fine-tuned-llama.ipynb` notebook in the `/colab` directory creates a complete backend service that:

1. Sets up a GPU-accelerated environment for running LLMs
2. Downloads and configures a fine-tuned Llama model for metadata extraction
3. Deploys an API endpoint using Flask and ngrok
4. Provides robust metadata extraction capabilities

### How the LLM Service Works

The service follows these key steps:

1. **Environment Setup**: Configures CUDA for GPU acceleration and installs required dependencies
2. **Model Preparation**: Downloads a fine-tuned Llama model from Hugging Face
3. **Ollama Integration**: Sets up and configures Ollama as the model serving framework 
4. **System Prompt**: Defines a specialized prompt for research metadata extraction
5. **API Development**: Creates a Flask API and exposes it via ngrok for external access
6. **Frontend Integration**: Provides an endpoint for the Next.js frontend to communicate with

### Running the LLM Service

The notebook is designed to run on Google Colab or any Jupyter environment with GPU access:

1. Open the notebook (`/colab/fine-tuned-llama.ipynb`) in a GPU-enabled environment
2. Run all cells in sequence
3. Copy the generated ngrok URL from the output
4. Configure the frontend's `.env` file with this URL

### Security Considerations

Before deploying:
1. Replace the Hugging Face token placeholder with your own token
2. Replace the ngrok authentication token placeholder with your own token
3. Consider implementing additional authentication on the Flask API

## Metadata Extraction

The LLM service is specifically fine-tuned to extract the following metadata from code repositories:

- **Dependencies**: Package names and versions
- **Installation Instructions**: Setup steps or referenced files
- **Authors**: Names and details
- **Contributors**: Names and contributions
- **Funding**: Grant numbers and agencies
- **DOI**: Digital Object Identifiers
- **License**: Name, version, and terms
- **Keywords**: Technical terms describing the software

## Integration Between Components

The frontend application communicates with the LLM service through a POST endpoint:

```
{ngrok_url}/generate_ollama_response
```

The request body should include:
```json
{
  "prompt": "Repository content to analyze",
  "model": "metadata-extractor"
}
```

## Configuration

The application connects to an external LLM API hosted and exposed via ngrok. Make sure to update the `LLM_API_URL` and `LLM_MODEL_NAME` in your `.env` file if the ngrok URL changes.

## Further Development and Contributions

Contributions to this project are warmly welcomed! Feel free to fork the repository, make improvements, and submit pull requests. Here are some ways you can contribute:

### Fine-tuning the Model

The project uses a Llama 3.1 8B model that has already been fine-tuned for metadata extraction, which contributors can enhance further:

1. Feel free to experiment with the [smutyala1at/metadata_extractor](https://huggingface.co/smutyala/metadata_extractor) fine-tuned model
2. Create your own training datasets for specific research domains or repository types
3. Further fine-tune the model using Unsloth/Hugging Face's training pipeline or your preferred method
4. Share your improvements with the community to help advance research metadata extraction

### Extending the Frontend

The Next.js frontend can be extended in several ways:

- Add support for additional repository hosting platforms (BitBucket, GitLab self-hosted)
- Create export options for the metadata in various formats (CSV, JSON)

### Improving the Extraction Pipeline

The extraction pipeline can be enhanced for better performance:

- Add caching mechanisms for previously analyzed repositories
- Implement concurrent processing for faster analysis
- Add support for analyzing specific branches or tags

### Community Collaboration

This project aims to be community-driven:

- If you have ideas for new features, open an issue to discuss them
- For bugs or issues, please report them with detailed steps to reproduce
- Share your experience using the tool with different types of repositories
- Suggest improvements to the training data or model architecture

All contributions, whether code, documentation, or ideas, are greatly appreciated! Feel free to get involved in whatever way you can.

## License

[MIT](LICENSE)