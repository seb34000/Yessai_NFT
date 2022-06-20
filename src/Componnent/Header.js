import React, { Component } from "react";
import { Link, Element } from 'react-scroll';
import "../Style/Header.css"

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: this.props.account,
            loaded: false,
        };
    }

    componentDidUpdate = () => {
        if (this.state.account !== this.props.account) {
            this.setState({
                account: this.props.account,
            })
        }
    }

    render() {
        return (
          <div className="Header">
				<div className="Header-network">
					<text>{this.state.account ? this.state.account : 'Not connected'}</text>
				</div>
				<h2>Yessai</h2>
				<div className='Header-nav'>
					<Link activeClass='active' to='roadmap' spy={true} smooth={true} onMouseEnter>roadmap</Link>
					<Link activeClass='active' to='shop' spy={true} smooth={true}>shop</Link>
					{/* <Link activeClass='active' to='whitelist' spy={true} smooth={true}>get whitelist</Link> */}
				</div>
			</div>
        )
    }
}