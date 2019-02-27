# Supply Chain DApp
DApp supply chain that lets you track wine authenticity on the Ethereum blockchain.<hr />
![DApp screenshot](src/img/wineDApp.jpg?raw=true "Wine Supply Chain DApp")
## Setup project:
__Notes:__ The project has been tested with __Truffle v5.0.4__, __Solidity 0.5.0__ and __npm v10.15.1__
1. Clone the repository
2. Run command __npm install__ to install the project dependencies.
3. Start Ganache
4. __truffle compile --all__
4. __truffle --network ganache migrate --reset__
3. __npm run dev__ to run the application

##### Notes
If switching accounts while using Metamask you probably will have to cancel the transaction history from the settings and reload the page.

## Contract on Rinkeby

| Contract address on Rinkeby test network                           | 
|--------------------------------------------------------------------|
| 0x0BB5AE997acB147Ce45Bac4e568AB2C29Ae03a35                         |



## UML:
__IMPORTANT NOTE__: __Activity__, __sequence__ and __state__ diagrams have been updated.
Consumer __buyWine__ has been renamed __purchaseWine__ to remove ambiguity with retailer __buyWine__.
The __sequence diagram__ has been updated: __fetchHistory__ has been removed, __fetchGrape__ has been added. 
The __class diagram__ has been updated to reflect changes in the DApp smart contracts inheritance.

---
##### Activity diagram
![Activity diagram](UML/ACTIVITY.png?raw=true "Activity")

---
##### Sequence diagram
![Sequence diagram](UML/SEQUENCE.png?raw=true "Sequence")

---
##### State diagram
![State diagram](UML/STATE.png?raw=true "State")

---
##### Class diagram
![Class diagram](UML/CLASS.png?raw=true "Class")

## Roadmap
I'm running late and have been busy with exceptional workload so a lot of features are missing and I hope to develop then further:
1. Store the tx history inside the blockchain;
2. Integrate Google Map on the front-end;
3. Deploy the DApp to IPFS;

## Credits
##### Wine supply chain
The basic concept fo the supply chain is trying to map the Wine Supply Chain Traceability GS1 Application Guideline:
* https://www.gs1us.org/DesktopModules/Bring2mind/DMX/Download.aspx?Command=Core_Download&EntryId=660&language=en-US&PortalId=0&TabId=134
##### Theme
*https://startbootstrap.com/themes/agency/
##### Images
* https://pixabay.com/en/wine-glass-white-grapes-drinks-1761613/