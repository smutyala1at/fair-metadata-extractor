# Fair Metadata Extractor

A Next.js web application that extracts research metadata from GitHub and GitLab repositories. This tool analyzes repository content using a fined-tuned large language model to extract valuable information such as dependencies, installation instructions, authors, contributors, funding information, DOI, license, and keywords.

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

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Access to the LLM service (Ollama running on Kaggle with Flask/ngrok)

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

## Configuration

The application connects to an external LLM API hosted on Kaggle and exposed via ngrok. Make sure to update the LLM_API_URL and LLM_MODEL_NAME in your .env file if the ngrok URL changes.

## LLM Service

The LLM service uses:
- Ollama to run the language model
- Flask to create a simple API
- ngrok to expose the API to the public internet

## License

[MIT](LICENSE)