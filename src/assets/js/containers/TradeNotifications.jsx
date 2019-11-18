import React, { Component } from 'react';
import tradesServices from '../services/trades';
import TradeComponent from '../components/Trades';

export default class Trade extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            trades: [],
            allTrades: [],
            userBool: props.serverData.currentuserbool,
            currentUserCategory: props.serverData.currentusercategory,
            currentUserId: props.serverData.currentuserid,
        }
        this.getFilteredTrades = this.getFilteredTrades.bind(this);
    }

    componentDidMount(){
        this.getFilteredTrades();
    }

    async getFilteredTrades() {
        this.setState({ loading: true });
        const trades = await tradesServices.getTrades();
        this.setState({ allTrades: trades });
        this.setState({ trades: trades, loading: false });
    }

    render(){
        if (this.state.loading) {
            return <p>Loading... </p>
        } else if (this.state.allTrades.length === 0){
            return <p>No results</p>
        }
        const { trades } = this.state;
        const { userBool } = this.state;
        const {currentUserId} = this.state;
        const {currentUserCategory} = this.state;
        return(
            <div className="tradeContainer">
                {trades.map((x) => <TradeComponent
                    id={x.id.toString()}
                    tradeReceiverName={x.tradeReceiverName}
                    tradeReceiverId={x.tradeReceiverId.toString()}
                    tradeMakerName={x.tradeMakerName}
                    tradeMakerId={x.tradeMakerId.toString()}
                    objectRequestedName={x.objectRequestedName}
                    objectOfferedName={x.objectOfferedName}
                    createdAt={x.createdAt}
                    chatExist={x.chatExist}
                    userBool={userBool}
                    currentUserId={currentUserId}
                    currentUserCategory={currentUserCategory} />)}
            </div>
        );
    }
}