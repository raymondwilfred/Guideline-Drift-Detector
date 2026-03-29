import numpy as np

class VectorSearch:
    def __init__(self):
        self.index = []
        self.metadata = []
        
    def add_document(self, embedding, meta):
        self.index.append(embedding)
        self.metadata.append(meta)
        
    def search(self, query_embedding, top_k=5):
        if not self.index:
            return []
        
        # Simple cosine similarity
        similarities = []
        q_np = np.array(query_embedding).flatten()
        for i, emb in enumerate(self.index):
            e_np = np.array(emb).flatten()
            sim = np.dot(q_np, e_np) / (np.linalg.norm(q_np) * np.linalg.norm(e_np) + 1e-9)
            similarities.append((float(sim), self.metadata[i]))
            
        similarities.sort(key=lambda x: x[0], reverse=True)
        return similarities[:top_k]

# Global instance for basic operations
vector_db = VectorSearch()
