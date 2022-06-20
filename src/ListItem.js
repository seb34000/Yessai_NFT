import { Component } from 'react';

export default class ListItem {
    constructor(props) {
        this.state = {
            array: props.array
        }
    }

    render() {
        return (
            <div>
                {this.state.array.map((item, index) => (
                    <div key={index}>
                        {item}
                    </div>
                ))}
            </div>
        )
    }

}