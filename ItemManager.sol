// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
import "./Item.sol";

contract ItemManager {

    enum SupplyChainSteps{Created, Paid, Delivered}

    struct List_Item {
        Item _item;
        ItemManager.SupplyChainSteps _state;
        string _identifier;
        uint _itemPrice;
    }
    mapping(uint => List_Item) public items;
    uint itemIndex;

    event SupplyChainStep(uint _itemIndex, uint _state, address _itemAddress);

    function createItem(string memory _identifier, uint _itemPrice) public {
        Item item = new Item(this, _itemPrice, itemIndex);
        items[itemIndex]._item = item; 
        items[itemIndex]._itemPrice = _itemPrice;
        items[itemIndex]._state = SupplyChainSteps.Created;
        items[itemIndex]._identifier = _identifier;
        emit SupplyChainStep(itemIndex, uint(items[itemIndex]._state), address(item));
        itemIndex++;
    
    }   

    function triggerDelivery(uint _itemIndex) public {
        require(items[_itemIndex]._state == SupplyChainSteps.Paid, "The Item is moved to next step");
        items[_itemIndex]._state = SupplyChainSteps.Delivered;
        emit SupplyChainStep(_itemIndex, uint(items[_itemIndex]._state), address(items[_itemIndex]._item));
        
    }
}