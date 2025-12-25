# Dev Container Dockerfile for LiTreeLabStudio
FROM mcr.microsoft.com/devcontainers/base:ubuntu-22.04

# Install Node.js 20 (LTS)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs

# Install Azure CLI
RUN curl -sL https://aka.ms/InstallAzureCLIDeb | bash

# Install other common tools
RUN apt-get update && apt-get install -y \
    git \
    curl \
    sudo \
    build-essential

# Set up a non-root user (node)
ARG USERNAME=node
ARG USER_UID=1000
ARG USER_GID=$USER_UID
RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
    && echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

USER $USERNAME
WORKDIR /workspace

# Install project dependencies if package.json exists
COPY --chown=$USERNAME:$USERNAME ../api/package.json ./api/
RUN if [ -f ./api/package.json ]; then cd ./api && npm install; fi

# Expose default Node port
EXPOSE 3000

CMD ["sleep", "infinity"]
