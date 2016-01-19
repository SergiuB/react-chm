import React from 'react';
import ReactDOM from 'react-dom';

import d3 from 'd3';
import 'd3-time';
import 'd3-time-format';
import 'd3-request';
import 'd3-scale';
import _ from 'lodash';

import './style.css';

import {CalendarHeatMap} from 'react-chm';

var parseDate = d3.timeParse("%Y-%m-%d");
var formatDate = d3.timeFormat("%Y-%m-%d");

let endDate = new Date();
let startDate = d3.timeDay.offset(endDate, -365);

let StockChm = React.createClass({
    getDefaultProps: function () {
      return {
        initialStock: ''
      };
    },
    getInitialState: function () {
      return {stockName: this.props.initialStock, quotes:[]}
    },
    populateForStock: function (stockName) {
      let query = `http://query.yahooapis.com/v1/public/yql?q=select * from   yahoo.finance.historicaldata(0)
               where  symbol    = "${stockName}"
               and    startDate = "${formatDate(startDate)}"
               and    endDate   = "${formatDate(endDate)}"
      &format=json&env=store://datatables.org/alltableswithkeys`
      this.setState({stockName:'...', quotes:[]});
      d3.requestJson(query, (error, json) =>  {
        if (error) {
          this.setState({error})
          return;
        }

        let quotes = _.get(json, 'query.results.quote');
        if (!quotes || !quotes.length) {
            this.setState({stockName, quotes:[]})
            return;
        }
        quotes = quotes.map(qt => ({date: parseDate(qt.Date), value: qt.High}));
        quotes = _.sortBy(quotes, 'date');

        this.setState({stockName, quotes});
      });
    },
    handleClick: function(event) {
      let stockName = this._input.value;
      this.populateForStock(stockName);
    },
    handleKeyUp: function(event) {
      if(event.keyCode == 13){
        this._button.click();
      }
    },
    componentDidMount: function() {
      let stockName = this.state.stockName;
      this.populateForStock(stockName);
    },
    render: function() {
      let content = false;
      if (this.state.error) {
        content = error;
      }
      else if (this.state.stockName === '...') {
        content =
          <div className="spinner">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div>;
      }
      else if (this.state.quotes.length) {
        content =
          <div>
            <CalendarHeatMap
              data={this.state.quotes}
              margin={[20,0,15,0]}
              domainFn={()=>this.state.quotes.map(qt=>qt.value)}
            />
          </div>
      }
      return (
        <div className='stockChm'>
          <div className='stockInput'>
            <p style={{display: 'inline'}}>Stock symbol: </p>
            <input type='text'
              ref={(c) => this._input = c}
              defaultValue={this.state.stockName}
              onKeyUp={this.handleKeyUp}
            />
            <button
              ref={(c) => this._button = c}
              onClick={this.handleClick}>
              Show
            </button>
          </div>
          {content}
        </div>
      );
    }
});

ReactDOM.render(
  <div id="app">
    <div id="header">Stock prices in the last 365 days</div>
    <StockChm initialStock='GOOG'/>
    <StockChm initialStock='AAPL'/>
  </div>,
  document.getElementById('app')
);
