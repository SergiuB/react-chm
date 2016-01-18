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

d3.requestCsv("flights-departed.csv", csv =>  {
  let flightData = d3.nest()
      .key(function(d) { return (d.date = parseDate(d.date)).getFullYear(); })
      .map(csv);

  var years = flightData.keys().map((year) =>
    <CalendarHeatMap
      key={year}
      data={flightData.get(year)}
      margin={[30,30,15,30]}
    />
  );

  ReactDOM.render(
    <div id="body">
      <div id="header">U.S. Commercial Flights 1995-2008</div>
      {years}
    </div>,
    document.getElementById('app')
  );
});
