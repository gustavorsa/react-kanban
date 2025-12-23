@{container}=react_app
@{script}=docker exec -it @{container}

start:
	docker compose up -d

stop:
	docker compose down

shell:
	@{script} sh