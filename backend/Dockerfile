# Stage 1: Build Java application
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests

# Stage 2: Production runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
VOLUME /tmp
COPY --from=build /app/target/ecommerce-backend-1.0.0-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
