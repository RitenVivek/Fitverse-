# ===========================
# Stage 1 - Build React App
# ===========================

FROM node:22.21.0-slim AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm ci

COPY frontend/ .

RUN npm run build


# ===========================
# Stage 2 - Production Server
# ===========================

FROM node:22.21.0-slim

# Install Python
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend

# Backend dependencies
COPY backend/package*.json ./

RUN npm ci

# Backend source
COPY backend/ .

# Python packages
RUN pip3 install --no-cache-dir --break-system-packages -r ml/requirements.txt

# Copy built frontend
COPY --from=frontend-builder /app/frontend/dist ../frontend/dist

EXPOSE 10000

CMD ["npm","start"]