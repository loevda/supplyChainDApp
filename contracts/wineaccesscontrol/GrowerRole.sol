pragma solidity = 0.5.0;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'GrowerRole' to manage this role - add, remove, check
contract GrowerRole {
    using Roles for Roles.Role;

    // Define 2 events, one for Adding, and other for Removing
    event GrowerAdded(address indexed account);
    event GrowerRemoved(address indexed account);

    // Define a struct 'Growers' by inheriting from 'Roles' library, struct Role
    Roles.Role private Growers;

    // In the constructor make the address that deploys this contract the 1st Grower
    constructor() public {
        _addGrower(msg.sender);
    }

    // Define a modifier that checks to see if msg.sender has the appropriate role
    modifier onlyGrower() {
        require(isGrower(msg.sender));
        _;
    }

    // Define a function 'isGrower' to check this role
    function isGrower(address account) public view returns (bool) {
        return Growers.has(account);
    }

    // Define a function 'addGrower' that adds this role
    function addGrower(address account) public onlyGrower {
        _addGrower(account);
    }

    // Define a function 'renounceGrower' to renounce this role
    function renounceGrower() public {
        _removeGrower(msg.sender);
    }

    // Define an internal function '_addGrower' to add this role, called by 'addGrower'
    function _addGrower(address account) internal {
        Growers.add(account);
        emit GrowerAdded(account);
    }

    // Define an internal function '_removeGrower' to remove this role, called by 'removeGrower'
    function _removeGrower(address account) internal {
        Growers.remove(account);
        emit GrowerRemoved(account);
    }
}