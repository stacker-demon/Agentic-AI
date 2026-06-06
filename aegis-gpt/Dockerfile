# AegisGPT Monolith Dockerfile
# Combines Next.js Frontend and FastAPI Backend into a single Cloud Run service

FROM node:20-bookworm-slim

WORKDIR /app

# 1. Install Python and system dependencies
RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-venv \
    gcc g++ curl \
    && rm -rf /var/lib/apt/lists/*

# 2. Setup Python environment and install backend deps
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r ./backend/requirements.txt
RUN python -m spacy download en_core_web_lg

# 3. Install Frontend dependencies
RUN npm install -g pnpm
COPY frontend/package.json frontend/pnpm-lock.yaml* ./frontend/
RUN cd frontend && pnpm install --frozen-lockfile

# 4. Copy source code
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# 5. Build Frontend
WORKDIR /app/frontend
# Use relative API path because Next.js will proxy requests to the local backend
ENV NEXT_PUBLIC_API_URL=/api/v1/analyze
ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm run build

# 6. Final setup
WORKDIR /app
COPY start.sh .
RUN chmod +x start.sh

# Cloud Run defaults to 8080
EXPOSE 8080

CMD ["./start.sh"]
