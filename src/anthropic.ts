import Anthropic from "@anthropic-ai/sdk";
import * as z from "zod";

const client = new Anthropic({
  apiKey: process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY,
});

const llmResponseExerciseSchema = z.object({
  sets: z.number(),
  minReps: z.number(),
  maxReps: z.number(),
  weight: z.number(),
  restIntervalSeconds: z.number().optional(),
  name: z.string(),
  description: z.string(),
  muscleGroup: z.string(),
});

const llmResponseSchema = z.object({
  exercises: z.array(llmResponseExerciseSchema),
});

export async function getExercisesFromText(
  text: string
): Promise<z.infer<typeof llmResponseSchema>> {
  const instructions = [
    "Process the following text obtained via OCR (expect incoherent words) of gym exercises.",
    "Do not come up with any data that's not part of the following text.",
    "If you don't know, return either empty string or 0.",
    "You can try to infer 'description' and 'muscleGroup' if it's not available.",
    "Try to fix spelling errors and also capitalize exercise names, descriptions and muscle group correctly.",
    "If you recognize an exercise name, write a one paragraph description (following the same language as the one detected on the image).",
  ];

  const response = await client.messages.create({
    max_tokens: 1024,
    tools: [
      {
        name: "json",
        description: "",
        // @ts-expect-error
        input_schema: z.toJSONSchema(llmResponseSchema),
      },
    ],
    tool_choice: { name: "json", type: "tool" },
    messages: [
      {
        role: "user",
        content: instructions.join(" ") + "\n\n" + text,
      },
    ],
    model: "claude-sonnet-4-20250514",
  });

  if (response.content[0]?.type !== "tool_use") {
    throw new Error("Unexpected response from LLM API.");
  }

  const llmResult = llmResponseSchema.safeParse(response.content[0].input);

  if (!llmResult.success) {
    throw new Error("Unexpected response from LLM API.");
  }

  return llmResult.data;
}
