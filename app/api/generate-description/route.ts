import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  const { prompt } = await request.json();

  const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,  
  });

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { systemInstruction: "Generate a product description in Vietnamese." },
    });

    return Response.json({ text: response.text }, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "AI generate failed" }, { status: 500 });
  }
}
