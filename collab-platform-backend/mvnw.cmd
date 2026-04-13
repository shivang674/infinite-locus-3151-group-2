@REM Maven Wrapper startup batch script
@REM
@REM Required ENV vars:
@REM JAVA_HOME - location of a JDK home dir

@echo off
setlocal

set MAVEN_PROJECTBASEDIR=%~dp0
set MAVEN_WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar"
set MAVEN_WRAPPER_PROPERTIES="%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.properties"

if exist %MAVEN_WRAPPER_JAR% (
    java -jar %MAVEN_WRAPPER_JAR% %*
) else (
    for /f "tokens=2 delims==" %%a in ('findstr "distributionUrl" %MAVEN_WRAPPER_PROPERTIES%') do set DOWNLOAD_URL=%%a

    if not exist "%MAVEN_PROJECTBASEDIR%.mvn\wrapper" mkdir "%MAVEN_PROJECTBASEDIR%.mvn\wrapper"

    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%DOWNLOAD_URL%' -OutFile '%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-dist.zip'}"

    powershell -Command "& {Expand-Archive -Path '%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-dist.zip' -DestinationPath '%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-dist' -Force}"

    for /d %%d in ("%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-dist\apache-maven-*") do set MAVEN_HOME=%%d

    "%MAVEN_HOME%\bin\mvn.cmd" %*
)
