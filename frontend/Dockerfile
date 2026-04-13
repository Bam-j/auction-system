# 1. 빌드 스테이지
FROM node:20-alpine AS build
WORKDIR /app

# 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# 2. 실행 스테이지 (Nginx)
FROM nginx:stable-alpine

# 빌드 결과물 복사
COPY --from=build /app/dist /usr/share/nginx/html

# 커스텀 Nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
