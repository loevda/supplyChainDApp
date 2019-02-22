var SupplyChain = artifacts.require('SupplyChain');

contract('SupplyChain', function(accounts) {
    // Declare few constants and assign a few sample accounts generated by ganache-cli
    var sku = 1;
    var upc = 1;
    var grapeID = 1;
    // set a producer company prefix
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

    const emptyAddress = '0x0000000000000000000000000000000000000000';

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
        var roleResult = await supplyChain.addGrower(growerID);
        // Mark an item as Harvested by calling function harvestItem()
        var result = await supplyChain.harvestGrapes(
            grapeID,
            growerName,
            growerInformation,
            growerLatitude,
            growerLongitude,
            0,
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
        assert.equal(grapeResult[8], grapeState, 'Error: invalid grape state');
    });

    // 2nd Test
    it("tests addGrapesForSale() that allows a grower to put grapes for sale", async() => {
        const supplyChain = await SupplyChain.deployed();
        await supplyChain.addGrapesForSale(grapeID, grapePrice, {from: growerID});
        const grapeResult = await supplyChain.fetchGrape.call(grapeID);
        assert.equal(grapeResult[7], grapePrice, 'Error: invalid grape price.');
        assert.equal(grapeResult[8], 1, 'Error: grape state is not For Sale');
    });

    // 3rd
    it("tests buyGrapes() that lets a producer buy grapes", async() => {
        const supplyChain = await SupplyChain.deployed();
        var growerInitialBalance = await web3.eth.getBalance(growerID);
        await supplyChain.addProducer(producerID);
        var tx = await supplyChain.buyGrapes(grapeID, grapePrice, {from: producerID, value: grapePrice});
        // Verify the result set
        const grapeResult = await supplyChain.fetchGrape.call(grapeID);
        assert.equal(grapeResult[1], producerID, 'Error: Producer is not the owner of the grapes');
        assert.equal(grapeResult[8], 2, 'Error: grape state is not Sold');
        // check balance of grower
        var growerFinalBalance = await web3.eth.getBalance(growerID);
        var expectedBalance = parseInt(growerInitialBalance) + parseInt(grapePrice);
        assert.equal(parseInt(growerFinalBalance),
            expectedBalance, 'Error: grower balance is invalid');
        console.log(tx);
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


    // 6th
    it("tests produceWine() that allows a producer to produce wine", async() => {
        const supplyChain = await SupplyChain.deployed();
        var wineUPC = await supplyChain.produceWine(
            producerName,
            producerInformation,
            producerLatitude,
            producerLongitude,
            productNotes,
            [1],
            0,
            {from: producerID}
        );
        // Verify the result set

        const wineResultOne = await supplyChain.fetchWineOne.call(upc);
        const wineResultTwo = await supplyChain.fetchWineTwo.call(upc);
        const wineResultGrapes = await supplyChain.fetchWineGrapes.call(upc);
        assert.equal(wineResultOne[0], sku, 'Error: invalid  sku');
        assert.equal(wineResultOne[1], sku, 'Error: invalid upc');
        assert.equal(wineResultOne[2], producerID, 'Error: producerID is not the owner of the wine');
        assert.equal(wineResultOne[3], producerID, 'Error: invalid producer ID');
        assert.equal(wineResultOne[4], 0, 'Error: invalid product price');
        assert.equal(wineResultOne[5], 0, 'Error: invalid wineState');
        assert.equal(wineResultOne[6], emptyAddress, 'Error: invalid wholesalerID - should be empty');
        assert.equal(wineResultOne[7], emptyAddress, 'Error: invalid retailerID - should be empty');
        assert.equal(wineResultOne[8], emptyAddress, 'Error: invalid consumerID - should be empty');
    });


    // 7th
    it("tests packWine() that allows a producer to pack wine", async() => {
        const supplyChain = await SupplyChain.deployed();
        await supplyChain.packWine(upc, {from: producerID});
        // Verify the result set
        const wineResultOne = await supplyChain.fetchWineOne.call(upc);
        assert.equal(wineResultOne[0], upc, 'Error: invalid upc');
        assert.equal(wineResultOne[5], 1, 'Error: invalid wineState');
    });



    // 8th
    it("tests addWineForSale() that allows a producer to sell wine to retailer", async() => {
        const supplyChain = await SupplyChain.deployed();
        await supplyChain.addWineForSale(upc, {from: producerID});
        // Verify the result set
        const wineResultOne = await supplyChain.fetchWineOne.call(upc);
        assert.equal(wineResultOne[0], upc, 'Error: invalid upc');
        assert.equal(wineResultOne[5], 2, 'Error: invalid wineState');
    });


    // 9th
    it("test buyWine() that allows a retailer to buy wine", async() => {
        const supplyChain = await SupplyChain.deployed();
        await supplyChain.addRetailer(retailerID);
        await supplyChain.buyWine(upc, {from: retailerID});
        // Verify the result set
        const wineResultOne = await supplyChain.fetchWineOne.call(upc);
        assert.equal(wineResultOne[0], upc, 'Error: invalid upc');
        assert.equal(wineResultOne[2], retailerID, 'Error: retailerID is not the onwer of the wine');
        assert.equal(wineResultOne[5], 3, 'Error: invalid wineState');
        assert.equal(wineResultOne[7], retailerID, 'Error: invalid retailerID');
    });



    // 10th
    it("tests shipWine() that allows a producer to ship wine", async() => {
        const supplyChain = await SupplyChain.deployed()
        await supplyChain.shipWine(upc, {from: producerID});
        // Verify the result set
        const wineResultOne = await supplyChain.fetchWineOne.call(upc);
        assert.equal(wineResultOne[0], upc, 'Error: invalid upc');
        assert.equal(wineResultOne[5], 4, 'Error: invalid wineState');
    });


    // 11th
    it("tests receiveWine() that allows a retailer to receive wine", async() => {
        const supplyChain = await SupplyChain.deployed();
        await supplyChain.receiveWine(upc, {from: retailerID});
        // Verify the result set
        const wineResultOne = await supplyChain.fetchWineOne.call(upc);
        assert.equal(wineResultOne[0], upc, 'Error: invalid upc');
        assert.equal(wineResultOne[5], 5, 'Error: invalid wineState');
    });

    // 12th
    it("tests purchaseWine() that allows a consumer to purchase wine", async() => {
        const supplyChain = await SupplyChain.deployed();
        await supplyChain.addConsumer(consumerID);
        await supplyChain.purchaseWine(upc, {from: consumerID});
        // Verify the result set
        const wineResultOne = await supplyChain.fetchWineOne.call(upc);
        assert.equal(wineResultOne[0], upc, 'Error: invalid upc');
        assert.equal(wineResultOne[5], 6, 'Error: invalid wineState');
    });
});