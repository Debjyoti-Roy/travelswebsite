import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBookingSummary,
  fetchEarningSummary,
  fetchEarningsByMonth,
  fetchRecentBookings,
  fetchTodayCheckins
} from '../../Redux/store/analyticsSlice';
import { BarChart } from '@mui/x-charts/BarChart';
import { FaRegCalendarAlt, FaMoneyBillWave, FaChartBar, FaHistory, FaRegCalendarCheck, FaSearch } from 'react-icons/fa';

const timeRanges = [
  { label: '1 M', value: '1m' },
  { label: '6 M', value: '6m' },
  { label: '1 Y', value: '1y' },
];
const bookingDaysOptions = [
  { label: '15 D', value: 15 },
  { label: '30 D', value: 30 },
];

function getDateRange(range) {
  const to = new Date();
  let from = new Date();
  if (range === '1m') from.setMonth(to.getMonth() - 1);
  else if (range === '6m') from.setMonth(to.getMonth() - 6);
  else if (range === '1y') from.setFullYear(to.getFullYear() - 1);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

const sectionHeader = (icon, label) => (
  <div className="flex items-center gap-2 text-blue-800 font-semibold text-base mb-2">
    {icon}
    <span>{label}</span>
  </div>
);

const HotelAnalytics = ({ hotelList }) => {
  const dispatch = useDispatch();
  const analytics = useSelector((state) => state.analytics);
  const [expanded, setExpanded] = useState(null);
  const [bookingRange, setBookingRange] = useState({});
  const [earningRange, setEarningRange] = useState({});
  const [recentDays, setRecentDays] = useState({});

  const handleExpand = (hotel) => {
    if (expanded === hotel.id) {
      setExpanded(null);
      return;
    }
    setExpanded(hotel.id);
    // Default ranges
    const bookingR = bookingRange[hotel.id] || '1m';
    const earningR = earningRange[hotel.id] || '1m';
    const recentD = recentDays[hotel.id] || 15;
    // Booking Summary
    const { from: bFrom, to: bTo } = getDateRange(bookingR);
    dispatch(fetchBookingSummary({ token: localStorage.getItem('token'), id: hotel.id, from: bFrom, to: bTo }));
    // Earning Summary
    const { from: eFrom, to: eTo } = getDateRange(earningR);
    dispatch(fetchEarningSummary({ token: localStorage.getItem('token'), id: hotel.id, from: eFrom, to: eTo }));
    // Earnings by Month
    dispatch(fetchEarningsByMonth({ token: localStorage.getItem('token'), id: hotel.id, year: new Date().getFullYear() }));
    // Recent Bookings
    dispatch(fetchRecentBookings({ token: localStorage.getItem('token'), id: hotel.id, days: recentD }));
    // Today's Check-ins (use fixed date for testing)
    dispatch(fetchTodayCheckins({ token: localStorage.getItem('token'), id: hotel.id, date: '2025-07-28' }));
  };

  const handleBookingRange = (hotelId, value) => {
    setBookingRange((prev) => ({ ...prev, [hotelId]: value }));
    const { from, to } = getDateRange(value);
    dispatch(fetchBookingSummary({ token: localStorage.getItem('token'), id: hotelId, from, to }));
  };
  const handleEarningRange = (hotelId, value) => {
    setEarningRange((prev) => ({ ...prev, [hotelId]: value }));
    const { from, to } = getDateRange(value);
    dispatch(fetchEarningSummary({ token: localStorage.getItem('token'), id: hotelId, from, to }));
  };
  const handleRecentDays = (hotelId, value) => {
    setRecentDays((prev) => ({ ...prev, [hotelId]: value }));
    dispatch(fetchRecentBookings({ token: localStorage.getItem('token'), id: hotelId, days: value }));
  };

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return (
    <div className="flex flex-col gap-8">
        <div className="flex justify-center gap-5">
            <input type="text" placeholder='Search Booking details by Booking ID' className='border rounded px-2 py-1 text-sm bg-white w-full px-4 py-2' />
            <button className='px-2 py-1 bg-[#5dacf2] rounded'>
                <FaSearch className='text-white' />
            </button>
        </div>
      {hotelList && hotelList.length > 0 ? hotelList.map((hotel) => (
        <div
          key={hotel.id}
          style={expanded === hotel.id ? { marginBottom: '5vh' } : {}}
          className={`transition-all duration-300 bg-white rounded-2xl shadow-lg p-8 flex flex-col items-start border border-gray-200 w-full hover:shadow-2xl ${expanded === hotel.id ? 'ring-2 ring-blue-200 scale-[1.01]' : ''}`}
        >
          <div className="flex w-full justify-between items-center cursor-pointer" onClick={() => handleExpand(hotel)}>
            <div className={`${expanded === hotel.id ? 'pb-2' : ''}`}>
              <h3 className="text-xl font-bold mb-1 text-blue-900">{hotel.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{hotel.address}</p>
              <div className="text-xs text-gray-500 mb-1">
                {hotel.location?.city}, {hotel.location?.state}
              </div>
            </div>
            <div className={`transition-transform duration-200 text-blue-600 font-bold text-2xl ${expanded === hotel.id ? 'rotate-90' : ''}`}>{expanded === hotel.id ? <span>&#8722;</span> : <span>&#43;</span>}</div>
          </div>
          {expanded === hotel.id && (
            <div className="w-full mt-6 border-t border-gray-200 pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Booking Summary */}
              <div className="bg-blue-50 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  {sectionHeader(<FaRegCalendarAlt className="text-blue-700" />, 'Booking Summary')}
                  <select
                    className="border rounded px-2 py-1 text-sm bg-white w-[20%]"
                    value={bookingRange[hotel.id] || '1m'}
                    onChange={e => handleBookingRange(hotel.id, e.target.value)}
                  >
                    {timeRanges.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                {analytics.loading && !analytics.bookingSummary ? (
                  <div className="text-center py-4">Loading...</div>
                ) : analytics.bookingSummary ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded p-3 text-center border border-blue-100">
                      <div className="text-xs text-gray-500">Total Bookings</div>
                      <div className="font-bold text-lg text-blue-700">{analytics.bookingSummary.totalBookings}</div>
                    </div>
                    <div className="bg-white rounded p-3 text-center border border-green-100">
                      <div className="text-xs text-gray-500">Confirmed</div>
                      <div className="font-bold text-lg text-green-700">{analytics.bookingSummary.confirmedBookings}</div>
                    </div>
                    <div className="bg-white rounded p-3 text-center border border-red-100">
                      <div className="text-xs text-gray-500">Cancelled</div>
                      <div className="font-bold text-lg text-red-600">{analytics.bookingSummary.cancelledBookings}</div>
                    </div>
                    <div className="bg-white rounded p-3 text-center border border-yellow-100">
                      <div className="text-xs text-gray-500">Occupancy Rate</div>
                      <div className="font-bold text-lg text-yellow-700">{analytics.bookingSummary.occupancyRate?.toFixed(2)}</div>
                    </div>
                  </div>
                ) : analytics.error ? (
                  <div className="text-red-500">{analytics.error}</div>
                ) : null}
              </div>

              {/* Earning Summary */}
              <div className="bg-green-50 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  {sectionHeader(<FaMoneyBillWave className="text-green-700" />, 'Earning Summary')}
                  <select
                    className="border rounded px-2 py-1 text-sm bg-white w-[20%]"
                    value={earningRange[hotel.id] || '1m'}
                    onChange={e => handleEarningRange(hotel.id, e.target.value)}
                  >
                    {timeRanges.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                {analytics.loading && !analytics.earningSummary ? (
                  <div className="text-center py-4">Loading...</div>
                ) : analytics.earningSummary ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded p-3 text-center border border-blue-100">
                      <div className="text-xs text-gray-500">Total Income</div>
                      <div className="font-bold text-lg text-blue-700">₹{analytics.earningSummary.totalIncome}</div>
                    </div>
                    <div className="bg-white rounded p-3 text-center border border-red-100">
                      <div className="text-xs text-gray-500">Total Refund</div>
                      <div className="font-bold text-lg text-red-600">₹{analytics.earningSummary.totalRefund}</div>
                    </div>
                    <div className="bg-white rounded p-3 text-center border border-yellow-100">
                      <div className="text-xs text-gray-500">Processed Refund</div>
                      <div className="font-bold text-lg text-yellow-700">₹{analytics.earningSummary.processedRefund}</div>
                    </div>
                    <div className="bg-white rounded p-3 text-center border border-green-100">
                      <div className="text-xs text-gray-500">Net Earnings</div>
                      <div className="font-bold text-lg text-green-700">₹{analytics.earningSummary.netEarnings}</div>
                    </div>
                  </div>
                ) : analytics.error ? (
                  <div className="text-red-500">{analytics.error}</div>
                ) : null}
              </div>

              {/* Earnings by Month (Bar Graph) */}
              <div className="bg-indigo-50 rounded-xl p-5 shadow-sm col-span-1 md:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  {sectionHeader(<FaChartBar className="text-indigo-700" />, `Earnings by Month (${new Date().getFullYear()})`)}
                </div>
                {analytics.loading && !analytics.earningsByMonth ? (
                  <div className="text-center py-4">Loading...</div>
                ) : analytics.earningsByMonth && analytics.earningsByMonth.length > 0 ? (
                  <div className="w-full h-72">
                    <BarChart
                      xAxis={[{
                        dataKey: 'month',
                        label: 'Month',
                        valueFormatter: (m) => months[(m - 1) % 12],
                        // Hide axis line and ticks
                        axisLine: false,
                        tickLine: false,
                      }]}
                      // Hide yAxis
                      yAxis={[]}
                      series={[
                        { dataKey: 'netEarnings', label: 'Net Earnings', color: '#2563eb' },
                        { dataKey: 'refundAmounts', label: 'Refunds', color: '#f59e42' },
                      ]}
                      dataset={analytics.earningsByMonth}
                      height={260}
                      margin={{ top: 16, right: 24, left: 8, bottom: 24 }}
                      grid={{ horizontal: true, vertical: false }}
                    />
                  </div>
                ) : (
                  <div className="text-gray-500">No earnings data for this year.</div>
                )}
              </div>

              {/* Recent Bookings */}
              <div className="bg-yellow-50 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  {sectionHeader(<FaHistory className="text-yellow-700" />, 'Recent Bookings')}
                  <select
                    className="border rounded px-2 py-1 text-sm bg-white w-[23%]    "
                    value={recentDays[hotel.id] || 15}
                    onChange={e => handleRecentDays(hotel.id, Number(e.target.value))}
                  >
                    {bookingDaysOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                {analytics.loading && !analytics.recentBookings ? (
                  <div className="text-center py-4">Loading...</div>
                ) : analytics.recentBookings && analytics.recentBookings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2">Booking Code</th>
                          <th className="p-2">Guest</th>
                          <th className="p-2">Check-in</th>
                          <th className="p-2">Check-out</th>
                          <th className="p-2">Rooms</th>
                          <th className="p-2">Amount</th>
                          <th className="p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.recentBookings?.map((b, idx) => (
                          <tr key={idx} className="border-b">
                            <td className="p-2">{b.bookingGroupCode}</td>
                            <td className="p-2">{b.guestName}</td>
                            <td className="p-2">{b.checkIn}</td>
                            <td className="p-2">{b.checkOut}</td>
                            <td className="p-2">{b.totalRooms}</td>
                            <td className="p-2">₹{b.amount}</td>
                            <td className="p-2">{b.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : analytics.recentBookings && analytics.recentBookings.length === 0 ? (
                  <div className="text-gray-500">No recent bookings.</div>
                ) : analytics.error ? (
                  <div className="text-red-500">{analytics.error}</div>
                ) : null}
              </div>

              {/* Today's Check-ins */}
              <div className="bg-pink-50 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  {sectionHeader(<FaRegCalendarCheck className="text-pink-600" />, "Today's Check-ins")}
                </div>
                {analytics.loading && !analytics.todayCheckins ? (
                  <div className="text-center py-4">Loading...</div>
                ) : analytics.todayCheckins && analytics.todayCheckins.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2">Booking Code</th>
                          <th className="p-2">Guest</th>
                          <th className="p-2">Check-in</th>
                          <th className="p-2">Check-out</th>
                          <th className="p-2">Rooms</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.todayCheckins?.map((b, idx) => (
                          <tr key={idx} className="border-b">
                            <td className="p-2">{b.bookingGroupCode}</td>
                            <td className="p-2">{b.guestName}</td>
                            <td className="p-2">{b.checkIn}</td>
                            <td className="p-2">{b.checkOut}</td>
                            <td className="p-2">{Object.entries(b.rooms).map(([room, count]) => `${room}: ${count}`).join(', ')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : analytics.todayCheckins && analytics.todayCheckins.length === 0 ? (
                  <div className="text-gray-500">No check-in for today.</div>
                ) : analytics.error ? (
                  <div className="text-red-500">{analytics.error}</div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      )) : (
        <div className="text-center text-gray-500">No hotels found.</div>
      )}
    </div>
  );
};

export default HotelAnalytics;