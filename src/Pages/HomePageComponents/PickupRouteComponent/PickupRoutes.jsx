import React, { useEffect } from 'react'

const PickupRoutes = ({ pickupRoutesDetails }) => {
    useEffect(() => {
      console.log(pickupRoutesDetails)
    }, [pickupRoutesDetails])
    

  return (
    <div>PickupRoutes</div>
  )
}

export default PickupRoutes