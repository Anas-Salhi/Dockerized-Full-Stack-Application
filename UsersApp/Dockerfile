#FROM openjdk:17-oracle
#EXPOSE 8081
#RUN mkdir -p /home/app
#COPY /target/*.jar /home/app
#WORKDIR /home/app
#CMD  java -jar UsersApp-0.0.1-SNAPSHOT.jar

FROM maven:3.9.0 AS maven

# Set the working directory
WORKDIR /usr/src/app

# Copy the source code

COPY . /usr/src/app

# Build the application with Maven
RUN mvn package -DskipTests

# Use the official OpenJDK image as the runtime environment
FROM openjdk:17-oracle

ARG JAR_FILE=UsersApp-0.0.1-SNAPSHOT.jar


# Set the working directory
WORKDIR /app

# Copy the compiled application from the builder image
COPY --from=maven /usr/src/app/target/*.jar ./app.jar

# Expose the default port
EXPOSE 8081

# Run the application
CMD ["java", "-jar", "app.jar"]
