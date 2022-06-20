import { Component } from "react";
import { ethers } from 'ethers';
import Contract from '../artifacts/contracts/ERC721Markle.sol/ERC721Merkle.json';
import '../Style/Vote.css';


export default class Vote extends Component {
    constructor (props) {
        super(props);
        this.state = {
            account: String(this.props.account).toLowerCase(),
            contract_address: String(this.props.contract_address).toLowerCase(),
            owner: null,
            is_loaded: false,
            question: null,
            value: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount = async () => {
        this.getOwner().finally(() => {
            this.getQuestion().finally(() => {
                this.setState({is_loaded: true});
            })
        })
    }

    componentDidUpdate = () => {
        if (this.state.account !==  this.props.account) {
            this.setState({
                account: this.props.account,
            })
        }
    }

    /* create a function getOwner hwo get the owner adress of contract */
    getOwner = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(this.state.contract_address, Contract.abi, provider.getSigner());
            try {
                let owner = await contract.getOwner();
                this.setState({owner: owner});
                console.log(owner);
            } catch (error) {
                console.error(error);
            }
        }
    }

    /* create a function who call the function getQuestion from contract */
    getQuestion = async () => {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(this.state.contract_address, Contract.abi, provider.getSigner());
            try {
                let question = await contract.getQuestion();
                this.setState({question: question}, () => {
                    console.log('get question: ' + this.state.question);
                });
            } catch (error) {
                console.error(error);
            }
        }
    }

    /* create a function who call the function setQuestion from contract */
    handleSubmit = async (event) => {
        console.log('set question ' + this.state.value); 
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(this.state.contract_address, Contract.abi, provider.getSigner());
            try {
                const fee = await contract.estimateGas.setQuestion(this.state.value.toString());
                console.error(fee);
                let overrides = {
                        value: fee,
                        from: this.state.account[0],
                    }
                let tx = await contract.setQuestion(this.state.question, overrides);
                let receipt = await tx.wait();
                console.log(`Recept: ${receipt}`);
                this.getQuestion();
            } catch (error) {
                alert("error")
                console.error('RECEPT ERRORs');
                console.error(error);
            }
        }
        event.preventDefault();
    }

    handleChange = (e) => {
        this.setState({value: e.target.value});
    }

    is_owner = () => {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <input type="text" value={this.state.value} onChange={this.handleChange}/>
                    </label>
                    <input type="submit"/>
                    {this.state.question}
                </form>
            </div>
        )
    }

    is_not_owner = () => {
        return (
            <div>
                <text>not owner</text>
            </div>
        )
    }

    render () {
        if (!this.state.is_loaded)
            return 
                <div className="vote">

                </div>

        return (
            <div className="vote">
                {String(this.state.owner).toLowerCase() === String(this.state.account).toLowerCase() ? this.is_owner() : this.is_not_owner()}
            </div>
        )
    }
}