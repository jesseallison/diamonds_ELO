# Diamonds ELO

## TODO

**Now**
- [ ] Add session chooser to "I am theater" link from portal
- [ ] simplify the sesssion chooser
- [ ] update the poet controller UI

**Soon**
- [ ] Allow poet to load in their own poem and corpus
- [ ] Add random selection of corpus segments if not enough return.
- [ ] why does loadtext-ish take so long

**Later**
- [ ] Create interface for poet to be able to choose different pairings from seeds and corpora
- [ ] use socet.io rooms/groups to tie session user together

**Maybe**
- [ ] Replace markov with machine learning

**Done**
- [x] Fix up corpii corpus files.  lilghettoqueer-corpus is functional, but the others cause failure.  probs bad syntax
- [x] Create new portal for audience to find performance currently running
- [x] Update the /data/seeds/xxxx/seed.html files to whatever they need to be to load in the browser properly.
  - The main index page allows users to set a sessionName this is stored on the server as well as in localStorage.  On any subsequent page on this domain you can get this sessionName via:  localStorage.getItem('sessionName')
- [x] Reformat parsing of corpus into ≈500 line segments
- [x] Run on web server at http://dystopia.emdm.io (linked to http://atlab.cct.lsu.edu:8001)

## Start with Docker Compose)

```bash
npm install
docker-compose up
```

### For Production Use

```bash
npm install
docker-compose up -d
```

and the follwoing to check in your code

```bash
docker-compose ps
docker-compose logs -f
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

`npm run-script corpus-prep`

## Miscellaneous Docker Commands
`docker container ls`
`docker stop <container-name>`
`docker system prune`

## Corpii

"horrortech" corpus recombines text from the screenplays of Halloween and Jacob's Ladder combined with President Obama's May 23, 2013 speech on national security and drone warfare

"lilghettoqueer" corpus recombines text from Robert Cortes Holliday's Turns About Town and W. E. B. Du Bois' The Souls of Black Folk

"melanwormy" corpus recombines text from Bram Stoker's The Lair of the White Worm (The Garden of Evil) and the International Helminth Genomes Consortium's "Comparative Genomics of the Major Parasitic Worms," and various articles from psychology publications on depression and anti-depressants 

"mythrimony" corpus recombines text from popular wedding vows, Biblical verses related to marriage, and Charles Gould's Mythical Monsters

"orbitopera" corpus recombines text from the Challenger's operational recorder, transcripts from the Apollo 11 moonwalk, and English translations of lyrics from a wide array of operas 

"rivergration" corpus recombines text from John McPhee's The Control of Nature, articles on the U.S. Army Corps of Engineers and the national levee system, the U.S. Constitution, and recent U.S. Immigration and Customs Enforcement reports and briefings
