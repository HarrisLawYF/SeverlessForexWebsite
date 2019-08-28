import React, { Component } from "react";
import logo from './logo.jpg';
import './App.css';
import { bounce, fadeInLeft, fadeInUp } from 'react-animations';
import styled, { keyframes } from "styled-components";
import { API } from "aws-amplify";

const Bounce = styled.div`
  animation: infinite 5s ${keyframes`${bounce}`};
`;
const SlideInLeft = styled.div`
  animation: 5s ${keyframes`${fadeInLeft}`};
`;
const SlideInUp = styled.div`
  animation: 5s ${keyframes`${fadeInUp}`};
`;
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            forex: null,
            eur_usd: 0,
            eur_jpy: 0,
            usd_jpy: 0,
            usd_eur: 0,
            jpy_usd: 0,
            jpy_eur: 0,
            forex_path: [],
            forex_value: []
        };
    }

    async componentDidMount() {
        try {
            const forex_object = await this.getForex();
            forex_object.final_path.map(
                (path, i) =>{

                }
            );
            forex_object.final_path = forex_object.final_path.map(function(path) {
                var path_string="";

                path.map(function(value){
                   if(value == 0){
                       value = "EUR ->"
                   } else if (value == 1){
                       value = "USD ->";
                   } else{
                       value = "JPY ->";
                   }
                   path_string+=value;
                });
                path_string = path_string.substring(0, path_string.length - 3);
                return path_string;
            });
            this.setState({
                forex:forex_object.banks,
                eur_usd: forex_object.edges[0].rate,
                eur_jpy: forex_object.edges[1].rate,
                usd_jpy: forex_object.edges[2].rate,
                usd_eur: forex_object.edges[3].rate,
                jpy_usd: forex_object.edges[4].rate,
                jpy_eur: forex_object.edges[5].rate,
                forex_path: forex_object.final_path,
                forex_value: forex_object.final_value
            });
        } catch (e) {
            alert(e);
        }
    }

    getForex() {
        return API.get("forex", "forex");
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <div className="top-panel">
                        <div className="side-panel">
                            <SlideInLeft>
                                <table>
                                    <tbody>
                                    <tr>
                                        <th>Currency Reference</th>
                                    </tr>
                                    <tr>
                                        <td>1 EUR = {this.state.eur_usd} USD</td>
                                    </tr>
                                    <tr>
                                        <td>1 EUR = {this.state.eur_jpy} JPY</td>
                                    </tr>
                                    <tr>
                                        <td>1 USD = {this.state.usd_jpy} JPY</td>
                                    </tr>
                                    <tr>
                                        <td>1 USD = {this.state.usd_eur} EUR</td>
                                    </tr>
                                    <tr>
                                        <td>1 JPY = {this.state.jpy_usd} USD</td>
                                    </tr>
                                    <tr>
                                        <td>1 JPY = {this.state.jpy_eur} EUR</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </SlideInLeft>
                        </div>
                        <div>
                            <Bounce><img src={logo} className="App-logo" alt="logo"/></Bounce>
                            <p>
                                Let's find the way to maximize your money
                            </p>
                        </div>
                        <div className="side-panel">
                            <p>You can get profit from this arbitrage opportunity money transfer.</p>
                        </div>
                    </div>
                    <div>
                        <SlideInUp>
                            <table>
                                <tbody>
                                <tr>
                                    <th>Maximize your money transfer</th>
                                    <th>Your final money</th>
                                </tr>
                                <tr>
                                    <td className="value-left">{this.state.forex_path!=null&&this.state.forex_path.length>0 ? this.state.forex_path[0]:"N/A"}</td>
                                    <td className="value-right">{this.state.forex_value[0]} EUR</td>
                                </tr>
                                <tr>
                                    <td className="value-left">{this.state.forex_path!=null&&this.state.forex_path.length>0 ? this.state.forex_path[1]:"N/A"}</td>
                                    <td className="value-right">{this.state.forex_value[1]} USD</td>
                                </tr>
                                <tr>
                                    <td className="value-left">{this.state.forex_path!=null&&this.state.forex_path.length>0 ? this.state.forex_path[2]:"N/A"}</td>
                                    <td className="value-right">{this.state.forex_value[2]} JPY</td>
                                </tr>
                                </tbody>
                            </table>
                        </SlideInUp>
                    </div>
                </header>
            </div>
        );
    }
}

export default App;
