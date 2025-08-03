# rekentool-fw
Fijn weekend Rekentool voor Freelancers
Project Blauwdruk
Dit project is bedoeld om een webapplicatie te bouwen die het facturatieproces voor freelancers in de Nederlandse filmindustrie vereenvoudigt. De applicatie automatiseert de complexe berekeningen op basis van de "Fijn Weekend" CAO.

Kernconcept
De tool stelt gebruikers in staat om na registratie en inloggen een berekening te maken voor een gewerkte dag. De gebruiker voert details in zoals werkuren, projectnaam en onkosten. De tool berekent vervolgens het correcte factuurbedrag op basis van de CAO-regels, inclusief alle toeslagen (overuren, nachtwerk, zondag, etc.).

De volledige specificaties en gebruikersflow zijn gedocumenteerd in het "Gebruikersflow en Technisch Ontwerp v2" document.

Design Filosofie
De visuele stijl van de applicatie is geïnspireerd op de interface van GitHub. De kernprincipes zijn:

Licht en Schoon: Gebruik van veel witruimte, een licht kleurenpalet (voornamelijk wit en grijstinten) en een strak, schreefloos lettertype. De interface moet rustig en niet-vermoeiend zijn voor de ogen.

Overzichtelijk en Functioneel: Duidelijke visuele hiërarchie. Belangrijke acties (zoals "+ Nieuwe Berekening") zijn prominente knoppen. De layout is intuïtief en de gebruiker kan moeiteloos vinden wat hij/zij zoekt. Het design dient de functionaliteit; geen onnodige decoratieve elementen.

Professioneel en Betrouwbaar: De uitstraling is solide en betrouwbaar, wat past bij een tool die met financiële data werkt.

Technologie Stack
Frontend: React.js

Backend: Node.js (of een vergelijkbaar platform)

Database: PostgreSQL / MySQL (of vergelijkbaar)

Ontwikkelingsfasen
Fase 1: Backend & Database (De Fundering)
Database Schema Opzetten:

Tabel Gebruikers (UserID, Email, Wachtwoord, AbonnementStatus)

Tabel Instellingen (UserID, Bedrijfsnaam, StandaardFunctie, StandaardDagtarief, StandaardKmVergoeding)

Tabel Berekeningen (BerekeningID, UserID, Datum, Projectnaam, InputGegevens, Totaalbedrag, Status, Notities)

API Endpoints Bouwen:

POST /api/users/register: Nieuwe gebruiker aanmaken.

POST /api/users/login: Gebruiker inloggen.

GET /api/settings: Instellingen van ingelogde gebruiker ophalen.

PUT /api/settings: Instellingen van ingelogde gebruiker bijwerken.

POST /api/calculations: Een nieuwe berekening uitvoeren en opslaan.

GET /api/calculations: Alle berekeningen van de ingelogde gebruiker ophalen.

Fase 2: Frontend (De Interface)
Project Structuur: Opzetten van een nieuw React-project.

Componenten Bouwen:

Register.js & Login.js

Dashboard.js (incl. lijst, zoek/filter functionaliteit)

CalculationForm.js (het complete invoerformulier)

Header.js & Footer.js

State Management: Implementeren van state management voor gebruikersauthenticatie.

API Integratie: De frontend componenten verbinden met de backend API's.

Fase 3: Extra Functionaliteiten & Testen
Callsheet Upload: Implementeren van de PDF-upload met AI-parsing.

PDF Export: Functie bouwen om een berekening als PDF te kunnen downloaden.

End-to-End Testen: Alle gebruikersflows grondig testen.

Deployment: De applicatie online zetten.
