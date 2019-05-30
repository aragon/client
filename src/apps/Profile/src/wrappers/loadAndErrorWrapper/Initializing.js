import React from 'react'
import { AnimationLoading } from '../../assets'

const Initializing = () => (
  <div
    style={{
      marginTop: '40px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <div style={{ textAlign: 'center' }}>
      <AnimationLoading />
    </div>

    <div style={{ marginTop: '13px' }}>Initializing</div>
  </div>
)

export default Initializing
