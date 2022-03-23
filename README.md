# Diamonds ELO

## TODO

**Now**
- [ ] (Derick) update the poet controller UI
- [ ] (Jesse) Add audio event for each of the controller buttons, possibly tied to each corpus
- [ ] (Jesse) Add sessionName verification for each of the audio events

**Soon**
- [ ] Make sure sessions are actually cleared after 60 minutes.
- [ ] Add random selection of corpus segments if not enough return.
- [ ] (Jesse) why does loadtext-ish take so long?
- [ ] somehow have the generated poem visualized at the end in theater view or output to the mobiles like the seed was as final dismount so to speak (this connection is not so clear in current state and might be a nice reward for the tapper to see at the end, esp if their contributions were indicated but that's prob too much)
- [ ] load in a poem and corpus from my new book, ~getting away with everything (which i need to get you copies of :) )
- [ ] ability to load in original seed and corpus (can, maybe should, be delayed until I write the grant and get funding for the hosted version, but I couldn't recall if this was working in one iteration of 2.0)

**Later**
- [ ] Allow poet to load in their own poem and corpus
- [ ] Create interface for poet to be able to choose different pairings from seeds and corpora
- [ ] use socket.io rooms/groups to tie session user together – Right now they simply append -sessionName to the controller, theater, etc. and store them as separate ids.  This works quite well so far for the unique pages. Should probably keep even after moving to rooms/groups.

**Maybe**
- [ ] Replace markov with machine learning

**Done**
- [x] (Jesse) Double check that corpii are loading properly. Right now, corpus.csv (diamonds) is only creating 1 set as opposed to hundreds...
- [x] (Derick)Add session chooser to "I am theater" link from portal
- [x] (Derick)Add session chooser to "I am poet" at the top in case poet needs to rejoin session
- [x] simplify the sesssion chooser
- [x] Fix up corpii corpus files.  lilghettoqueer-corpus is functional, but the others cause failure.  probs bad syntax
- [x] Create new portal for audience to find performance currently running
- [x] Update the /data/seeds/xxxx/seed.html files to whatever they need to be to load in the browser properly.
  - The main index page allows users to set a sessionName this is stored on the server as well as in localStorage.  On any subsequent page on this domain you can get this sessionName via:  localStorage.getItem('sessionName')
- [x] Reformat parsing of corpus into ≈500 line segments
- [x] Run on web server at http://dystopia.emdm.io (linked to http://atlab.cct.lsu.edu:8001)


# Running the Server

## Start locally manually
From the diamondsCluster folder

Start Redis (will install and start a docker container running redis:5 on port 6379)
```npm run redis``` 

If this is the first time redis is fired up, load in the corpii
```npm run corpus-prep```

Fire up the diamondsCluster server on port 8080, 80, or whatever
```npm start``` or port 80 ```npm run start-80``` or on a specific port ```PORT=8001 node diamondsCluster.js```

### Start with Docker Compose

```bash
npm install
docker-compose up
```
### For Production, Use

```bash
npm install
docker-compose up -d
```

and the follwoing to check in your code

```bash
docker-compose ps
docker-compose logs -f
```

### updating the GCE code

log into the GCE instance

```
cd /srv/diamonds/
git pull
docker-compose up -d
```

## Deploy on gcloud App Engine Flex

Not quite ready yet, but these will be the commands...

```gcloud config set project dotted-repeater-177306```

```
gcloud app deploy -v dev
gcloud app browse
```

```
gcloud app versions list
gcloud app versions stop dev
```


## Troubleshooting

Sometimes allowing node to run on port 80 without root is useful...

`sudo setcap CAP_NET_BIND_SERVICE=+eip /usr/bin/node`
 
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

"diamonds" corpus is 2000+ transcripts of TED Talks

"DID2.2GAWE" corpus is from Vincent's new poetry book and some crazy classics like anarchist's cookbook and steal this book

## Notes

@jesse in convo, we realized a little issue with 2.0 about actually having the original diamonds in the app and decided this is definitely the seed and corpus i want to perform as we don't have time to make different effects buttons. 

been working on a corpus and seed for the new book, if we get to that wishlist item. please see the [linked folder](https://surfdrive.surf.nl/files/index.php/s/FKowTcQ7JS0IeyE). pw: Diamonds

small explanation:

DID2.2GAWEseed - two poems from the new one which will be the seed poem

DID2.2GaweCorpus - full text of our new poetry book and then some crazy classics like anarchist's cookbook and steal this book. (that hits the anarchy subjects)

was hoping to pair that with the Encyclopedia Britannica for the corpus. BUT the EB full text is raw OCR so massive error problems unless we treat those as part of the fun (worth experimenting with) but I could only combine maybe the first dozen or so text files before notepad++ broke. haha. [EB full file download link](https://data.nls.uk/data/digitised-collections/encyclopaedia-britannica/) in case you have any data combining tricks. What I could combine is found in EBfirsteditionOCR.

SJohnsonsDictionary - Because there were so many issues with the EB I remembered there was a cool old Dictionary by Samuel Johnson (which fits the everything subject). This too is raw OCR so I kept it separate. But we can try to experiment with adding that the DID2.2GAWECorpus if the EB stuff doesn't work out. Might be an easier test to see if the Markoving of the raw OCR is poetic or just downright ugly. I will kept searching for cleaner datasets for the Everything portion. 

***Wikipedia would be really perfect (as it's way more contemporary and no OCR) and I started to track it down first, but was feeling in over my head. But could try to get a torrent download program again and get this file: pages-articles-multistream.xml.bz2. That shouldn't be too hard but I haven't had torrents on my machine since those good old days in undergrad if you know what I mean. haha