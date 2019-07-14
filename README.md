# Diamonds ELO

## TODO

**Now**
- [ ] Run on web server at http://emdm.io/diamonds (linked to http://atlab.cct.lsu.edu:8081)
- [ ] Create interface for poet to be able to choose different pairings
- [ ] Create new portal for audience to find performance currently running
- [ ] Update the /data/seeds/xxxx/seed.html files to whatever they need to be to load in the browser properly.
  - The main index page allows users to set a sessionName this is stored on the server as well as in localStorage.  On any subsequent page on this domain you can get this sessionName via:  localStorage.getItem('sessionName')  

**Soon**
- [x] Reformat parsing of corpus into ≈500 line segments
- [ ] Add random selection of corpus segments if not enough return.
- [ ] Fix up corpii corpus files.  lilghettoqueer-corpus is functional, but the others cause failure.  probs bad syntax

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

npm run-script corpus-prep

__Miscellaneous Docker__
docker container list



## Corpii

"horrortech" corpus recombines text from the screenplays of Halloween and Jacob's Ladder combined with President Obama's May 23, 2013 speech on national security and drone warfare

"lilghettoqueer" corpus recombines text from Robert Cortes Holliday's Turns About Town and W. E. B. Du Bois' The Souls of Black Folk

"melanwormy" corpus recombines text from Bram Stoker's The Lair of the White Worm (The Garden of Evil) and the International Helminth Genomes Consortium's "Comparative Genomics of the Major Parasitic Worms," and various articles from psychology publications on depression and anti-depressants 

"mythrimony" corpus recombines text from popular wedding vows, Biblical verses related to marriage, and Charles Gould's Mythical Monsters

"orbitopera" corpus recombines text from the Challenger's operational recorder, transcripts from the Apollo 11 moonwalk, and English translations of lyrics from a wide array of operas 

"rivergration" corpus recombines text from John McPhee's The Control of Nature, articles on the U.S. Army Corps of Engineers and the national levee system, the U.S. Constitution, and recent U.S. Immigration and Customs Enforcement reports and briefings
