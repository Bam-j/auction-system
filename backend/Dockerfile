# 1. 빌드 스테이지
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Gradle 래퍼와 설정 파일 복사
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# 의존성 먼저 다운로드 (캐싱 활용)
RUN chmod +x ./gradlew
RUN ./gradlew dependencies --no-daemon

# 소스 코드 복사 및 빌드
COPY src src
RUN ./gradlew build -x test --no-daemon

# 2. 실행 스테이지
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# 빌드 스테이지에서 생성된 jar 파일 복사
COPY --from=build /app/build/libs/*.jar app.jar

# 파일 업로드를 위한 디렉토리 생성
RUN mkdir -p /app/uploads

# 환경 변수 기본값 설정
ENV SPRING_PROFILES_ACTIVE=prod
ENV STORAGE_TYPE=local

EXPOSE 8080

# 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
