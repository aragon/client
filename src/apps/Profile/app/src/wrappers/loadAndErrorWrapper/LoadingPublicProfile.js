import React from 'react'
import { AnimationLoading } from '../../assets/'

const LoadingPublicProfile = () => (
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

    <div style={{ marginTop: '1rem' }}>Loading public profile</div>
  </div>
)

export default LoadingPublicProfile
