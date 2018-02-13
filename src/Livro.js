import React, {Component} from "react";
import $ from "jquery";
import InputCustomizado from "./components/InputCustomizado";
import SubmitButton from "./components/SubmitButton";
import PubSub from "pubsub-js";
import TratadorErros from "./TratadorErros";

class FormularioLivro extends Component {

    constructor() {
        super();
        this.state = {lista: []};
        this.enviaForm = this.enviaForm.bind(this);
    }

    enviaForm(e) {
        e.preventDefault();

        $.ajax({
            url: "http://localhost:8080/api/livros",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({titulo: this.state.titulo, preco: this.state.preco, autorId: this.state.autorId}),
            success: function(resposta) {
                PubSub.publish("atualiza-lista-livros", resposta);
                this.setState({titulo: "", preco: "", autorId: ""});
            }.bind(this),
            error: function (resposta) {
                if (resposta.status === 400) {
                    new TratadorErros().publicaErros(resposta.responseJSON);
                }
            },
            beforeSend: function () {
                PubSub.publish("limpa-erros", {});
            }
        })
    }

    setField(nomeInput, e) {
        var field = {};
        field[nomeInput] = e.target.value;
        this.setState(field);
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">                    
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                    <InputCustomizado label="Titulo" id="titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.setField.bind(this, "titulo")} />
                    <InputCustomizado label="Preco" id="preco" type="text" name="preco" value={this.state.preco} onChange={this.setField.bind(this, "preco")} />
                    <div className="pure-control-group">
                        <label htmlFor="autorId">Autor</label>
                        <select value={this.state.autorId} name="autorId" id="autorId" onChange={this.setField.bind(this, "autorId")}>
                            <option value="">Selecione o Autor</option>
                            {
                                this.props.autores.map(function (autor) {
                                    return <option value={autor.id}>{autor.nome}</option>
                                })
                            }
                        </select>
                    </div>                    
                    <SubmitButton />
                </form>             
            </div>  
        )
    }
}

class TabelaLivros extends Component {

    render() {
        return (
            <div>            
                <table className="pure-table">
                  <thead>
                    <tr>
                      <th>Titulo</th>
                      <th>Preço</th>
                      <th>Autor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                        this.props.lista.map(function (livro) {
                            return (
                                <tr key={livro.id}>
                                    <td>{livro.titulo}</td>
                                    <td>{livro.preco}</td>
                                    <td>{livro.autor.nome}</td>
                                </tr>
                            );
                        })
                    }
                  </tbody>
                </table> 
            </div> 
        )
    }

}

export default class LivroBox extends Component {

    constructor() {
        super();
        this.state = {lista: [], autores: []};
    }

    componentDidMount() {
        $.ajax({
          url: "http://localhost:8080/api/livros",
          dataType: "json",
          success: function (resposta) {
            this.setState({lista: resposta});
          }.bind(this)
        });

        $.ajax({
            url: "http://localhost:8080/api/autores",
            dataType: "json",
            success: function (resposta) {
                this.setState({autores: resposta})
            }.bind(this)
        });

        PubSub.subscribe("atualiza-lista-livros", function (topico, novaLista) {
            this.setState({lista: novaLista});
        }.bind(this));
    }

    render() {
        return (
            <div id="main">
                <div className="header">
                    <h1>Cadastro de Livros</h1>
                </div>
                <div className="content" id="content">
                    <FormularioLivro autores={this.state.autores} />
                    <TabelaLivros lista={this.state.lista} />
                </div>
            </div>
        )
    }

}