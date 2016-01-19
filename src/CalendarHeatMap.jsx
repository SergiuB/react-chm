import React from 'react';
import {
  format, timeFormat, timeParse,
  timeDay, timeDays, timeWeek, timeMonths, timeMonth, timeYears, timeYear,
  values, scaleQuantile, range, nest} from 'd3';

import './CalendarHeatMap.css'; 

let day = timeFormat("%w"),
    week = timeFormat("%U"),
    month= timeFormat("%b"),
    formatDate = timeFormat("%Y-%m-%d"),
    formatNumber = format(",.2f"),
    formatPercent = format("+.1%");

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
        weeks = timeWeek.count(firstDate, lastDate),
        w = z * (weeks+1),
        h = z * 7;

    let data = nest()
          .key(function(d) { return d.date; })
          .rollup(function(d) { return +d[0].value; })
          .map(this.props.data);

    let domain = this.props.domainFn ? this.props.domainFn() : values(data);
    let color = scaleQuantile()
            .domain(domain)
            .range(range(9));

    let days = timeDays(firstDate, timeDay.offset(lastDate)).map(
      d => {
        let rectClass = 'day q' + color(data.get(d)) + "-9";
        return <rect key={d} className={rectClass} width={z} height={z} x={timeWeek.count(firstDate, d) * z} y={day(d) * z}>
          <title>{formatDate(d) + ": " + formatNumber(data.get(d))}</title>
        </rect>;
      }
    );

    let monthPath = t0 => {
      var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
          d0 = +day(t0), w0 = timeWeek.count(firstDate, t0),
          d1 = +day(t1), w1 = timeWeek.count(firstDate, t1);
      return "M" + (w0 + 1) * z + "," + d0 * z
          + "H" + w0 * z + "V" + 7 * z
          + "H" + w1 * z + "V" + (d1 + 1) * z
          + "H" + (w1 + 1) * z + "V" + 0
          + "H" + (w0 + 1) * z + "Z";
    };

    let timeWholeMonths = (startDate, endDate) => {
      let monthArr = timeMonths(startDate, endDate);
      if (+timeMonth.ceil(lastDate) !== +timeDay.offset(lastDate)) {
        monthArr.pop();
      }
      return monthArr;
    };

    let monthPaths = timeWholeMonths(firstDate, lastDate).map(
      d => <path key={d} className='month' d={monthPath(d)}></path>
    );

    let timeAllMonths = (startDate, endDate) => {
      let monthArr = timeMonths(startDate, endDate);
      monthArr.unshift(startDate);
      return monthArr;
    };

    let monthLabels = timeAllMonths(firstDate, lastDate).map(
      d => <text key={d} x={ timeWeek.count(firstDate,d) * z + 2} y={ z * 7 + 12}>{month(d)}</text>
    );

    let years = timeYears(firstDate, lastDate);
    years.unshift(firstDate);
    let yearXPos = d => {
      let t0 = Math.max(d, firstDate);
      let t1 = Math.min(timeYear.offset(d), lastDate);
      return (timeWeek.count(t0, t1) / 2 + timeWeek.count(firstDate, d)) * z;
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
            <line className='frame' x1="0" y1="0" x2={ timeWeek.count(firstDate,lastDate) * z + z} y2="0"/>
            <line className='frame' x1="0" y1={z*7} x2={ timeWeek.count(firstDate,lastDate) * z + z} y2={z*7}/>
          </g>
        </svg>
      </div>;
  }
});

export {CalendarHeatMap};
