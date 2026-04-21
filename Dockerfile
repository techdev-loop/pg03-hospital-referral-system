FROM gradle:8.10-jdk17 AS build
WORKDIR /app
COPY backend/settings.gradle.kts backend/build.gradle.kts ./
COPY backend/src ./src
RUN gradle bootJar --no-daemon -q

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
