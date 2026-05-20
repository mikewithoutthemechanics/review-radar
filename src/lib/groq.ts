const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function chatCompletion(
  messages: GroqMessage[],
  model = "llama-3.1-8b-instant"
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set");

  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 512,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  return data.choices[0]?.message?.content ?? "";
}

export async function generateReviewResponse(
  reviewText: string,
  rating: number,
  authorName: string,
  brandVoice: string,
  businessName: string
): Promise<string> {
  const sentiment = rating >= 4 ? "positive" : rating === 3 ? "neutral" : "negative";

  const systemPrompt = `You are a review response assistant for "${businessName}", a South African local business. 
Write responses in this brand voice: ${brandVoice || "Professional, warm, and appreciative"}.

Guidelines:
- Keep responses concise (2-4 sentences)
- Thank positive reviewers genuinely
- Address concerns in neutral/negative reviews with empathy
- Never be defensive or dismissive
- Include the reviewer's name when appropriate
- For negative reviews, offer to resolve the issue offline
- Use South African English spelling conventions
- Be authentic, not robotic`;

  const userPrompt = `Write a response to this ${sentiment} ${rating}-star review from ${authorName}:

"${reviewText}"`;

  return chatCompletion([
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ]);
}

export async function analyzeSentiment(
  text: string
): Promise<{ sentiment: "positive" | "neutral" | "negative"; keywords: string[] }> {
  const systemPrompt = `Analyze the sentiment and extract key topics from a customer review. 
Respond ONLY with valid JSON in this exact format:
{"sentiment": "positive|neutral|negative", "keywords": ["keyword1", "keyword2"]}`;

  const result = await chatCompletion([
    { role: "system", content: systemPrompt },
    { role: "user", content: text },
  ]);

  try {
    return JSON.parse(result);
  } catch {
    return { sentiment: "neutral", keywords: [] };
  }
}

export async function generateReportInsights(
  metrics: {
    totalReviews: number;
    averageRating: number;
    responseRate: number;
    sentimentBreakdown: { positive: number; neutral: number; negative: number };
    topKeywords: string[];
  },
  businessName: string
): Promise<string[]> {
  const systemPrompt = `You are a reputation analytics expert for South African local businesses.
Generate 3-5 actionable recommendations based on the review metrics.
Respond ONLY with a JSON array of strings, e.g. ["recommendation 1", "recommendation 2"]`;

  const userPrompt = `Business: ${businessName}
Period metrics:
- Total reviews: ${metrics.totalReviews}
- Average rating: ${metrics.averageRating.toFixed(1)}/5
- Response rate: ${(metrics.responseRate * 100).toFixed(0)}%
- Sentiment: ${metrics.sentimentBreakdown.positive} positive, ${metrics.sentimentBreakdown.neutral} neutral, ${metrics.sentimentBreakdown.negative} negative
- Top keywords: ${metrics.topKeywords.join(", ")}

Generate actionable recommendations:`;

  const result = await chatCompletion([
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ]);

  try {
    return JSON.parse(result);
  } catch {
    return ["Monitor and respond to all reviews within 24 hours to improve engagement."];
  }
}
