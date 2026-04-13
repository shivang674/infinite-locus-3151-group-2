@echo off
echo Starting Spring Boot Backend Server...
cd collab-platform-backend
"%USERPROFILE%\.maven\apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run
