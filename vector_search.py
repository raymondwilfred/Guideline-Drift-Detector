# Wrapper to expose the backend vector search if required from the root directly.
from backend.vector_search import vector_db

def search_documents(query_embedding, top_k=5):
    """Exposes backend vector search interface."""
    return vector_db.search(query_embedding, top_k=top_k)

if __name__ == "__main__":
    print("Vector search module loaded.")
    print("Use the backend application to insert items dynamically.")
