// import React, { useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   GoogleMap,
//   Polyline,
//   Marker,
//   OverlayViewF,
//   OVERLAY_MOUSE_TARGET,
//   useJsApiLoader,
// } from "@react-google-maps/api";
// import polyline from "@mapbox/polyline";
// import { getAllCars } from "../../Redux/store/adminCarPickupSlice";

// const containerStyle = {
//   width: "100%",
//   height: "100%",
//   minHeight: "500px",
// };

// const FindPickupDriver = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const booking = useSelector((state) => state.driveMode.booking);
//   const {
//     cars,
//     getAllCarsLoading,
//     getAllCarsError,
//   } = useSelector((state) => state.adminCarPickup);

//   const [hoveredCar, setHoveredCar] = useState(null);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_MAPS_KEY,
//   });

//   useEffect(() => {
//     if (booking?.numberOfPeople != null) {
//       dispatch(getAllCars({ capacity: booking.numberOfPeople }));
//     }
//   }, [dispatch, booking?.numberOfPeople]);

//   // Decode booking polyline for route
//   const mapData = useMemo(() => {
//     if (!booking?.encodedPolyline) return null;
//     try {
//       const decoded = polyline.decode(booking.encodedPolyline);
//       const path = decoded.map(([lat, lng]) => ({ lat, lng }));
//       if (path.length === 0) return null;
//       const center = path[Math.floor(path.length / 2)];
//       const startPoint = path[0];
//       const endPoint = path[path.length - 1];
//       return { path, center, startPoint, endPoint };
//     } catch (e) {
//       console.error("Error decoding polyline:", e);
//       return null;
//     }
//   }, [booking?.encodedPolyline]);

//   // Car marker icon – side-view car silhouette
//   const carIcon = useMemo(() => {
//     if (!isLoaded || !window.google?.maps) return null;
//     const { Size, Point } = window.google.maps;
//     return {
//       url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
//         <svg width="36" height="20" viewBox="0 0 36 20" xmlns="http://www.w3.org/2000/svg">
//           <defs>
//             <filter id="carShadow" x="-20%" y="-20%" width="140%" height="140%">
//               <feDropShadow dx="0" dy="1" stdDeviation="0.5" flood-opacity="0.3"/>
//             </filter>
//           </defs>
//           <path d="M4 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm26 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" fill="#1e293b" filter="url(#carShadow)"/>
//           <path d="M8 12h18l2-4H6z" fill="#2563eb"/>
//           <path d="M8 8h18v4H8z" fill="#3b82f6"/>
//           <rect x="10" y="9" width="5" height="3" rx="0.5" fill="#93c5fd"/>
//           <rect x="18" y="9" width="6" height="3" rx="0.5" fill="#93c5fd"/>
//         </svg>
//       `),
//       scaledSize: new Size(36, 20),
//       anchor: new Point(18, 10),
//     };
//   }, [isLoaded]);

//   // Position driver card above the car marker (centered, with gap)
//   const getPixelPositionOffset = (width, height) => ({
//     x: -(width / 2),
//     y: -height - 36,
//   });

//   const startIcon = useMemo(() => {
//     if (!isLoaded || !window.google?.maps) return null;
//     const { Size, Point } = window.google.maps;
//     return {
//       url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
//         <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
//           <circle cx="16" cy="16" r="12" fill="#10b981" stroke="#fff" stroke-width="3"/>
//           <circle cx="16" cy="16" r="6" fill="#fff"/>
//         </svg>
//       `),
//       scaledSize: new Size(32, 32),
//       anchor: new Point(16, 16),
//     };
//   }, [isLoaded]);

//   const endIcon = useMemo(() => {
//     if (!isLoaded || !window.google?.maps) return null;
//     const { Size, Point } = window.google.maps;
//     return {
//       url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
//         <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
//           <circle cx="16" cy="16" r="12" fill="#ef4444" stroke="#fff" stroke-width="3"/>
//           <circle cx="16" cy="16" r="6" fill="#fff"/>
//         </svg>
//       `),
//       scaledSize: new Size(32, 32),
//       anchor: new Point(16, 16),
//     };
//   }, [isLoaded]);

//   const handleAssign = (car) => {
//     // TODO: wire to assign driver API
//     console.log("Assign", car.id, "to booking", booking?.id);
//     setHoveredCar(null);
//   };

//   if (!booking?.id) {
//     return (
//       <div className="min-h-screen p-6 flex items-center justify-center">
//         <p className="text-gray-500">No booking selected. Go back and click “Find Drivers” on a booking.</p>
//         <button
//           type="button"
//           onClick={() => navigate("/admin/carpickupbookings")}
//           className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//         >
//           Back to bookings
//         </button>
//       </div>
//     );
//   }

//   if (!isLoaded) {
//     return (
//       <div className="min-h-screen p-6 flex items-center justify-center">
//         <p className="text-gray-500">Loading map...</p>
//       </div>
//     );
//   }

//   if (!mapData) {
//     return (
//       <div className="min-h-screen p-6 flex items-center justify-center">
//         <p className="text-gray-500">No route data for this booking.</p>
//         <button
//           type="button"
//           onClick={() => navigate("/admin/carpickupbookings")}
//           className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//         >
//           Back to bookings
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-6 flex flex-col gap-4">
//       <div className="flex items-center justify-between">
//         <h1 className="text-xl font-semibold text-gray-800">
//           Find driver · {booking.bookingGroupCode}
//         </h1>
//         <button
//           type="button"
//           onClick={() => navigate("/admin/carpickupbookings")}
//           className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
//         >
//           Back to bookings
//         </button>
//       </div>

//       <div className="rounded-xl overflow-hidden border border-gray-200 shadow relative bg-white">
//         <div className="h-[500px] w-full relative">
//           <GoogleMap
//             mapContainerStyle={containerStyle}
//             center={mapData.center}
//             zoom={10}
//             options={{
//               disableDefaultUI: false,
//               zoomControl: true,
//               streetViewControl: false,
//               mapTypeControl: true,
//             }}
//           >
//             <Polyline
//               path={mapData.path}
//               options={{
//                 strokeColor: "#1a73e8",
//                 strokeWeight: 5,
//                 strokeOpacity: 0.8,
//               }}
//             />
// {startIcon && (
//   <Marker
//     position={mapData.startPoint}
//     icon={startIcon}
//     title={booking.pickUpLocation}
//   />
// )}
//             {endIcon && (
//               <Marker
//                 position={mapData.endPoint}
//                 icon={endIcon}
//                 title={booking.dropOffLocation}
//               />
//             )}
//             {cars?.map((car) => (
//               <Marker
//                 key={car.id}
//                 position={{ lat: car.latitude, lng: car.longitude }}
//                 icon={carIcon}
//                 title={car.carModel}
//                 onMouseOver={() => setHoveredCar(car)}
//                 onMouseOut={() => setHoveredCar(null)}
//               />
//             ))}
//             {/* Driver details card: anchored above the car marker on hover */}
//             {hoveredCar && (
//               <OverlayViewF
//                 position={{
//                   lat: hoveredCar.latitude,
//                   lng: hoveredCar.longitude,
//                 }}
//                 mapPaneName={OVERLAY_MOUSE_TARGET}
//                 getPixelPositionOffset={getPixelPositionOffset}
//                 zIndex={100}
//               >
// <div
//   className="w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-3 pointer-events-auto"
//   onMouseEnter={() => setHoveredCar(hoveredCar)}
//   onMouseLeave={() => setHoveredCar(null)}
//   style={{ minWidth: "14rem" }}
// >
//   <div className="space-y-1.5 text-sm">
//     <p className="font-semibold text-gray-800 truncate" title={hoveredCar.carModel}>
//       {hoveredCar.carModel}
//     </p>
//     <p className="text-gray-600">Plate: {hoveredCar.carPlateNumber}</p>
//     <p className="text-gray-600">Driver: {hoveredCar.driverName}</p>
//     <p className="text-gray-600">Phone: {hoveredCar.driverPhoneNumber}</p>
//     <p className="text-gray-600">
//       AC: {hoveredCar.acAvailable ? "Yes" : "No"}
//     </p>
//   </div>
//   <button
//     type="button"
//     onClick={() => handleAssign(hoveredCar)}
//     className="mt-2.5 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium"
//   >
//     Assign
//   </button>
// </div>
//               </OverlayViewF>
//             )}
//           </GoogleMap>

//           {/* Loading overlay */}
//           {getAllCarsLoading && (
//             <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
//               <p className="text-gray-600 font-medium">Loading available cars...</p>
//             </div>
//           )}
//           {getAllCarsError && (
//             <div className="absolute top-4 left-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm z-10">
//               {getAllCarsError}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FindPickupDriver;
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    GoogleMap,
    Polyline,
    Marker,
    OverlayViewF,
    OVERLAY_MOUSE_TARGET,
    useJsApiLoader,
} from "@react-google-maps/api";
import polyline from "@mapbox/polyline";
import { getAllCars } from "../../Redux/store/adminCarPickupSlice";

const containerStyle = {
    width: "100%",
    height: "100%",
    minHeight: "500px",
};

const FindPickupDriver = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const booking = useSelector((state) => state.driveMode.booking);
    const {
        cars,
        getAllCarsLoading,
        getAllCarsError,
    } = useSelector((state) => state.adminCarPickup);

    const [activeCar, setActiveCar] = useState(null);
    const [isOverlayHovered, setIsOverlayHovered] = useState(false);

    //AssignCar
    const [clickedCar, setClickedCar] = useState({})
    const [showCar, setShowCar] = useState(false)

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_MAPS_KEY,
    });

    useEffect(() => {
        if (booking?.numberOfPeople != null) {
            dispatch(getAllCars({ capacity: booking.numberOfPeople }));
        }
    }, [dispatch, booking?.numberOfPeople]);

    // ===== Decode polyline =====
    const mapData = useMemo(() => {
        if (!booking?.encodedPolyline) return null;
        try {
            const decoded = polyline.decode(booking.encodedPolyline);
            const path = decoded.map(([lat, lng]) => ({ lat, lng }));
            if (!path.length) return null;
            return {
                path,
                center: path[Math.floor(path.length / 2)],
                startPoint: path[0],
                endPoint: path[path.length - 1],
            };
        } catch {
            return null;
        }
    }, [booking?.encodedPolyline]);

    // ===== Car Icon (top-down) =====
    const carIcon = useMemo(() => {
        if (!isLoaded || !window.google?.maps) return null;
        const { Size, Point } = window.google.maps;

        return {
            url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
          <svg width="40" height="60" viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.35"/>
              </filter>
            </defs>
            <rect x="8" y="4" width="24" height="52" rx="10" fill="#2563eb" filter="url(#shadow)"/>
            <rect x="12" y="10" width="16" height="14" rx="3" fill="#93c5fd"/>
            <rect x="12" y="30" width="16" height="18" rx="3" fill="#1e3a8a"/>
            <circle cx="10" cy="14" r="3" fill="#111827"/>
            <circle cx="30" cy="14" r="3" fill="#111827"/>
            <circle cx="10" cy="44" r="3" fill="#111827"/>
            <circle cx="30" cy="44" r="3" fill="#111827"/>
          </svg>
        `),
            scaledSize: new Size(28, 42),
            anchor: new Point(14, 42),
        };
    }, [isLoaded]);

    const startIcon = useMemo(() => {
        if (!isLoaded || !window.google?.maps) return null;
        const { Size, Point } = window.google.maps;
        return {
            url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#10b981" stroke="#fff" stroke-width="3"/>
              <circle cx="16" cy="16" r="6" fill="#fff"/>
            </svg>
          `),
            scaledSize: new Size(32, 32),
            anchor: new Point(16, 16),
        };
    }, [isLoaded]);

    const endIcon = useMemo(() => {
        if (!isLoaded || !window.google?.maps) return null;
        const { Size, Point } = window.google.maps;
        return {
            url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#ef4444" stroke="#fff" stroke-width="3"/>
              <circle cx="16" cy="16" r="6" fill="#fff"/>
            </svg>
          `),
            scaledSize: new Size(32, 32),
            anchor: new Point(16, 16),
        };
    }, [isLoaded]);

    const getPixelPositionOffset = (width, height) => ({
        x: -(width / 2),
        y: -height - 36,
    });

    const handleAssign = (car) => {
        console.log("Assign car", car.id, "to booking", booking.id);
        setActiveCar(null);
    };

    if (!booking?.id) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <button
                    onClick={() => navigate("/admin/carpickupbookings")}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                    Back to bookings
                </button>
            </div>
        );
    }

    if (!isLoaded || !mapData) {
        return <div className="min-h-screen flex items-center justify-center">Loading map…</div>;
    }

    return (
        <div className="min-h-screen p-6">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapData.center}
                zoom={10}
            >
                <Polyline path={mapData.path} options={{ strokeColor: "#1a73e8", strokeWeight: 5 }} />

                {startIcon && (
                    <Marker
                        position={mapData.startPoint}
                        icon={startIcon}
                        title={booking.pickUpLocation}
                    />
                )}
                {endIcon && (
                    <Marker
                        position={mapData.endPoint}
                        icon={endIcon}
                        title={booking.dropOffLocation}
                    />
                )}

                {cars?.map((car) => (
                    <Marker
                        key={car.id}
                        position={{ lat: car.latitude, lng: car.longitude }}
                        icon={carIcon}
                        onClick={() => {
                            setShowCar(true)
                            setClickedCar(car)
                        }}
                        onMouseOver={() => setActiveCar(car)}
                        onMouseOut={() =>
                            setTimeout(() => {
                                if (!isOverlayHovered) setActiveCar(null);
                            }, 120)
                        }
                    />
                ))}

                {activeCar && (
                    <OverlayViewF
                        position={{ lat: activeCar.latitude, lng: activeCar.longitude }}
                        mapPaneName={OVERLAY_MOUSE_TARGET}
                        getPixelPositionOffset={getPixelPositionOffset}
                    >
                        {/* <div
                            className="w-64 bg-white rounded-lg shadow-xl border p-3"
                            onMouseEnter={() => setIsOverlayHovered(true)}
                            onMouseLeave={() => {
                                setIsOverlayHovered(false);
                                setActiveCar(null);
                            }}
                        >
                            <p className="font-semibold">{activeCar.carModel}</p>
                            <p>Plate: {activeCar.carPlateNumber}</p>
                            <p>Driver: {activeCar.driverName}</p>
                            <p>Phone: {activeCar.driverPhoneNumber}</p>

                            <button
                                onClick={() => handleAssign(activeCar)}
                                className="mt-3 w-full py-2 bg-blue-500 text-white rounded-lg"
                            >
                                Assign
                            </button>
                        </div> */}
                        <div
                            className="w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-3 pointer-events-auto"
                            onMouseEnter={() => setIsOverlayHovered(true)}
                            onMouseLeave={() => {
                                setIsOverlayHovered(false);
                                setActiveCar(null);
                            }}
                            style={{ minWidth: "14rem" }}
                        >
                            <div className="space-y-1.5 text-sm">
                                <p className="font-semibold text-gray-800 truncate" title={activeCar.carModel}>
                                    {activeCar.carModel}
                                </p>
                                <p className="text-gray-600">Plate: {activeCar.carPlateNumber}</p>
                                <p className="text-gray-600">Driver: {activeCar.driverName}</p>
                                <p className="text-gray-600">Phone: {activeCar.driverPhoneNumber}</p>
                                <p className="text-gray-600">
                                    AC: {activeCar.acAvailable ? "Yes" : "No"}
                                </p>
                            </div>
                            <div className="text-sm text-center text-gray-500">
                                Click the car to Assign
                            </div>
                        </div>
                    </OverlayViewF>
                )}

                {getAllCarsLoading && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        Loading cars…
                    </div>
                )}

                {getAllCarsError && (
                    <div className="absolute top-4 left-4 bg-red-50 text-red-600 px-3 py-2 rounded-lg">
                        {getAllCarsError}
                    </div>
                )}
            </GoogleMap>
            {showCar && (

                <div style={{ marginTop: '20px' }} className="flex justify-between">
                    <div>
                    <div className="space-y-1.5 text-lg">
                                <p className="font-semibold text-gray-800 truncate" title={clickedCar.carModel}>
                                    {clickedCar.carModel}
                                </p>
                                <p className="text-gray-600">Plate: {clickedCar.carPlateNumber}</p>
                                <p className="text-gray-600">Driver: {clickedCar.driverName}</p>
                                <p className="text-gray-600">Phone: {clickedCar.driverPhoneNumber}</p>
                                <p className="text-gray-600">
                                    AC: {clickedCar.acAvailable ? "Yes" : "No"}
                                </p>
                            </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <button
                            type="button"
                            onClick={() => handleAssign(activeCar)}
                            className="mt-2.5 w-full py-3 px-5 bg-blue-500 hover:bg-blue-600 cursor-pointer text-white rounded-lg text-sm font-medium"
                        >
                            Assign
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowCar(false)
                                setClickedCar({})}}
                            className="mt-2.5 w-full py-3 px-5 bg-orange-500 hover:bg-orange-600 cursor-pointer text-white rounded-lg text-sm font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindPickupDriver;
