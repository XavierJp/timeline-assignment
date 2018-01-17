import * as d3Axis from 'd3-axis';
import * as d3Select from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Time from 'd3-time';

const axisFactory = (domElement, datesBounds, width, height) => {
    const scale = d3Scale.scaleTime()
        .domain(datesBounds)
        .range([5, width-5]);

    const axis = d3Axis.axisBottom(scale);

    axis.tickArguments([d3Time.timeYear.every(1)]);

    const elem = d3Select.select(domElement);

    elem.append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr('id', 'axis')
        .attr("transform", "translate(0,0)")
        .attr("fill", "#111")
        .call(axis);

    return {
        update : (datesBounds) => {
            scale.domain(datesBounds);

            d3Select.select('#axis')
                .call(axis);
        }
    }
}


export default axisFactory;