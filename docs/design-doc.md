# Design Details

This document attempts to document the design decisions made in this project.

## Main technology to use

For the frontend, React Vite with Tailwind-CSS will be used. For data communication between the frontend and the robot, either Websockets or gRPC will be used.  
There will be an interface layer to bridge the robot internal network with this external frontend web app. This interface layer will be deployed via Docker.

## High-level architecture
TODO: draw.io diagram here

## Project Phases

### Phase 0 (COMPLETED)
This phase will attempt to visualise a point cloud map at an origin.

Demo of Phase 0:
![Phase 0 demo](showcase/phase0-complete.gif)

### Phase 1 (WIP)
This phase will target the following basic functionality:
- Barebones UI
- Odometry feedback
- IMU feedback
- rclcpp adapter support

#### Server Setup
For the interface server, I have opted to use the [rosbridge_suite library](https://github.com/RobotWebTools/rosbridge_suite) to expose ROS2 networks as a Websockets interface. The client end will then be handled by the [roslibjs library](https://github.com/RobotWebTools/roslibjs).

This Websockets interface will be served via a docker container. For ease of testing, I have also created a docker-compose configuration that will help play a rosbag within the same docker network.

### Phase 2
