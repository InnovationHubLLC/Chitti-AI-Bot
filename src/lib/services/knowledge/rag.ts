export interface RAGResult {
  content: string;
  title: string;
  score: number;
}

// TODO: Wire to pgvector when embeddings are set up
export async function lookupRAG(
  businessId: string,
  question: string,
  limit: number = 5,
): Promise<RAGResult[]> {
  void businessId;
  void question;
  void limit;
  return [];
}
