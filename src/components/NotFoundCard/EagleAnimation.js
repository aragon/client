import React from 'react'
import styled from 'styled-components'
import { TweenLite } from 'gsap/TweenMax'

export default class EagleAnimation extends React.Component {
  componentDidMount() {
    window.addEventListener('mousemove', this.onMouseMove)
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMouseMove)
  }

  onMouseMove = event => {
    const svg = document.querySelector('#svg')

    const mouse = svg.createSVGPoint()
    const leftEye = this.createEye('#left-eye')
    const rightEye = this.createEye('#right-eye')

    mouse.x = event.clientX
    mouse.y = event.clientY
    requestAnimationFrame(function() {
      const point = mouse.matrixTransform(svg.getScreenCTM().inverse())
      leftEye.rotateTo(point)
      rightEye.rotateTo(point)
    })
  }

  createEye = selector => {
    const element = document.querySelector(selector)

    TweenLite.set(element, {
      transformOrigin: 'center',
    })

    const bbox = element.getBBox()
    const centerX = bbox.x + bbox.width / 2
    const centerY = bbox.y + bbox.height / 2

    function rotateTo(point) {
      const dx = point.x - centerX
      const dy = point.y - centerY

      const angle = Math.atan2(dy, dx)

      TweenLite.to(element, 0.3, {
        rotation: angle + '_rad_short',
      })
    }

    return {
      element: element,
      rotateTo: rotateTo,
    }
  }

  render() {
    return (
      <SvgWrapper>
        <div id="tweenMaxScript" />
        <Svg id="svg" viewBox="0 0 300 300">
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

          <g id="left-eye">
            <OuterCircle cx="30" cy="55" r="20" />
            <InnerCircle cx="32" cy="65" r="6" />
          </g>

          <g id="right-eye">
            <OuterCircle cx="76" cy="55" r="20" />
            <InnerCircle cx="82" cy="65" r="6" />
          </g>
        </Svg>
      </SvgWrapper>
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

const OuterCircle = styled.circle`
  fill: #fff;
`

const InnerCircle = styled.circle`
  fill: #000;
`
