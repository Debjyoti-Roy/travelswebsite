import React from 'react'
import { packages, places } from './Places'

const PackagesSearch = () => {
  return (
    <div className="package-search-container">
      <h2 className="title">Find Your Package</h2>

      <div className="form-grid">
        {/* Input fields */}
        

        {/* Dropdown for places */}
        <select className="input-field2 first">
          <option value="">Select Location</option>
          {places.map((place, index) => (
            <option key={index} value={place.name}>
              {place.name}
            </option>
          ))}
        </select>

        {/* Dropdown for packages */}
        <select className="input-field2 date">
          <option value="">Select Package</option>
          {packages.map((pkg, index) => (
            <option key={index} value={pkg.name}>
              {pkg.name}
            </option>
          ))}
        </select>
      <button className="search-button">Search</button>
      </div>

    </div>
  )
}

export default PackagesSearch