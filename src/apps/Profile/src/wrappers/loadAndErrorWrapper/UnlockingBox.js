import React from 'react'
import { AnimationLoading } from '../../assets'

const UnlockingBox = () => (
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

    <div style={{ marginTop: '13px' }}>Unlocking box</div>
  </div>
)

export default UnlockingBox
