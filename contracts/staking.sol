//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;


import "../contracts/m63.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract stakingLP {

    address public owner;
    uint8 public time_reward;
    uint8 public time_staking;    
    uint8 public percent;
    address private st_token;
    address private rw_token;

    struct _stake {
        uint startTime;
        uint256 amount;
        uint256 amountPay;
        uint timePay;
    }

    mapping (address => _stake) private _balances;

    constructor(address _st_token, address _rw_token, uint8 _time_reward, uint8 _time_staking, uint8 _percent) {
        owner = msg.sender; 
        st_token = _st_token;
        rw_token = _rw_token;        
        time_reward = _time_reward;
        time_staking = _time_staking;
        percent = _percent;
    }

    function stake(uint256 _amount) public returns (bool success) {
        //заводим lp токены
        ERC20(st_token).transferFrom(msg.sender, address(this), _amount);
        if (_balances[msg.sender].amount > 0) {
            _balances[msg.sender].amountPay += calcClaim(msg.sender);
        }
        _balances[msg.sender].startTime = block.timestamp;                
        _balances[msg.sender].amount += _amount;
        return true;
    }

    function claim() public returns (bool success) {
        require ((_balances[msg.sender].amount > 0) || (_balances[msg.sender].amountPay > 0), "No enough token");        
        require((block.timestamp - _balances[msg.sender].startTime) / 60 > time_reward , "Timing error");                
        //выводим ревард токены
        //transfer amount - amountPay
//        uint256 toPay = (_balances[msg.sender].amount - _balances[msg.sender].amountPay) / 100 * percent;
        uint256 toPay = calcClaim(msg.sender) + _balances[msg.sender].amountPay;
        m63(rw_token).mint(msg.sender, toPay);
        _balances[msg.sender].startTime = block.timestamp;
        _balances[msg.sender].amountPay = 0;
        return true;
    }

    function unstake() public returns (bool success) {
        require (_balances[msg.sender].amount > 0, "No enough token");
        require((block.timestamp - _balances[msg.sender].startTime) / 60  > time_staking, "Timing error");                        
//выводим lp токены
        ERC20(st_token).transfer(msg.sender, _balances[msg.sender].amount);
        _balances[msg.sender].amountPay = calcClaim(msg.sender);        
        _balances[msg.sender].amount = 0;                
        //transfer
        return true;
    }

    function calcClaim(address _sender) private view returns (uint256 _amount) {
        _amount = (_balances[_sender].amount) / 100 * percent * ((block.timestamp - _balances[msg.sender].startTime) / 60 / time_reward);
        return _amount;
    }

    function setTimeReward(uint8 _time) public isOwner() {
        time_reward = _time;
    }

    function setTimeStake(uint8 _time) public isOwner() {
        time_staking = _time;
    }

    function setPercent(uint8 _percent) public isOwner() {
        percent = _percent;
    }

    modifier isOwner {
        require(msg.sender == owner, "Only owner");
            _;
    }        

}