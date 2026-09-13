import {config} from '@/lib/server';
export async function GET(){return Response.json({configured:!!config().OPENAI_API_KEY,models:{voice:'gpt-live-1',agent:'gpt-6-astra',reasoningFallback:'gpt-5.4-mini',image:'gpt-image-2.5-flare'}},{headers:{'Cache-Control':'no-store'}});}
