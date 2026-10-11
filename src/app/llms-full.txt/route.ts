import { llmsFullTxt, textHeaders } from "@/lib/llms";

export const dynamic = "force-static";

export function GET() {
  return new Response(llmsFullTxt(), { headers: textHeaders });
}
