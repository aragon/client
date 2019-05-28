import React from 'react'
import { AnimationLoading } from '../../assets/'

const Initializing = () => (
  <div
    style={{
      marginTop: '3rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <div style={{ textAlign: 'center' }}>
      <AnimationLoading />
    </div>

    <div style={{ marginTop: '1rem' }}>Initializing</div>
  </div>
)

export default Initializing
