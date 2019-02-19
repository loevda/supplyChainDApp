var SupplyChain = artifacts.require('SupplyChain');

contract('SupplyChain', function(accounts) {
    // Declare few constants and assign a few sample accounts generated by ganache-cli
    var sku = 1;
    var upc = 1;
    var grapeID = 1;
    const ownerID = accounts[0];
    const growerID = accounts[1];
    const producerID = accounts[2];
    const wholesalerID = accounts[3];
    const retailerID = accounts[4];
    const consumerID = accounts[5];

    const growerName = "Granazzi";
    const growerInformation = "Valpolicella";
    const growerLatitude = "45.491084";
    const growerLongitude = "10.770316";

    const grapePrice = web3.utils.toWei("1", "ether");

    const producerName = "Valpolinazzi";
    const producerInformation = "Valpolicella";
    const producerLatitude = "45.486297";
    const producerLongitude = "10.774519";
    var productID = sku + upc;
    const productNotes = "Award winning Wine";

    const productPrice = web3.utils.toWei("1", "ether");

    var grapeState = 0;
    var wineState = 0;

    const emptyAddress = '0x00000000000000000000000000000000000000';

    console.log("ganache-cli accounts used here...");
    console.log("Contract Owner: accounts[0] ", accounts[0]);
    console.log("Grower: accounts[1] ", accounts[1]);
    console.log("Producer: accounts[2] ", accounts[2]);
    console.log("Wholesaler: accounts[3] ", accounts[3]);
    console.log("Retailer: accounts[4] ", accounts[4]);
    console.log("Consumer: accounts[5] ", accounts[5]);

    // 1st Test
    it("tests harvestGrapes() that lets a grower harvest grapes", async() => {
        const supplyChain = await SupplyChain.deployed();
        // add a new grower
        await supplyChain.addGrower(growerID);
        // Mark an item as Harvested by calling function harvestItem()
        await supplyChain.harvestGrapes(
            grapeID,
            growerName,
            growerInformation,
            growerLatitude,
            growerLongitude,
            grapePrice,
            {from: growerID}
        );
        // Retrieve the just now saved grape
        const grapeResult = await supplyChain.fetchGrape.call(grapeID);
        assert.equal(grapeResult[0], grapeID, 'Error: invalid grape ID');
        assert.equal(grapeResult[1], growerID, 'Error: grower is not the owner of the grapes');
        assert.equal(grapeResult[2], growerID, 'Error: invalid growerID');
        assert.equal(grapeResult[3], growerName, 'Error: invalid grower name');
        assert.equal(grapeResult[4], growerInformation, 'Error: invalid grower information');
        assert.equal(grapeResult[5], growerLatitude, 'Error: invalid grower latitute');
        assert.equal(grapeResult[6], growerLongitude, 'Error: invalid grower longitude');
        assert.equal(grapeResult[7], grapePrice, 'Error: invalid grape price');
        assert.equal(grapeResult[8], grapeState, 'Error: invalid grape state');
    });

    // 2nd Test
    it("tests addGrapesForSale() that allows a grower to put grapes for sale", async() => {
        const supplyChain = await SupplyChain.deployed();
        await supplyChain.addGrapesForSale(grapeID, {from: growerID});
        const grapeResult = await supplyChain.fetchGrape.call(grapeID);
        assert.equal(grapeResult[8], 1, 'Error: grape state is not For Sale');
    });

    // 3rd
    it("tests buyGrapes() that lets a producer buy grapes", async() => {
        const supplyChain = await SupplyChain.deployed();
        var growerInitialBalance = await web3.eth.getBalance(growerID);
        await supplyChain.addProducer(producerID);
        await supplyChain.buyGrapes(grapeID, grapePrice, {from: producerID, value: grapePrice});
        // Verify the result set
        const grapeResult = await supplyChain.fetchGrape.call(grapeID);
        assert.equal(grapeResult[1], producerID, 'Error: Producer is not the owner of the grapes');
        assert.equal(grapeResult[8], 2, 'Error: grape state is not Sold');
        // check balance of grower and producer
        var growerFinalBalance = await web3.eth.getBalance(growerID);
        var expectedBalance = parseInt(web3.utils.toWei(growerInitialBalance)) + parseInt(web3.utils.toWei(grapePrice));
        assert.equal(parseInt(web3.utils.toWei(growerFinalBalance)), expectedBalance, 'Error: grower balance is invalid');
    });


    // 4th
    it("tests shipGrapes() that allows a grower to ship grapes", async() => {
        const supplyChain = await SupplyChain.deployed();
        await supplyChain.shipGrapes(grapeID, {from: growerID});
        // Verify the result set
        const grapeResult = await supplyChain.fetchGrape.call(grapeID);
        assert.equal(grapeResult[8], 3, 'Error: grape state is not Shipped');
    });


    // 5th
    it("tests receiveGrapes() that allows a producer to receive grapes", async() => {
        const supplyChain = await SupplyChain.deployed();
        await supplyChain.receiveGrapes(grapeID, {from: producerID});
        // Verify the result set
        const grapeResult = await supplyChain.fetchGrape.call(grapeID);
        assert.equal(grapeResult[8], 4, 'Error: grape state is not Received');
    });

    /*
    // 6th
    it("Testing smart contract function produceWine() that allows a producer to produce wine", async() => {
        const supplyChain = await SupplyChain.deployed()
        // Verify the result set
        assert.equal(true, false, 'Incomplete test');
    });

    // 7th
    it("Testing smart contract function packWine() that allows a producer to pack wine", async() => {
        const supplyChain = await SupplyChain.deployed()
        // Verify the result set
        assert.equal(true, false, 'Incomplete test');
    });

    // 8th
    it("Testing smart contract function addWineForSale() that allows a producer to sell wine", async() => {
        const supplyChain = await SupplyChain.deployed()
        // Verify the result set
        assert.equal(true, false, 'Incomplete test');
    });

    // 9th
    it("Testing smart contract function buyWine() that allows a wholesaler to buy wine", async() => {
        const supplyChain = await SupplyChain.deployed()
        // Verify the result set
        assert.equal(true, false, 'Incomplete test');
    });

    // 10th
    it("Testing smart contract function shipWine() that allows a producer to ship wine", async() => {
        const supplyChain = await SupplyChain.deployed()
        // Verify the result set
        assert.equal(true, false, 'Incomplete test');
    });

    // 11th
    it("Testing smart contract function receiveWine() that allows a retailer to receive wine", async() => {
        const supplyChain = await SupplyChain.deployed()
        // Verify the result set
        assert.equal(true, false, 'Incomplete test');
    });

    // 12th
    it("Testing smart contract function purchaseWine() that allows a consumer to purchase wine", async() => {
        const supplyChain = await SupplyChain.deployed()
        // Verify the result set
        assert.equal(true, false, 'Incomplete test');
    });*/
});