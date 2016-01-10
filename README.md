# onkokiire
Onkohan juna tulossa ajoissa, eli onko kiire lähteä asemalla, tai kannattaako jäädä kokonaan kotiin. Hyvin alkuvaiheessa oleva työkalu joka on samlla node.js-harjoitus.


Cronissa ajettava scripti joka tarkistaa onko juna ei-peruttu ja ajoissa edellisellä asemalla. Tarvittessa lähetetään notifikaatio pushover-apin ( https://pushover.net/ ) kautta

# Todo:

* fiksumpi junien valinta
* tuki eri suuntaisille junille (eli joku tieto siitä mikä on edelline asema)
* lähetttyjen hälyjen tallennus jottei tehdä duplikaatteja

* webbisivu joka näyttää yhdellä silmäyksellä junan myöhässäolon, aamupäivällä hml molempiin suuntiin seuraava lähtevä, iltapäivällä saapuva ( ja/tai lähdöt tampere + hki)



Junadata haetaan Liikenneviraston Digitraffic API:sta ( http://rata.digitraffic.fi/api/v1/doc/), joka on lisensoitu Creative Commons Nimeä 4.0 Kansainvälinen -lisenssillä.


