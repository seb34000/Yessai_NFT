import { Component } from "react"
import { ethers } from "ethers";
import Modal from 'react-modal';
import Contract from '../artifacts/contracts/ERC721Markle.sol/ERC721Merkle.json';
import "../Style/App.css";
import "../Style/Modal.css";
import { address } from "../const";


const keccak256 = require("keccak256");
const whitelist = require("../whitelist.json");
const tokens = require("../tokens.json");
const { MerkleTree } = require("merkletreejs");


export default class Shop extends Component {
    constructor(props) {
        super(props)
        this.state = {
            item: null,
            account: [],
            price: this.props.price,
            showModal: false,
            load: false,
        }

    }

    componentDidUpdate = () => {
        if (this.state.account !== this.props.account) {
            this.setState({
                account: this.props.account,
            })
        }
        if (this.state.price !== this.props.price) {
            this.setState({
                price: this.props.price,
            })
        }
    }

    mint = async(token) => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(address, Contract.abi, signer);

            let whiteListAccount = [];
            whitelist.forEach(address => {
                whiteListAccount.push(address.address);
            });
            const leave = whiteListAccount.map(address => keccak256(address));
            const tree = new MerkleTree(leave, keccak256, { sort: true });
            const leaf = keccak256(this.state.account[0]);
            const proof = tree.getHexProof(leaf);

            try {
                const fee = await contract.estimateGas.mintNFT(this.state.account[0], proof, token.json, token.edition);
                const value = ethers.utils.parseEther(this.state.price).add(fee);
                console.log("value: ")
                console.log(value.toString())
                let overrides = {
                    value: value,
                    from: this.state.account[0],
                }
                const u = token.json;
                const tx = await contract.mintNFT(this.state.account[0], proof, u, token.edition, overrides);
                const receipt = await tx.wait();
                // console.log(receipt);
            } catch (error) {
                console.error(error);
            }
        }
    }

    isSaleToken = async(tokenId) => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(address, Contract.abi, provider);
            try {
                let isSale = await contract.isTokenSale(tokenId);
                console.log(`isSale: ${isSale}`);
                return isSale;
            } catch (error) {
                console.error(error);
            }
        }
    }

    setTitem(idItem) {
        if (!this.state.showModal) {
            for (let i = 0; i < tokens.length; i++) {
                if (tokens[i].edition === parseInt(idItem, 10)) {
                    this.isSaleToken(tokens[i].edition).then(isSale => {
                        tokens[i].saled = isSale;
                        this.setState({ item: tokens[i] }, () => {
                            console.log(this.state.item);
                            this.setState({ showModal: true });
                        });
                    })
                    break;
                }
            }
        }
    }

    unsetItem() {
        this.setState({ showModal: false })
        this.setState({ item: null })
    }

    render() {
        return ( 
        <div className = 'App-body'>
            <div className = "App-body">
                <Modal isOpen = { this.state.showModal } shouldCloseOnOverlayClick = { true } onRequestClose = { this.unsetItem } shouldCloseOnEsc = { true } className = "Modal" >
                    <div className = 'Modal-header' >
                        <button className = 'Modal-btn' onClick = {
                            () => this.unsetItem() } > 
                        </button> 
                    </div> {
                        this.state.item ?
                        <div className = 'Modal-content' >
                            <img src = { this.state.item.image } className = 'Modal-img' / >
                            <div className = 'Modal-content-txt' >
                                <text className = 'Modal-txt' > Name: { this.state.item.name } </text> 
                                <text className = 'Modal-txt' > Description: { this.state.item.description } </text> 
                                <text className = 'Modal-txt' > ID: { this.state.item.edition } </text> 
                                <text className = 'Modal-txt' > Caracteristiq </text> 
                                {
                                    this.state.item.attributes.map(elm => {
                                        return <text className = 'Modal-txt' > { elm.trait_type }: { elm.value } </text>
                                    })
                                } {
                                    this.state.item.saled &&
                                    <button onClick = {
                                        () => this.mint(this.state.item) } className = 'Modal-button-buy' > Buy now 
                                    </button>
                                } </div> 
                            </div>
                        :
                            null
                } </Modal> 
            </div> 
                <div className = 'Shop'> {
                    tokens.map((token, index) => ( 
                        <div className = 'ShopItem'
                            onClick = {
                                () => this.setTitem(index + 1) }
                            alt = { index }>
                            <img className = 'ImgItem' onMouseOver = {(e) => {
                                    if (this.state.item != null)
                                        e.target.style.opacity = 1;
                                    else
                                        e.target.style.opacity = 0.5;
                                }
                            }
                            onMouseOut = {
                                (e) => {
                                    e.target.style.opacity = 1;
                                }
                            }
                            src = { token.image }/> 
                        </div>
                    ))
                } 
                </div> 
            </div>
        )
    }
}