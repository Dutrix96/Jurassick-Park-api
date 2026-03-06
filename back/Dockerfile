FROM php:8.3-fpm-alpine

# Instalamos dependencias basicas
RUN apk add --no-cache \
  bash \
  git \
  curl \
  unzip \
  icu-dev \
  oniguruma-dev \
  libzip-dev \
  mysql-client

# Extensiones PHP necesarias para Laravel
RUN docker-php-ext-install \
  pdo_mysql \
  intl \
  mbstring \
  zip

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Usuario no root (opcional, pero bien)
RUN addgroup -g 1000 app && adduser -G app -g app -s /bin/sh -D -u 1000 app
USER app