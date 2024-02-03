#Multi-stage Dockerfile for building an Angular application 
#that runs on an Nginx server 

#--------BUILD STAGE---------#
#This stage is used to build the artifacts needed to run the app.
#The artifacts will be copied over to the next stage and used to generate
#the final image, and the image generated for this stage will be deleted. 

#Use latest node image. Specify platform for raspberry pi
FROM --platform=linux/arm/v7 node:18-alpine3.17 AS build-stage

#Set the work directory as the location inside the image where 
#the rest of the instructions will be run 
WORKDIR /opt/personal-site

#Copy only the package json before doing npm install
#Previously we would COPY . . here, but doing it this way is supposed to decrease build time 
COPY *.json .
COPY src ./src/

#Install all app dependencies inside the image 
RUN npm ci && npm run prodBuild && rm -rf node_modules

#Copy all the code/files from local to the WORKDIR inside the image 
# COPY . .

#Generate the ./dist folder which contains all the artifacts needed to run the app
#Removing node_modules was added later, supposed to decrease build time
# RUN npm run build && rm -rf node_modules


#--------RUN STAGE---------#
#This stage is used to build the final image, from which containers will be run.
#It will copy over the artifacts from the last stage, copy our custom nginx conf
#from local, and start an nginx web server for the app to run on.

#nginx-unprivileged image uses a non-root, unpriviliged user.
#See docker hub repo for differences from official NGINX image.
#Specify platform for raspberry pi
FROM --platform=linux/arm/v8 nginxinc/nginx-unprivileged:alpine AS run-stage
#FROM nginxinc/nginx-unprivileged:alpine AS run-stage

#Set the work directory as the location inside the image where 
#the rest of the instructions will be run.
#This should match the server.root dir defined in the nginx.conf.
WORKDIR /opt/personal-site

#./dist folder is generated using "npm run build" or "ng build --[prod | dev]"
#The ./dist folder contains all the required build artifacts to
#run the web app. To run the app on nginx, server.root in the nginx.conf must 
#point to the build artifacts.  

#Copy the contents of ./dist from the last stage image to the 
#WORKDIR inside this image.
COPY --from=build-stage /opt/personal-site/dist .

#Expose the port that nginx in the container will be listening on. 
#This should match the server.listen port defined in the nginx.conf. 
EXPOSE 80

#Root permissions needed to run apk commands and manipulate files
USER root

#Allows attaching bash shell to container 
RUN apk update && apk add bash

#Remove the default nginx conf
RUN rm /etc/nginx/conf.d/default.conf

#Give nginx ownership of the log directory 
#log directory can also be defined in nginx.conf?
RUN chown -R nginx /var/log/nginx

#Add our custom nginx conf to nginx in the container 
ADD nginx-prod.conf /etc/nginx/conf.d/

#Run nginx in debug mode, which produces verbose output when using higher log levels.
#"-g deamon off" is needed for running on Docker container; tells nginx
#to run in the foreground, so Docker can track processes properly
CMD ["nginx-debug", "-g", "daemon off;"]

