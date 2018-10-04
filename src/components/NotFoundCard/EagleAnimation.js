import React from 'react'
import styled from 'styled-components'
import { Spring, animated } from 'react-spring'
import { springs } from '@aragon/ui'
import throttle from  'lodash.throttle'

export default class EagleAnimation extends React.Component {
  state = {
    leftEyeAngle: 0,
    rightEyeAngle: 0,
  }
  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', this.onMouseMove)
    }
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('mousemove', this.onMouseMove)
    }
  }

  onMouseMove = throttle(event => {
    const svg = this.svgElement
    const mouse = svg.createSVGPoint()

    const leftEyeAngle = this.createEye(this.leftEye);
    const rightEyeAngle = this.createEye(this.rightEye);

    mouse.x = event.clientX
    mouse.y = event.clientY
    const point = mouse.matrixTransform(svg.getScreenCTM().inverse())
    this.setState({
      leftEyeAngle: leftEyeAngle(point),
      rightEyeAngle: rightEyeAngle(point),
    })
  }, 100)

  handleSvgRef = element => {
    this.svgElement = element
  }
  handleLeftEyeRef = element => {
    this.leftEye = element
  }
  handleRightEyeRef = element => {
    this.rightEye = element
  }
  createEye = element => {

    const bbox = element.getBBox()
    const centerX = bbox.x + bbox.width / 2
    const centerY = bbox.y + bbox.height / 2

    return (point) => {
      const dx = point.x - centerX
      const dy = point.y - centerY

      return Math.atan2(dy, dx)/ Math.PI * 180 + 180
    }
  }

  render() {
    const { leftEyeAngle, rightEyeAngle } = this.state
    return (
      <Spring
        to={{ leftEyeAngle, rightEyeAngle }}
      >
        {({ leftEyeAngle, rightEyeAngle }) => (
          <SvgWrapper>
            <Svg innerRef={this.handleSvgRef} viewBox="0 0 300 300">
              <defs>
                <linearGradient x1="100%" y1="0%" x2="24%" y2="100%" id="a">
                  <stop stopColor="#00EAE5" offset="0%" />
                  <stop stopColor="#02B5E4" offset="100%" />
                </linearGradient>
                <linearGradient x1="100%" y1="0%" x2="-3%" y2="100%" id="b">
                  <stop stopColor="#4DF4F0" offset="0%" />
                  <stop stopColor="#1AA8CD" offset="100%" />
                </linearGradient>
              </defs>
              <g fill="none" fillRule="evenodd">
                <path
                  d="M0 51v76c0 17 14 30 30 30h22V21H27c-8 0-15-2-20-8L0 1v50z"
                  fill="url(#a)"
                />

                <path d="M52 96L42 86s1-6 10-6v16z" fill="#F5C268" />
                <path
                  d="M73 157c17 0 30-13 30-30V1s-2 7-7 12c-4 6-12 8-20 8H52v136"
                  fill="url(#b)"
                />

                <path d="M52 96l10-10s-1-6-10-6v16z" fill="#D89144" />
              </g>

              <Eye innerRef={this.handleLeftEyeRef} transform={`rotate(${leftEyeAngle}, 20, 45)`}>
                <OuterCircle cx="30" cy="55" r="20" />
                <InnerCircle cx="32" cy="65" r="6" />
              </Eye>

              <Eye innerRef={this.handleRightEyeRef} transform={`rotate(${rightEyeAngle}, 66, 45)`}>
                <OuterCircle cx="76" cy="55" r="20" />
                <InnerCircle cx="82" cy="65" r="6" />
              </Eye>
            </Svg>
          </SvgWrapper>
        )}
      </Spring>
    )
  }
}

const SvgWrapper = styled.div`
  width: 150px;
  margin-left: 35px;
  top: 0;
`

const Svg = styled.svg`
  width: 140px;
  height: 140px;
`

const Eye = styled(animated.g)`
  transform-origin: 10px 10px;
`

const OuterCircle = styled.circle`
  fill: #fff;
`

const InnerCircle = styled.circle`
  fill: #000;
`
