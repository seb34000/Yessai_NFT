pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ERC721Merkle is Ownable, ERC721URIStorage {
    /* Racine of the merkle tree */
    bytes32 immutable public root;
    address private _contract_Owner;
    uint private _price;
    // uint private _tokenId = 1;
    uint private _balances;
    uint private _totalSupply = 6;
            /* id => 0 not sale 1 sale */
    mapping (uint => uint) private _tokenSale;

    mapping (address => uint8) private _whiteList;

    /* maping for vote */
    mapping (address => uint) private _vote;
    string private _question;
    
    event UpdatedMessages(string oldStr, string newStr);

    constructor(string memory name, string memory symbol, bytes32 merkleRoot)
    ERC721(name, symbol) {
        root = merkleRoot;
        _balances = 0;
        _contract_Owner = msg.sender;
        // _tokenId = 1;
        _price = 1 ether;
        _question = "The owner of contract has not yet asked a question";
        for (uint i = 1; i < _totalSupply; i++) {
            _tokenSale[i] = 0;
        }
    }

    function setTokenSale(uint256 tokenId) public {
        _tokenSale[tokenId] = 1;
    }

    function isTokenSale(uint256 tokenId) public view returns (bool) {
        return _tokenSale[tokenId] == 0;
    }

    /* Withdraws the balance of the contract */
    function withdraw() public onlyOwner() {
        payable(msg.sender).transfer(getBalance());
        _balances = 0;
    }

    /* Price setters and getters */
    // function setPrice(uint newPrice) public {
    //     _price = newPrice;
    // }

    function getPrice() public view returns (uint256) {
        return _price;
    }
    /******************************/


    /* Get balance of contract */
    function getBalance() public view returns (uint) {
        return _balances;
    }

    /* Get owner of contract */
    function getOwner() public view returns (address) {
        // return _contract_Owner;
        return _contract_Owner;
    }

    function getQuestion() public view returns (string memory) {
        return _question;
    }

    function setQuestion(string memory question) external onlyOwner() {
        // _question = question;
        string memory oldQst = _question;
        _question = question;
        emit UpdatedMessages(oldQst, question);
    }
    /******************************/


    function isWhitelisted(address account, bytes32[] calldata proof) internal view returns(bool) {
        return _verify(_leaf(account), proof);
    }

    function mintNFT(address to, bytes32[] calldata proof, string memory uri, uint tokenId) external payable {
        require(isTokenSale(tokenId), "This token is already sale");
        require(isWhitelisted(to, proof), "Not on the whitelist");
        require(msg.value != _price, "Not enought ether");
        setTokenSale(tokenId);
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _balances = _balances + msg.value;
    }

    /* return hash of account parameters */
    function _leaf(address account) internal pure returns(bytes32) {
        return keccak256(abi.encodePacked(account));
    }

    /* check if address is on whitelist */
    function _verify(bytes32 leaf, bytes32[] memory proof) internal view returns(bool) {
        return MerkleProof.verify(proof, root, leaf);   
    }

    function setVote(bytes32[] calldata proof) public {
        require(isWhitelisted(msg.sender, proof), "Not on the whitelist");
        // _vote[msg.sender] = msg.value;
    }

    /* create a fallback function for the contract with solidity 0.8.0 */
    fallback() external payable {
        _balances = _balances + msg.value;
    }

}