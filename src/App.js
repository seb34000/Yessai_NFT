import { Component } from 'react';
import { ethers } from 'ethers';
import Contract from './artifacts/contracts/ERC721Markle.sol/ERC721Merkle.json';
import './Style/App.css';
import "./Style/Modal.css";
import { Link, Element } from 'react-scroll';
import Roadmap from './Componnent/Roadmap';
import Shop from './Componnent/Shop';
import Header from './Componnent/Header';
import Vote from './Componnent/Vote';
import { address } from './const';

const { MerkleTree } = require("merkletreejs");

const keccak256 = require("keccak256");
const whitelist = require("./whitelist.json");
const tokens = require("./tokens.json");

// const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

class TokenOject {
	constructor(id, isSale) {
		this.id = id;
		this.isSale = isSale;
	};
}


class App extends Component {
    constructor(props) {
      	super(props)
      	this.state = {
			/* Technicals */
			account: [],

			balance: 0,
			price: 0,
			isLaunched: false,

			openedModal: -1,

			totalSupply: 6,
			tokenArray: [],

			item: null,
			showModal: false,


		};
    }

	componentDidMount = async () => {
		await this.getAccount();
		await this.getPrice();
		await this.getBalance()
		await this.getSaleToken();
	}

	getSaleToken = async () => {
		if (typeof window.ethereum !== 'undefined') {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const contract = new ethers.Contract(address, Contract.abi, provider.getSigner());
			try {
				let arr = []
				for (let i = 1; i < this.state.totalSupply; i++) {
					let isSale = await contract.isTokenSale(i);
					let token = new TokenOject(i, isSale);
					arr.push(token);
				}
				this.setState({tokenArray: arr});

			} catch (error) {
				console.error(error);
			}
		}
		let arr = [];
		for (let i = 1; i < this.state.totalSupply; i++) {
			let token = new TokenOject(i, false);
			arr.push(token);
		}
		this.setState({tokenArray: arr});
	}

	getAccount = async () => {
		if (typeof window.ethereum !== 'undefined') {
			
			let accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
			this.setState({account: accounts});
		}
	}

	getPrice = async () => {
		if (typeof window.ethereum !== 'undefined') {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const contract = new ethers.Contract(address, Contract.abi, provider);
			try {
				const price = await contract.getPrice();
				this.setState({price: ethers.utils.formatEther(price)});
				console.log(`price: ${price}`);
			} catch (error) {
				console.error(error);
			}
		}
	}

	getBalance = async () => {
		if (typeof window.ethereum !== 'undefined') {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const contract = new ethers.Contract(address, Contract.abi, provider);
			try {
				const balance = await contract.getBalance();
				console.log("Balance: " + balance);
			} catch (error) {
				console.error(error);
			}
		}
	}

	render() {
		return (
			<div className="App">
				<Header account={this.state.account[0]}/>
				<Element name='roadmap'>
					<text>
						<Roadmap/>
					</text>
				</Element>
				<Element name='shop'>
					<Shop account={this.state.account} price={this.state.price}/>
				</Element>
				{/* <Element name='whitelist'>
					<Vote account={this.state.account[0]} contract_address={address}/>
				</Element> */}
			</div>
		)
	}
};

export default App;
