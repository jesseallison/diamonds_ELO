# Diamonds ELO

## TODO

**Now**
- [ ] Create interface for poet to be able to choose different pairings
- [ ] Create new portal for audience to find performance currently running

**Soon**
- [ ] Reformat parsing of corpus into ≈500 line segments
- [ ] Add random selection of corpus segments if not enough return.

**Later**
- [ ] Allow poet to load in their own poem and corpus

**Maybe**
- [ ] Replace markov with machine learning

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