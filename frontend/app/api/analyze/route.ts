import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { extractGitHubContent, extractGitLabContent } from '@/lib/extractors';
import { normalizeArrayField } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'Repository URL is required' }, { status: 400 });
    }

    const platform = url.includes('github.com') ? 'github' : 'gitlab';
    const cookieStore = cookies();
    const token = cookieStore.get(`vcs-token-${platform}`)?.value;

    const content = platform === 'github' 
      ? await extractGitHubContent(url, token)
      : await extractGitLabContent(url, token); 

    const llmApiUrl = process.env.LLM_API_URL || 'https://your-default-llm-api-url.com/generate_ollama_response';
    const llmModelName = process.env.LLM_MODEL_NAME || 'metadata-extractor';

    try {
      const llmResponse = await fetch(llmApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: content,
          model: llmModelName,
        }),
      });

      if (!llmResponse.ok) {
        const errorData = await llmResponse.text();
        console.error('LLM API error:', errorData);
        throw new Error(`LLM API request failed with status ${llmResponse.status}: ${errorData}`);
      }

      const llmResult = await llmResponse.json();
      console.log('LLM API response:', llmResult);
      
      let responseData = llmResult;

      if (llmResult && typeof llmResult.response === 'string') {
        try {
          let cleanedResponse = llmResult.response;
          cleanedResponse = cleanedResponse.replace(/\\'/g, "'");
          cleanedResponse = cleanedResponse.replace(/\\"/g, '"');
          
          responseData = JSON.parse(cleanedResponse);
          console.log('Successfully parsed LLM response as JSON');
        } catch (e) {
          console.error("Failed to parse LLM response string:", e);
          responseData = {
            parsingError: true,
            message: "The metadata could not be properly parsed. Raw data is available.",
            rawResponse: llmResult.response
          };
        }
      } else if (llmResult && llmResult.data && typeof llmResult.data === 'object') {
        responseData = llmResult.data;
      }

      if (responseData && typeof responseData === 'object' && responseData !== null) {
        if (Object.prototype.hasOwnProperty.call(responseData, 'Installation_Instructions')) {
          const instructions = responseData.Installation_Instructions;
          responseData.InstallationInstructions = normalizeArrayField(instructions);
          delete responseData.Installation_Instructions;
        }
        
        const arrayFields = ['Authors', 'Contributors', 'Keywords', 'Dependencies', 'Funding', 'DOI', 'InstallationInstructions'];
        for (const field of arrayFields) {
          if (field in responseData) {
            responseData[field] = normalizeArrayField(responseData[field]);
          }
        }
        
        for (const [key, value] of Object.entries(responseData)) {
          const fieldName = key.replace(/_/g, ' ').toLowerCase();
          
          if (value === null) {
            responseData[key] = `No ${fieldName} information available`;
            continue;
          }
          
          if (typeof value === 'string' && value.trim() === "") {
            responseData[key] = `No ${fieldName} information available`;
            continue;
          }
          
          if (Array.isArray(value) && value.length === 0) {
            responseData[key] = `No ${fieldName} information available`;
          }
        }
      }

      return NextResponse.json({
        success: true,
        data: responseData, 
      });

    } catch (llmError) {
      console.error('Error calling LLM API:', llmError);
      return NextResponse.json(
        { error: llmError instanceof Error ? llmError.message : 'Failed to get analysis from LLM' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze repository' },
      { status: 500 }
    );
  }
}