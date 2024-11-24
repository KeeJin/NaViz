FROM ros:humble-ros-base AS builder

# Install dependencies
RUN apt-get update && apt-get install -y \
    ros-dev-tools
RUN apt-get install -y ros-humble-rosbridge-server

# dev tools
RUN apt-get install -y net-tools

ENTRYPOINT ["/bin/bash"]