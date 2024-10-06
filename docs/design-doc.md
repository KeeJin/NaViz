# Design Details

This document attempts to document the design decisions made in this project.

## Main technology to use

For the frontend, React Vite with Tailwind-CSS will be used. For data communication between the frontend and the robot, either Websockets or gRPC will be used.  
There will be an interface layer to bridge the robot internal network with this external frontend web app. This interface layer will be deployed via Docker.

## High-level architecture
TODO: draw.io diagram here

## Project Phases
### Phase 1
This phase will target the following basic functionality:
- Barebones UI
- Odometry feedback
- IMU feedback
- rclcpp adapter support

### Phase 2
