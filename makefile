# ============================
# Jurassic Park - Makefile
# ============================
# Requisitos: Docker + Docker Compose
# En Windows: usar Git Bash o WSL para ejecutar `make`

DC := docker compose

# Servicios del docker-compose
BACK := back
DB := db
NGINX := nginx
FRONT := front
ADMINER := adminer

# ----------------------------
# AYUDA
# ----------------------------
.PHONY: help
help:
	@echo "== DOCKER =="
	@echo "  make up            -> Levanta contenedores"
	@echo "  make build         -> Build + levanta"
	@echo "  make down          -> Para contenedores"
	@echo "  make restart       -> Reinicia contenedores"
	@echo "  make ps            -> Estado contenedores"
	@echo "  make clean         -> Borra contenedores + volumenes (BORRA BD)"
	@echo ""
	@echo "== LOGS =="
	@echo "  make logs          -> Logs de todos"
	@echo "  make logs-back     -> Logs backend"
	@echo "  make logs-db       -> Logs db"
	@echo "  make logs-nginx    -> Logs nginx"
	@echo "  make logs-front    -> Logs front"
	@echo "  make logs-adminer  -> Logs adminer"
	@echo ""
	@echo "== SHELLS =="
	@echo "  make back-sh       -> Entrar al contenedor back"
	@echo "  make db-sh         -> Entrar al contenedor db"
	@echo "  make front-sh      -> Entrar al contenedor front"
	@echo ""
	@echo "== LARAVEL (artisan) =="
	@echo "  make routes        -> php artisan route:list"
	@echo "  make clear         -> php artisan optimize:clear"
	@echo "  make migrate       -> php artisan migrate"
	@echo "  make fresh         -> php artisan migrate:fresh"
	@echo "  make seed          -> php artisan db:seed"
	@echo "  make fresh-seed    -> php artisan migrate:fresh --seed"
	@echo "  make tinker        -> php artisan tinker"
	@echo "  make artisan cmd='...'  -> comando artisan libre"
	@echo ""
	@echo "== GENERADORES (scaffold) =="
	@echo "  make controller name=Api/Admin/CellController"
	@echo "  make controller-api name=Api/Admin/CellController"
	@echo "  make model name=Cell         -> make:model Cell -m"
	@echo "  make seeder name=CellSeeder  -> make:seeder CellSeeder"
	@echo "  make migration name='create_x_table' -> make:migration"
	@echo "  make middleware name=RoleMiddleware"
	@echo ""
	@echo "== COMPOSER =="
	@echo "  make composer-install"
	@echo "  make composer-update"
	@echo "  make composer req='paquete'"
	@echo ""
	@echo "== JWT =="
	@echo "  make jwt-publish   -> vendor:publish jwt-auth"
	@echo "  make jwt-secret    -> php artisan jwt:secret"
	@echo ""
	@echo "== TESTS =="
	@echo "  make test          -> php artisan test"
	@echo ""
	@echo "== DB (MySQL dentro del contenedor) =="
	@echo "  make mysql         -> abre consola mysql (usa env del contenedor)"
	@echo ""
	@echo "== URLs =="
	@echo "  API     -> http://localhost:8080"
	@echo "  Adminer -> http://localhost:8081"
	@echo "  Front   -> http://localhost:5173"

# ----------------------------
# DOCKER
# ----------------------------
.PHONY: up build down restart ps clean
up:
	$(DC) up -d

build:
	$(DC) up -d --build

down:
	$(DC) down

restart:
	$(DC) down
	$(DC) up -d

ps:
	$(DC) ps

clean:
	$(DC) down -v --remove-orphans

# ----------------------------
# LOGS
# ----------------------------
.PHONY: logs logs-back logs-db logs-nginx logs-front logs-adminer
logs:
	$(DC) logs -f --tail=200

logs-back:
	$(DC) logs -f --tail=200 $(BACK)

logs-db:
	$(DC) logs -f --tail=200 $(DB)

logs-nginx:
	$(DC) logs -f --tail=200 $(NGINX)

logs-front:
	$(DC) logs -f --tail=200 $(FRONT)

logs-adminer:
	$(DC) logs -f --tail=200 $(ADMINER)

# ----------------------------
# SHELLS
# ----------------------------
.PHONY: back-sh db-sh front-sh
back-sh:
	$(DC) exec $(BACK) sh

db-sh:
	$(DC) exec $(DB) sh

front-sh:
	$(DC) exec $(FRONT) sh

# ----------------------------
# LARAVEL / ARTISAN
# ----------------------------
.PHONY: artisan routes clear migrate fresh seed fresh-seed tinker test
artisan:
	$(DC) exec $(BACK) php artisan $(cmd)

routes:
	$(DC) exec $(BACK) php artisan route:list

clear:
	$(DC) exec $(BACK) php artisan optimize:clear

migrate:
	$(DC) exec $(BACK) php artisan migrate

fresh:
	$(DC) exec $(BACK) php artisan migrate:fresh

seed:
	$(DC) exec $(BACK) php artisan db:seed

fresh-seed:
	$(DC) exec $(BACK) php artisan migrate:fresh --seed

tinker:
	$(DC) exec $(BACK) php artisan tinker

test:
	$(DC) exec $(BACK) php artisan test

# ----------------------------
# GENERADORES (SCaffold)
# ----------------------------
.PHONY: controller controller-api model seeder migration middleware event request
controller:
	$(DC) exec $(BACK) php artisan make:controller $(name)

controller-api:
	$(DC) exec $(BACK) php artisan make:controller $(name) --api

model:
	$(DC) exec $(BACK) php artisan make:model $(name) -m

seeder:
	$(DC) exec $(BACK) php artisan make:seeder $(name)

migration:
	$(DC) exec $(BACK) php artisan make:migration $(name)

middleware:
	$(DC) exec $(BACK) php artisan make:middleware $(name)

event:
	$(DC) exec $(BACK) php artisan make:event $(name)

request:
	$(DC) exec $(BACK) php artisan make:request $(name)

# ----------------------------
# COMPOSER
# ----------------------------
.PHONY: composer-install composer-update composer
composer-install:
	$(DC) exec $(BACK) composer install

composer-update:
	$(DC) exec $(BACK) composer update

composer:
	$(DC) exec $(BACK) composer require $(req)

# ----------------------------
# JWT (tymon/jwt-auth)
# ----------------------------
.PHONY: jwt-publish jwt-secret
jwt-publish:
	$(DC) exec $(BACK) php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"

jwt-secret:
	$(DC) exec $(BACK) php artisan jwt:secret

# ----------------------------
# DB (MySQL)
# ----------------------------
.PHONY: mysql
mysql:
	$(DC) exec $(DB) sh -lc "mysql -u$$MYSQL_USER -p$$MYSQL_PASSWORD $$MYSQL_DATABASE"