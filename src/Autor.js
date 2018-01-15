import React, { Component } from "react";
import $ from "jquery";
import InputCustomizado from "./components/InputCustomizado";
import SubmitButton from "./components/SubmitButton";


export class FormularioAutor extends Component {

    constructor() {
        super();
        this.enviaForm = this.enviaForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
        this.state = {lista: []};
    }

    enviaForm(e) {
        e.preventDefault();
        
        $.ajax({
          url:"http://localhost:8080/api/autores",
          type: "POST",
          contentType: "application/json",
          dataType: "json",
          data: JSON.stringify({nome: this.state.nome, email: this.state.email, senha: this.state.senha}),
          success: function (resposta) {
            this.setState({lista: resposta});
          }.bind(this),
          error: function (resposta) {
            console.log(resposta);
          }
        })
      }
    
      setNome(e) {
        console.log("setNome(" + e.target.value + ")")
        this.setState({nome: e.target.value});
      }
    
      setEmail(e) {
        this.setState({email: e.target.value});
      }
    
      setSenha(e) {
        this.setState({senha: e.target.value});
      }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
            <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                <InputCustomizado label="Nome" id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome} />
                <InputCustomizado label="Email" id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail} />
                <InputCustomizado label="Senha" id="senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha} />                 
                <SubmitButton />
            </form>             

            </div>  
        );
    }
}

export class TabelaAutores extends Component {

    constructor() {
        super();
        this.state = {lista: []};
    }

    componentDidMount() {
        $.ajax({
          url: "http://localhost:8080/api/autores",
          dataType: "json",
          success: function (resposta) {
            this.setState({lista: resposta});
          }.bind(this)
        })
    }


    render() {
        return (
            <div>            
                <table className="pure-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                        this.state.lista.map(function (autor) {
                            return (
                                <tr key={autor.id}>
                                    <td>{autor.nome}</td>
                                    <td>{autor.email}</td>
                                </tr>
                            );
                        })
                    }
                  </tbody>
                </table> 
            </div> 
        );
    }
}