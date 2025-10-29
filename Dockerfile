# ============================================
# STAGE 1: Build frontend
# ============================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Cài đặt dependencies (chỉ dev stage mới cần)

RUN rm -rf node_modules package-lock.json
RUN npm install

# Copy toàn bộ source code
COPY . .

# Build production
RUN npm run build

# ============================================
# STAGE 2: Serve static files
# ============================================
FROM nginx:alpine

# Copy build output sang Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Xóa default nginx page
RUN rm -rf /usr/share/nginx/html/index.html

# Copy nginx config (nếu có)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
