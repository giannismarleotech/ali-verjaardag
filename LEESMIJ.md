# Ali wordt 30 — publicatie op Netlify

De site bevat een gedeelde, openbare gastenlijst. Namen, ja/nee en het aantal personen worden op Netlify bewaard. Er is geen apart databaseaccount of API-sleutel nodig. Een bezoeker kan zijn eigen antwoord aanpassen op dezelfde browser en hetzelfde toestel zolang de browsergegevens bewaard blijven. Dit is een eenvoudige uitnodiging zonder identiteitscontrole: namen zijn zelf opgegeven. Deel de link daarom met je gasten.

## Eerst invullen
In `public/config.js` staan de gegevens: 30 januari 2027 vanaf 20.00 uur, De Kastelein, Cyriel Buyssestraat 3, 9850 Nevele. Het jaar 2027 is aangenomen als de eerstvolgende 30 januari. Pas dit bestand aan als een ander jaar bedoeld is.

## Publiceren (belangrijk)
Een gewone Netlify Drop upload van alleen de HTML-map publiceert geen serverfuncties. Daardoor werkt de gedeelde gastenlijst dan niet. Gebruik een van deze twee routes:

### Via GitHub en Netlify
1. Pak deze ZIP uit. Zet de inhoud (inclusief `package.json`, `netlify.toml`, `public` en `netlify`) in een GitHub repository.
2. Kies in Netlify **Add new project > Import an existing project** en selecteer de repository.
3. De instellingen staan in `netlify.toml`: build `npm run build`, publish `public`.
4. Publiceer. Open de Netlify-link; die kun je met iedereen delen.

### Via Terminal (Node.js 22 of nieuwer)
Open Terminal in de uitgepakte projectmap en voer achtereenvolgens uit:

    npm install
    npx netlify-cli login
    npx netlify-cli deploy --build --prod

Kies bij de eerste deploy een nieuw Netlify-project of koppel het gewenste bestaande project. Netlify bundelt de serverfunctie en regelt de opslagtoegang automatisch. Abonnementsquota van je Netlify-account blijven van toepassing.

## Controleren na publicatie
Open de link op twee toestellen. Meld je op toestel A aan. Vernieuw op toestel B: je naam en aantal moeten daar zichtbaar zijn. Pas op A je antwoord aan naar nee en controleer de teller op B. Controleer ook dat B de aanmelding van A niet kan aanpassen. Gebruik bij voorkeur je eigen echte antwoord zodat er geen testgasten blijven staan.

## Gebruik
- Eén inzending per groep; aantal is inclusief de persoon die zich aanmeldt.
- Ja telt het opgegeven aantal personen, nee telt als één afmelding.
- De lijst vernieuwt elke 20 seconden en via de knop.
- Je eigen antwoord blijft bewerkbaar op dit toestel; wissen van browsergegevens of wisselen van toestel maakt een nieuwe inzending.
- Namen worden als tekst getoond. Bewerkcodes blijven uit de openbare lijst.
- De lijst bevat uitsluitend zelf ingediende namen, status en aantallen.

## Bestanden
`public/assets/ali-30.png` is de bewerkte verjaardagsfoto. De gebruikte bewerkingsopdracht: behoud Ali's herkenbare gezicht, zonnebril, baard, hemd en glas; voeg een gouden feestkroon, gouden 30-ballonnen en wat confetti toe, als natuurlijke foto. Gemaakt met de ingebouwde afbeeldingsgenerator.

## Gegevens opruimen
Na het feest kun je in het Netlify-project via de Blobs-opslag de store `ali-30-rsvp` verwijderen. Zet de site ook offline wanneer de uitnodiging niet meer nodig is. De store wordt bewust behouden bij een volgende deploy van dezelfde site.

## Update met dansanimatie
De pagina bevat nu een dansende Ali met een pauze- en startknop. Bij de systeemvoorkeur voor minder beweging staat de animatie standaard stil. Onderaan staat een klikbare Powered by marleo.tech-vermelding. Upload bij deze update opnieuw alle uitgepakte bestanden en mappen in dezelfde GitHub-repository en bevestig de wijzigingen. Gebruik dezelfde Netlify-site om de bestaande gastenlijst te behouden.
