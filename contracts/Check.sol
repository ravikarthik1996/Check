pragma solidity ^0.4.18;


contract Check { 

    bytes32 private originalimage = keccak256(uint256(1234567890));//hashed value of key
    mapping (address => bool) public checkimage;
    mapping (address => bytes32) public signimage;

    function Checkimage(uint256  image, address recipient) public {
        var signimg = keccak256(image);
        if ( signimg == originalimage ) {
            checkimage[recipient] = true;  
	    signimage[recipient] = signimg;
        }
    }

    function mapreturn(address rec) public view returns(bool){
        return checkimage[rec];

    }
    
}
