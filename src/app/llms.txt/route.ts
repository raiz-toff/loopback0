import { source } from '@/lib/source';
import { llms } from 'fumadocs-core/source';
import { markdownResponse } from '@/lib/markdown-response';

export const revalidate = false;

export function GET() {
  return markdownResponse(llms(source).index());
}
