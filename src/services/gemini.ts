import { GoogleGenerativeAI } from "@google/generative-ai";

// Configure the API
const genAI = new GoogleGenerativeAI("AIzaSyDiItOTczdKCepW0lK00uOWPT0_Hnxeil0");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function getChatResponse(userInput: string): Promise<string> {
  try {
    console.log('Sending to Gemini:', userInput);
    
    // Generate content directly
    const result = await model.generateContent(userInput);
    const response = await result.response;
    const text = response.text();
    
    console.log('Received from Gemini:', text);
    return text;
  } catch (error) {
    console.error('Error:', error);
    return "I'm having trouble right now. Please try again.";
  }
}
