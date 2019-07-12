# Diamonds ELO

## TODO
- [ ] Create interface for poet to be able to choose different pairings
- [ ] Create new portal for folks to find performance currently running
- [ ] Reformat parsing of corpus into ≈500 line segments
- [ ] Add random selection of corpus segments if not enough return.

## To Start Using Docker Compose

```bash
npm install
docker-compose up
```
 
## To Start Manually

Fire up redis on port 6379  
`docker run --name diamondsRedis -p 6379:6379 -d redis`

Or fire up redis with persistant storage  
`docker run --name diamondsRedis -p 6379:6379 -d redis redis-server --appendonly yes`

Start the application  
```bash
npm install
npm start
```