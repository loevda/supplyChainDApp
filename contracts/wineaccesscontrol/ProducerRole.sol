pragma solidity = 0.5.0;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'ProducerRole' to manage this role - add, remove, check
contract ProducerRole {

    using Roles for Roles.Role;

    // Define 2 events, one for Adding, and other for Removing
    event ProducerAdded(address indexed account);
    event ProducerRemoved(address indexed account);

    // Define a struct 'Producers' by inheriting from 'Roles' library, struct Role
    Roles.Role private Producers;

    // In the constructor make the address that deploys this contract the 1st Producer
    constructor() public {
        _addProducer(msg.sender);
    }

    // Define a modifier that checks to see if msg.sender has the appropriate role
    modifier onlyProducer() {
        require(isProducer(msg.sender));
        _;
    }

    // Define a function 'isProducer' to check this role
    function isProducer(address account) public view returns (bool) {
        return Producers.has(account);
    }

    // Define a function 'addProducer' that adds this role
    function addProducer(address account) public onlyProducer {
        _addProducer(account);
    }

    // Define a function 'renounceProducer' to renounce this role
    function renounceProducer() public {
        _removeProducer(msg.sender);
    }

    // Define an internal function '_addProducer' to add this role, called by 'addProducer'
    function _addProducer(address account) internal {
        Producers.add(account);
        emit ProducerAdded(account);
    }

    // Define an internal function '_removeProducer' to remove this role, called by 'removeProducer'
    function _removeProducer(address account) internal {
        Producers.remove(account);
        emit ProducerRemoved(account);
    }
}
