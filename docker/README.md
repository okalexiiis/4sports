# Docker Compose services for 4Sports

This directory contains standalone Docker Compose files for development services.

## Available services

- `docker/postgres/docker-compose.yml` — PostgreSQL 15 service
- `docker/redis/docker-compose.yml` — Redis 7 service

## Usage

Start PostgreSQL:

```bash
docker compose -f docker/postgres/docker-compose.yml up -d
```

Start Redis:

```bash
docker compose -f docker/redis/docker-compose.yml up -d
```

Stop a service:

```bash
docker compose -f docker/postgres/docker-compose.yml down
```

or

```bash
docker compose -f docker/redis/docker-compose.yml down
```

## Notes

- PostgreSQL runs on port `5432`
- Redis runs on port `6379`
- Data is persisted using named Docker volumes
