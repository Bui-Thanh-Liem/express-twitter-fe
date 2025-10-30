# ============================================
# STAGE 1: Build frontend (Vite)
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files trước để tận dụng cache
COPY package*.json ./

# Cài đặt dependencies
RUN npm ci

# Copy toàn bộ mã nguồn
COPY . .

# Build production
RUN npm run build

# ============================================
# STAGE 2: Serve static files bằng Nginx
# ============================================
FROM nginx:alpine

# Copy output Vite sang thư mục phục vụ của Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy file nginx config nếu có
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
