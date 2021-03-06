# react-chm
Calendar heat map component based on React and D3 inspired by [the original calendar heatmap](http://bl.ocks.org/mbostock/4063318) created by [Mike Bostock](http://bost.ocks.org/mike/).

The `CalendarHeatMap` component uses exclusively React for DOM manipulation. From the awesome D3 only the `time` and `scale` libraries are used, not the `select` API for which D3 is so well known. In other words, React does the rendering, and D3 does the computations.

Checkout this [sample application](http://sergiub.github.io/react-chm/)

Currently the `CalendarHeatMap` component cannot be customized too much (work in progress).
If anyone is interested in using it and needs a certain feature, just ask.
