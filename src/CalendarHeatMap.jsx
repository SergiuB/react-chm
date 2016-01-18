import React from 'react';
import d3 from 'd3';
import 'd3-time';
import 'd3-time-format';
import 'd3-scale';

import './CalendarHeatMap.css';

let day = d3.timeFormat("%w"),
    week = d3.timeFormat("%U"),
    month= d3.timeFormat("%b"),
    formatDate = d3.timeFormat("%Y-%m-%d"),
    formatNumber = d3.format(",d"),
    formatPercent = d3.format("+.1%");

let CalendarHeatMap = React.createClass({
  getDefaultProps: function() {
    return {
      tileSize: 11,
      margin: [25,15,15,15]
    };
  },
  render: function() {
    let z = this.props.tileSize,
        m = this.props.margin, // top right bottom left margin
        dataArr = this.props.data,
        firstDate = dataArr[0].date,
        lastDate = dataArr[dataArr.length-1].date,
        weeks = d3.timeWeek.count(firstDate, lastDate),
        w = z * weeks,
        h = z * 7;

    let data = d3.nest()
          .key(function(d) { return d.date; })
          .rollup(function(d) { return +d[0].value; })
          .map(this.props.data);

    let color = d3.scaleQuantile()
            .domain(d3.values(data))
            .range(d3.range(9));

    let days = d3.timeDays(firstDate, d3.timeDay.offset(lastDate)).map(
      d => {
        let rectClass = 'day q' + color(data.get(d)) + "-9";
        return <rect key={d} className={rectClass} width={z} height={z} x={d3.timeWeek.count(firstDate, d) * z} y={day(d) * z}>
          <title>{formatDate(d) + ": " + formatNumber(data.get(d))}</title>
        </rect>;
      }
    );

    let monthPath = t0 => {
      var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
          d0 = +day(t0), w0 = d3.timeWeek.count(firstDate, t0),
          d1 = +day(t1), w1 = d3.timeWeek.count(firstDate, t1);
      return "M" + (w0 + 1) * z + "," + d0 * z
          + "H" + w0 * z + "V" + 7 * z
          + "H" + w1 * z + "V" + (d1 + 1) * z
          + "H" + (w1 + 1) * z + "V" + 0
          + "H" + (w0 + 1) * z + "Z";
    };

    let timeWholeMonths = (startDate, endDate) => {
      let monthArr = d3.timeMonths(startDate, endDate);
      if (+d3.timeMonth.ceil(lastDate) !== +d3.timeDay.offset(lastDate)) {
        monthArr.pop();
      }
      return monthArr;
    };

    let monthPaths = timeWholeMonths(firstDate, lastDate).map(
      d => <path key={d} className='month' d={monthPath(d)}></path>
    );

    let monthLabels = timeWholeMonths(firstDate, lastDate).map(
      d => <text key={d} x={ d3.timeWeek.count(firstDate,d) * z + 2} y={ z * 7 + 12}>{month(d)}</text>
    );

    let years = d3.timeYears(firstDate, lastDate);
    let yearXPos = d => {
      let t0 = Math.max(d, firstDate);
      let t1 = Math.min(d3.timeYear.offset(d), lastDate);
      return (d3.timeWeek.count(t0, t1) / 2 + d3.timeWeek.count(firstDate, d)) * z;
    };
    let yearLabels = years.length
      ? years.map(d => <text key={d} x={yearXPos(d)} y={-4}>{d.getFullYear()}</text>)
      : <text x={yearXPos(firstDate)} y={-4}>{firstDate.getFullYear()}</text>
    ;

    let divStyle = {
      width: w + m[1] + m[3] + "px",
      height: h + m[0] + m[2] + "px",
      display: "inline-block"
    };

    return <div className='year' style={divStyle}>
        <svg className='RdYlGn' height={h + m[0] + m[2]} width={w + m[1] + m[3]}>
          <g transform={"translate(" + m[3] + "," + m[0] + ")"}>
            {days}
            {monthPaths}
            {monthLabels}
            {yearLabels}
          </g>
        </svg>
      </div>;
  }
});

export {CalendarHeatMap};
