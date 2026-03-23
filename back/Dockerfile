FROM php:8.3-fpm-alpine

RUN apk add --no-cache \
  bash \
  git \
  curl \
  unzip \
  icu-dev \
  oniguruma-dev \
  libzip-dev \
  mysql-client

RUN docker-php-ext-configure pcntl --enable-pcntl \
  && docker-php-ext-install \
  pdo_mysql \
  intl \
  mbstring \
  zip \
  pcntl

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

RUN addgroup -g 1000 app && adduser -G app -g app -s /bin/sh -D -u 1000 app
USER app