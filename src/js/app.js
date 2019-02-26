App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    grapeID: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    //
    grapeOwnerID: "0x0000000000000000000000000000000000000000",
    growerID: "0x0000000000000000000000000000000000000000",
    growerName: null,
    growerInformation: null,
    growerLatitude: null,
    growerLongitude: null,
    grapePrice: 0,
    grapeVariety: null,
    grapeState: 0,

    // Wine
    itemPrice: 0,
    producerID: "0x0000000000000000000000000000000000000000",
    wholesalerID: "0x0000000000000000000000000000000000000000",
    retailerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",
    wineOwnerID: "0x0000000000000000000000000000000000000000",
    producerName: null,
    producerInformation: null,
    producerLatitude: null,
    producerLongitude: null,
    itemState: 0,
    itemInformation: null,
    itemID: null,
    wineGrapesIDs: [],

    grapeStates: [
        "Harvested",  // 0
        "ForSale",    // 1
        "Sold",       // 2
        "Shipped",    // 3
        "Received"    // 4
    ],
    wineState: {

    },

    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {

        // ROLES
        App.addressID = $("#addressID").val();
        App.roleType = $("#roleType").val();

        // GRAPES
        App.grapeID = $("#grapeID").val();
        App.grapeOwnerID = $("#grapeOwnerID").val();
        App.growerID = $("#growerID").val();
        App.growerName = $("#growerName").val();
        App.growerInformation = $("#growerInformation").val();
        App.growerLatitude = $("#growerLatitute").val();
        App.growerLongitude = $("#growerLongitude").val();
        App.grapeVariety = $("#grapeVariety").val();
        App.grapePrice = $("#grapePrice").val();
        // Wines
        App.sku = $("#wineSKU").val();
        App.upc = $("#wineFetchUPC").val();
        App.ownerID = $("#ownerID").val();
        App.producerID = $("#producerID").val();
        App.producerName = $("#producerName").val();
        App.producerInformation = $("#producerInformation").val();
        App.producerLatitude = $("#producerLatitute").val();
        App.producerLongitude = $("#producerLongitude").val();
        App.itemInformation = $("#itemInformation").val();
        App.itemPrice = $("#itemPrice").val();
        App.itemID = $("#itemID").val();
        App.wholesalerID = $("#wholesalerID").val();
        App.retailerID = $("#retailerID").val();
        App.consumerID = $("#consumerID").val();

        console.log(
            App.sku,
            App.upc,
            App.grapeOwnerID,
            App.growerID,
            App.growerName,
            App.growerInformation,
            App.growerLatitude,
            App.growerLongitude,
            App.grapePrice,
            App.grapeVariety,
            App.grapeState,
            // Wine
            App.itemPrice,
            App.producerID,
            App.wholesalerID,
            App.retailerID,
            App.consumerID,
            App.wineOwnerID,
            App.producerName,
            App.producerInformation,
            App.producerLatitude,
            App.producerLongitude,
            App.itemState,
            App.itemInformation,
            App.itemID,
            App.wineGrapesIDs,
        );
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];

        })
    },

    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain='../../build/contracts/SupplyChain.json';

        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            console.log('data',data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);

            //App.fetchItemBufferOne();
            //App.fetchItemBufferTwo();
            App.fetchEvents();

        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();
        App.getMetaskAccountID();
        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case 1:
                return await App.addRole(event);
                break;
            case 2:
                return await App.renounceRole(event);
                break;
            case 3:
                return await App.fetchGrape(event);
                break;
            case 4:
                return await App.harvestGrapes(event);
                break;
            case 5:
                return await App.addGrapeForSale(event);
                break;
            case 6:
                return await App.buyGrapes(event);
                break;
            case 7:
                return await App.shipGrapes(event);
                break;
            case 8:
                return await App.receiveGrapes(event);
                break;
            /*case 9:
                return await App.purchaseItem(event);
                break;
            case 10:
                return await App.fetchItemBufferOne(event);
                break;
            case 11:
                return await App.fetchItemBufferTwo(event);
                break;
            case 12:
                return await App.fetchItemBufferTwo(event);
                break;
            case 13:
                return await App.fetchItemBufferTwo(event);
                break;
            case 14:
                return await App.fetchItemBufferTwo(event);
                break;
            case 15:
                return await App.fetchItemBufferTwo(event);
                break;
            case 16:
                return await App.fetchItemBufferTwo(event);
                break;*/
        }
    },

    addRole: function(event) {
        event.preventDefault();
        App.readForm();
        if (!App.addressID || App.roleType === "") {
            alert("Insert a valid address and select a role type.")
        }else {
            App.contracts.SupplyChain.deployed().then(function(instance) {
                switch(App.roleType) {
                    case "GROWER":
                        return instance.addGrower(
                            App.addressID
                        );
                        break;
                    case "PRODUCER":
                        return instance.addProducer(
                            App.addressID
                        );
                        break;
                    case "WHOLESALER":
                        return instance.addWholesaler(
                            App.addressID
                        );
                        break;
                    case "RETAILER":
                        return instance.addRetailer(
                            App.addressID
                        );
                        break;
                    case "CONSUMER":
                        return instance.addConsumer(
                            App.addressID
                        );
                        break;
                    default:
                        // should not get there but
                        throw Error("You need to select a role type");
                        break;
                }
            }).then((result) => {
                console.log(result);
            }).catch(function(err) {
                console.log(err.message);
            });
        }

    },

    renounceRole: function(event) {
        event.preventDefault();
        App.readForm();
        if (App.roleType === "") {
            alert("Select a role type.")
        }else {
            var goAhead = confirm("You are about to renounce to your role." +
                "This might affect your ability to interact with this app.");
            if (goAhead) {
                App.contracts.SupplyChain.deployed().then(function(instance) {
                    switch(App.roleType) {
                        case "GROWER":
                            return instance.renounceGrower(
                                App.getMetaskAccountID()
                            );
                            break;
                        case "PRODUCER":
                            return instance.renounceProducer(
                                App.getMetaskAccountID()
                            );
                            break;
                        case "WHOLESALER":
                            return instance.renounceWholesaler(
                                App.getMetaskAccountID()
                            );
                            break;
                        case "RETAILER":
                            return instance.renounceRetailer(
                                App.getMetaskAccountID()
                            );
                            break;
                        case "CONSUMER":
                            return instance.renounceConsumer(
                                App.getMetaskAccountID()
                            );
                            break;
                        default:
                            // should not get there but
                            throw Error("You need to select a role type");
                            break;
                    }
                }).then((result) => {
                    console.log(result);
                }).catch(function(err) {
                    console.log(err.message);
                });
            }
        }
    },

    fetchGrape: function(event) {
        event.preventDefault();
        App.readForm();
        if (!parseInt(App.grapeID)) {
            alert("Please insert a grape ID");
        } else {
            App.contracts.SupplyChain.deployed().then((instance) => {
                return instance.fetchGrape(App.grapeID);
            }).then((result) => {
                if (result[0] == 0) {
                    alert("Unknown grape ID");
                } else {
                    $('#grapeID').val(result[0]);
                    $('#grapeOwnerID').val(result[1]);
                    $('#growerID').val(result[2]);
                    $('#growerName').val(result[3]);
                    $('#growerInformation').val(result[4]);
                    $('#growerLatitute').val(result[5]);
                    $('#growerLongitude').val(result[6]);
                    $('#grapePrice').val(web3.fromWei(result[7].toString(), "ether"));
                    $('#grapeState').val(App.grapeStates[result[8]]);
                    $('#grapeVariety').val(result[9]);
                }
                console.log(result);
            }).catch((err) => {
                console.log(error);
            });
        }
    },


    // GRAPES
    harvestGrapes: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        App.readForm();
        if (
            !App.growerName || !App.growerLongitude || !App.growerLongitude
            || !App.growerInformation || !App.grapeVariety
        ) {
            alert("Make sure to provide a grower name, latitude, longitude, information and " +
                "a grape variety.")
        } else {
            var goAhead = confirm("You are about to harvest some grapes. Please confirm " +
                "the information are correct.")
            if (goAhead) {
                App.contracts.SupplyChain.deployed().then(function(instance) {
                    return instance.harvestGrapes(
                        App.growerName,
                        App.growerInformation,
                        App.growerLatitude,
                        App.growerLongitude,
                        App.grapeVariety
                    )
                }).then(function(result) {
                    console.log('harvestGrapes',result);
                }).catch(function(err) {
                    console.log(err.message);
                });
            }
        }

    },

    addGrapeForSale: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        App.readForm();
        web3 = new Web3(App.web3Provider);

        if (App.grapePrice <= 0) {
            alert("Please enter a valid price in ETHER!");
        }else{
            var goAhead = confirm("Are you sure the given price is correct?");
            if (goAhead) {
                const _grapePrice = web3.toWei(App.grapePrice, "ether");
                App.contracts.SupplyChain.deployed().then(function(instance) {
                    return instance.addGrapesForSale(
                        App.grapeID,
                        _grapePrice
                    )
                }).then(function(result) {
                    console.log('addGrapesForSale',result);
                }).catch(function(err) {
                    console.log(err.message);
                });
            }
        }

    },

    buyGrapes: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        App.readForm();

        var goAhead = confirm(`Are you sure you want to buy these grapes for ${App.grapePrice} ETH?`);
        if (goAhead) {
            App.contracts.SupplyChain.deployed().then(function(instance) {
                return instance.buyGrapes(
                    App.grapeID,
                    {from: App.getMetaskAccountID(), value: web3.toWei(App.grapePrice, "ether")}
                );
            }).then(function(result) {
                console.log('buyGrapes',result);
            }).catch(function(err) {
                console.log(err.message);
            });
        }
    },

    shipGrapes: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        App.readForm();

        var goAhead = confirm(`Are you sure you want to ship to ${App.grapeOwnerID}?`);
        if (goAhead) {
            App.contracts.SupplyChain.deployed().then(function(instance) {
                return instance.shipGrapes(
                    App.grapeID
                );
            }).then(function(result) {
                console.log('shipGrapes',result);
            }).catch(function(err) {
                console.log(err.message);
            });
        }
    },

    receiveGrapes: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        App.readForm();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.receiveGrapes(
                App.grapeID
            );
        }).then(function(result) {
            console.log('shipGrapes',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    processItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.processItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('processItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    packItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.packItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('packItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    sellItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const productPrice = web3.toWei(1, "ether");
            console.log('productPrice',productPrice);
            return instance.sellItem(App.upc, App.productPrice, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('sellItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    buyItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const walletValue = web3.toWei(3, "ether");
            return instance.buyItem(App.upc, {from: App.metamaskAccountID, value: walletValue});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('buyItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    shipItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.shipItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('shipItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    receiveItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.receiveItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('receiveItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    purchaseItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.purchaseItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('purchaseItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    fetchItemBufferOne: function () {
        ///   event.preventDefault();
        ///    var processId = parseInt($(event.target).data('id'));
        App.upc = $('#upc').val();
        console.log('upc',App.upc);

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.fetchItemBufferOne(App.upc);
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('fetchItemBufferOne', result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    fetchItemBufferTwo: function () {
        ///    event.preventDefault();
        ///    var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.fetchItemBufferTwo.call(App.upc);
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('fetchItemBufferTwo', result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                    App.contracts.SupplyChain.currentProvider,
                    arguments
                );
            };
        }

        App.contracts.SupplyChain.deployed().then(function(instance) {
            var events = instance.allEvents(function(err, log){
                console.log(log.args[0]);
                try {
                    var _grapeID = log.args.grapeId;
                    if(_grapeID) {
                        $("#grapeID").val(_grapeID);
                        $("#grapeFetch").click();
                    }
                }catch(err){
                    console.log(err);
                }
                try {
                    var _upc = log.args.upc;
                    if(_upc) {
                        console.log(_upc);
                    }
                }catch(err){
                    console.log(err);
                }
                if (!err) {
                    $("#allEvents").show();
                    $("#ftc-events").prepend('<li>> <b>' + new Date().toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit', second:'2-digit'}) + '</b>: ' + log.event + ' - ' + log.transactionHash + '</li>');
                }
            });
        }).catch(function(err) {
            console.log(err.message);
        });
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});