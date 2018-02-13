import React, { Component } from "react";
import PubSub from "pubsub-js";

export default class InputCustomizado extends Component {

    constructor() {
        super();
        this.state = {errorMessage: ""};
    }

    componentDidMount() {
        PubSub.subscribe("erro-validacao", function(topico, erro) {            
            if (erro.field === this.props.name) {
                this.setState({errorMessage: erro.defaultMessage});
            }
        }.bind(this));

        PubSub.subscribe("limpa-erros", function(topico) {
            this.setState({errorMessage: ""});
        }.bind(this));
    }

    render() {
        return (
            <div className="pure-control-group">
                <label htmlFor={this.props.id}>{this.props.label}</label> 
                <input {...this.props} />
                <span className="error"> {this.state.errorMessage}</span>
            </div>
        );
    }
}



