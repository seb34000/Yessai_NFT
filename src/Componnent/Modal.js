import { Component } from "react";
import React from "react";
import { ethers } from 'ethers';
import Contract from './../artifacts/contracts/ERC721Markle.sol/ERC721Merkle.json';
import './../Style/Modal.css';
import { Modal } from 'react-bootstrap';

// const tokens = require("./../tokens.json");


export default class ModalShop extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: this.props.show,
			item: this.props.item,
		}
	}

	componentDidUpdate() {
		if (this.props.show !== this.state.show) {
			this.setState({show: this.props.show}, () => {
				if (this.state.show && this.props.item !== this.state.item) {
					this.setState({item: this.props.item});
				}
			});
		}
	}

	render() {
		if (!this.state.show || !this.state.item) 
			return null;
		return (
			<div className="modal-container">
				<Modal 
					show={this.state.show} 
					onHide={() => this.setState({show: false})}
					backdrop="static"
					keyboard={false}
					centered
					fullscreen={true}
					contentClassName="modal"
				>
					<Modal.Header>
						<Modal.Title>{this.state.item.name}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{this.state.item.description}
					</Modal.Body>

				</Modal>
			</div>
		)
}
}

// export default class Modal extends Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			item: null,
// 			isReady: false,
// 		}
// 	}

// 	componentDidMount = async () =>{
// 		console.log("Test mounting")
// 		await this.setItem();
// 	}
	
// 	componentDidUpdate = async () => {
// 		if (!this.state.isReady) {
// 			console.log("Test update")
// 			await this.setItem();
// 		}
// 	}
	
// 	setItem = async () => {
// 		if (this.props.item !== null) {
// 			this.setState({item: this.props.item}, 
// 				() => {this.setState({isReady: true})})
// 		}
// 	}

// 	close = () => {
// 		this.setState({isReady: false})
// 		this.setItem({item: null})
// 		this.state.closeModal();
// 	}

// 	isTokenSaled = async () => {
// 		if (typeof window.ethereum !== 'undefined') {
// 			const provider = new ethers.providers.Web3Provider(window.ethereum);
// 			const contract = new ethers.Contract(this.props.address, Contract.abi, provider.getSigner());
// 			try {
// 				let isSale = await contract.isTokenSale(this.state.item.edition);
// 				console.log(isSale)
// 				return isSale;
// 			} catch (err) {
// 				console.log(err);
// 			}
// 		}
// 	}

// 	setTokenSaled = async () => {
// 		if (typeof window.ethereum !== 'undefined') {
// 			const provider = new ethers.providers.Web3Provider(window.ethereum);
// 			const contract = new ethers.Contract(this.props.address, Contract.abi, provider.getSigner());
// 			try {
// 				await contract.setTokenSale(this.state.item.edition);
// 			} catch (err) {
// 				console.log(err);
// 			}
// 		}
// 	}

// 	pressBuy = () => {
// 		this.props.buyNFT(this.state.item);
// 		this.setTokenSaled();
// 	}

// 	render() {
// 		const show = this.props.show
// 		if (!show)
// 			return null;
// 		return (
// 			<div>
// 				<div className="Modal">
// 					<div className="Modal-content">
// 						<div className="Modal-header">
// 							<span className="Modal-close" onClick={() => this.props.closeModal}>X</span>
// 						</div>
// 						{ this.state.item ?
// 							<div className="Modal-item">
// 								<img className="Modal-img" src={this.state.item.image} alt={this.state.item.edition} />
// 								<div className="Modal-item-info">
// 									<text>Name: {this.state.item.name}</text>
// 									<text>Attribute:</text>
// 									{this.state.item.attributes.map((element) => {
// 										return <text>  - {element.trait_type} : {element.value}</text>
// 									})}
// 									{this.isTokenSaled() && <button className="Modal-buy-btn" onClick={() => this.props.buyNFT(this.state.item)}>Buy Now this NFT</button>}
// 								</div>
// 							</div>
// 							:
// 							<div className="Modal-loading">

// 							</div>
// 						}
// 					</div>
// 				</div>
// 			</div>
// 		)
// 	}
// }