# Aplikaciju za prodaju filmova 

Realizovati veb aplikaciju koja ima ulogu veb prezentacije firme sa elementima sistema za poručivanje proizvoda i usluga. Veb aplikacija treba da sadrži osnovne informacije o firmi, kao što su tekst o istorijatu, trenutnom stanju firme, kao i listu predstavništava sa integracijom nekog ugrađenog API-ja za prikaz mapa, ali i mogućnost prikaza kontakt podataka sa opcijom direktnog pozivanja kolikom na stavku liste kontakt stranice ili sa opcijom direktnog slanja elektronske pošte iz formulara unutar aplikacije. Aplikacija treba da sadrži i malu galeriju slika firme, sadržanu u samoj izvršnoj datoteci aplikacije. Osnovni element veb aplikacije treba da bude katalog proizvoda sa detaljima o proizvodu, slikom proizvoda i tabelom karakteristika. Korisniku treba ponuditi opciju dodavanja proizvodâ u korpu za naručivanje. Kada korisnik popuni korpu, treba mu omogućiti prelazak na stranicu gde bi popunio formular sa svojim podacima (ime i prezime, adresa, telefon, komentar). Iznad formulara je prikazana lista proizvoda iz korpe sa ukupnom cenom i izraženim iznosom PDV-a za svaku stavku pojedinačno, ali i za ceo zbirni iznos. Podaci iz ovog formulara se šalju aplikaciji koja proverava unete podatke i upisuje u bazu podataka porudžbinu koju administrator sajta može da otvori u administrativnom panelu. Grafički interfejs veb sajta treba da bude realizovan sa responsive dizajnom.
Tehnička ograničenja
- Aplikacija mora da bude realizovana na Node.js platformi korišćenjem Express biblioteke. 
Aplikacija mora da bude podeljena u dve nezavisne celine: back-end veb servis (API) i front-end (GUI aplikacija).
 Sav kôd aplikacije treba da bude organizovan u jednom Git spremištu u okviru korisničkog naloga za ovaj projekat, sa podelom kao u primeru zadatka sa vežbi.
- Baza podataka mora da bude relaciona i treba koristiti MySQL ili MariaDB sistem za upravljanje bazama podataka (RDBMS) 
i u spremištu back-end dela aplikacije mora da bude dostupan SQL dump strukture baze podataka, eventualno sa inicijalnim podacima, 
potrebnim za demonstraciju rada projekta.
- Back-end i front-end delovi projekta moraju da budi pisani na TypeScript jeziku, prevedeni TypeScript prevodiocem na adekvatan JavaScript.
 Back-end deo aplikacije, preveden na JavaScript iz izvornog TypeScript koda se pokreće kao Node.js aplikacija,
 a front-end deo se statički servira sa rute statičkih resursa back-end dela aplikacije i izvršava se na strani klijenta.
 Za postupak provere identiteta korisnika koji upućuje zahteve back-end delu aplikacije može da se koristi mehanizam sesija ili JWT (JSON Web Tokena), po slobodnom izboru.
- Sav generisani HTML kôd koji proizvodi front-end deo aplikacije mora da bude 100% validan,
 tj. da prođe proveru W3C Validatorom (dopuštena su upozorenja - Warning, ali ne i greške - Error). 
 Grafički korisnički interfejs se generiše na strani klijenta (client side rendering), 
 korišćenjem React biblioteke, dok podatke doprema asinhrono iz back-end dela aplikacije (iz API-ja). 
 Nije neophodno baviti se izradom posebnog dizajna grafičkog interfejsa aplikacije, već je moguće koristiti CSS biblioteke kao što je Bootstrap CSS biblioteka. Front-end deo aplikacije 

## Razrada projektne dokumentacije

Aplikacija radjena za predmet E-poslovanje koja se bavi prodajom filmova, u vidu web-prodavnice, kao sto je u projektnom zadatku
i definisano osnovni princip aplikacije zasniva se na proizvodima koji imaju svoje karakteristike(cena,podaci,slika,opis..itd) i koji se mogu
filtrirati i dodati u Korpu za naručivanje.
Tehnologije koje su koriscene u ovom projektu su : NestJS, MySQL i React, kao i mnogi drugi propratni alati i biblioteke :
Git alat za verziranje koda samog projekta.
TypeORM alat za dodavanje funkcionalnosti i rada sa Bazom podataka i njenim entitetima(MySQL).
DTO implementacija za operacije dodavanja i izmena.
Alat Postman koji je koristen u toku izrade aplikacije za testiranje metoda (POST,GET,PUT..).


