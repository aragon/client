import React from 'react'

const IconMagnifyingGlass = React.memo(props => {
  return (
    <svg width={16} height={16} fill="none" {...props}>
      <path
        d="M15.757 14.573l-3.944-3.96a6.307 6.307 0 0 0 1.57-4.153C13.382 2.898 10.38 0 6.69 0 3.001 0 0 2.898 0 6.46s3.002 6.46 6.691 6.46a6.784 6.784 0 0 0 3.834-1.169l3.974 3.99c.166.167.39.259.629.259a.885.885 0 0 0 .605-.235.823.823 0 0 0 .024-1.192zM6.69 1.685c2.727 0 4.946 2.142 4.946 4.775 0 2.633-2.219 4.775-4.946 4.775S1.746 9.093 1.746 6.46c0-2.633 2.218-4.775 4.945-4.775z"
        fill="currentColor"
      />
    </svg>
  )
})

export default IconMagnifyingGlass
