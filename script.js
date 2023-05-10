// Variables and functions
// 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'

const dataURL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
const svg  = d3.select('svg')

const drawCanvas = (height, width)=>{
    svg.attr('width', width)
    svg.attr('height', height)
}

const generateScale = (values, padding, height, width)=>{
    const xScale = d3.scaleLinear()
                    .domain([d3.min(values, (item)=>{return item['Year']}) -1, d3.max(values, (item)=>{ return item['Year']})+1])
                    .range([padding, width - padding])
    const yScale = d3.scaleTime()
                    .domain([d3.min(values, (item)=>{return new Date(item['Seconds']*1000)}), d3.max(values, (item)=>{return new Date(item['Seconds']*1000)})])
                    .range([padding, height - padding])
    return {xScale, yScale}
}

const drawPoints = ( values, xScale, yScale )=>{
    const tooltip = d3.select('body')
                    .append('div')
                    .attr('id', 'tooltip')
                    .style('visibility', 'hidden')
                    .style('width', 'auto')
                    .style('height', 'auto')
    svg.selectAll('circle')
        .data(values)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('r', 10)
        .attr('data-xvalue', (item) => {
            return item['Year']
        })
        .attr('data-yvalue', (item) => {
            return new Date(item['Seconds'] * 1000)
        })
        .attr('cx', (item) => {
            return xScale(item['Year'])
        })         
        .attr('cy', (item) => {
            return yScale(new Date(item['Seconds'] * 1000))
        })
        .attr('fill', (item) => {
            if(item['URL'] === ""){
                return 'hsla(123,97%,61%,0.5)'
            }else{
                return 'hsla(302,93%,69%,0.75)'
            }
        })
        .on('mouseover', (d, index) => {
            const xposition = -380 +Number(xScale(index['Year']))
            const yposition = -280 +Number(yScale(new Date(index['Seconds'] * 1000)))
            tooltip.transition().style('visibility', 'visible')
            if(index['Doping']!==''){
                tooltip.text(index['Name']+': '+index['Nationality']+'\n'+'Year: '+index['Year']+', Time: '+index['Time']+'\n' + index['Doping'])
            }else{
                tooltip.text(index['Name']+': '+index['Nationality']+'\n'+'Year: '+index['Year']+', Time: '+index['Time'])
            }
            tooltip.attr('data-year', index['Year'])
            tooltip.style('translate', `${xposition}px ${yposition}px`);
        })
        .on('mouseout', (item) => {
            tooltip.transition()
                .style('visibility', 'hidden')
        })
}


const generateAxes = ( xScale, yScale, height, padding)=>{
    const xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.format('d'))
    const yAxis = d3.axisLeft(yScale)
                .tickFormat(d3.timeFormat('%M:%S'))
    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (height-padding) + ')')
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)')
}

const getData = async()=>{
    try {
        const response = await fetch(dataURL)
        const json = await response.json()
        const result = json
        const values = result
        return {values}
    } catch (error) {
        throw new Error(e)        
    }
}

const Scatterplot = async()=>{
try {
    const {values} = await getData()
    const width = 900
    const height = 560
    const padding = 80
    drawCanvas(height, width)
    const {xScale, yScale} = generateScale(values, padding, height, width)
    drawPoints ( values, xScale, yScale )
    generateAxes(xScale, yScale, height, padding)
} catch (error) {
    throw new Error(error)     
}
}

Scatterplot()