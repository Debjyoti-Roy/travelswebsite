import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAwaiting } from '../../Redux/store/adminSlices'

const ManageHotelBooking = () => {
  const dispatch = useDispatch()
  const { awaitingData, loading, error } = useSelector((state) => state.admin)

  useEffect(() => {
    // Call getAwaiting immediately when component mounts
    dispatch(getAwaiting())
    console.log(awaitingData)

    // Set up interval to call getAwaiting every minute (60000ms)
    const interval = setInterval(() => {
      dispatch(getAwaiting())
      console.log(awaitingData)
    }, 60000)

    // Cleanup interval on component unmount
    return () => clearInterval(interval)
  }, [dispatch])

  return (
    <div className='min-h-screen p-6'>
      Hello
    </div>
  )
}

export default ManageHotelBooking