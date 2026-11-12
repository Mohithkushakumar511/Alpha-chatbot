from server.main import app

if __name__ == "__main__":
    import uvicorn
    from server.config import SERVER_PORT
    uvicorn.run("server.main:app", host="0.0.0.0", port=SERVER_PORT, reload=True)
