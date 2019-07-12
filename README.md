# diamonds_ELO

## TODO

- [ ] Reformat parsing of corpus into ≈500 line segments
- [ ] Add random selection of corpus segments if not enough return.
 
## Redis

docker pull redis

// fires up redis on port 6379
docker run --name diamondsRedis -p 6379:6379 -d redis

// fires up redis with persistant storage
docker run --name diamondsRedis -p 6379:6379 -d redis redis-server --appendonly yes

docker container list
docker container rm diamondsRedis

from: https://hub.docker.com/_/redis/

Also install redis on the machine.

## Fill the Redis Database

Run node ./loadRedis.js
or 
npm run-script corpus-prep

## Running Eveything

npm run redis && npm run corpus-prep && npm run start


