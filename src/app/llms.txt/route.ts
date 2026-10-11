import { llmsTxt, textHeaders } from "@/lib/llms";

export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(), { headers: textHeaders });
}
