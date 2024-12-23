# Set Node.js as the base image (use desired Node version)
FROM node:lts

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN mkdir -p /equipped && chown node:node /equipped
RUN mkdir -p /setup && chown node:node /setup

WORKDIR /setup

# Install Required Packages
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    jq \
    default-mysql-client \
    gh \
    zsh \
    nano \
    git \
    ssh-client

# Install 1Password CLI
RUN curl -sS https://downloads.1password.com/linux/keys/1password.asc | \
    gpg --dearmor --output /usr/share/keyrings/1password-archive-keyring.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/1password-archive-keyring.gpg] https://downloads.1password.com/linux/debian/$(dpkg --print-architecture) stable main" | \
    tee /etc/apt/sources.list.d/1password.list && \
    mkdir -p /etc/debsig/policies/AC2D62742012EA22/ && \
    curl -sS https://downloads.1password.com/linux/debian/debsig/1password.pol | \
    tee /etc/debsig/policies/AC2D62742012EA22/1password.pol && \
    mkdir -p /usr/share/debsig/keyrings/AC2D62742012EA22 && \
    curl -sS https://downloads.1password.com/linux/keys/1password.asc | \
    gpg --dearmor --output /usr/share/debsig/keyrings/AC2D62742012EA22/debsig.gpg && \
    apt update && apt install 1password-cli && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install Planetscale CLI
RUN version=$(curl -s https://api.github.com/repos/planetscale/cli/releases/latest | jq -r .tag_name) && \
    modified_version=$(echo $version | sed 's/v//') && \
    curl -L "https://github.com/planetscale/cli/releases/download/${version}/pscale_${modified_version}_linux_amd64.tar.gz" -o pscale.tar.gz && \
    tar -xvf pscale.tar.gz -C /usr/local/bin && \
    chmod +x /usr/local/bin/pscale && \
    rm pscale.tar.gz

# Install 1Password CLI
RUN curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | tee /usr/share/keyrings/stripe.gpg
RUN echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | tee -a /etc/apt/sources.list.d/stripe.list
RUN apt update
RUN apt install stripe

# Install pnpm using corepack
RUN corepack enable pnpm \
    && corepack use pnpm@latest \
    && corepack install -g pnpm@latest

RUN pnpm install -g vercel playwright
RUN pnpm exec playwright install --with-deps

WORKDIR /equipped

# Set up
RUN chsh -s $(which zsh) root
RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Oh My Zsh Plugins
RUN git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
RUN git clone https://github.com/zsh-users/zsh-autosuggestions ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions
RUN git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k

# Copy Zsh Defaults
COPY defaults/.zshrc /root/.zshrc
COPY defaults/.p10k.zsh /root/.p10k.zsh

# Copy User Settings (if any)
COPY user-settings/* /root
RUN if [ -f "/root/.gitkeep" ]; then rm /root/.gitkeep; fi


EXPOSE 3000
EXPOSE 3004
EXPOSE 3005
EXPOSE 4173
EXPOSE 5173
EXPOSE 5555

CMD ["zsh"]