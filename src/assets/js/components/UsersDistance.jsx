import React from 'react';
import { hot } from 'react-hot-loader';

function UsersDistance(props) {
  const clat = parseFloat(props.serverData.cuserlat) * Number("110574");
  const clong = Math.cos(parseFloat(props.serverData.cuserlong)) * Number("111320");
  const olat = parseFloat(props.serverData.ouserlat) * Number("110574");
  const olong =  Math.cos(parseFloat(props.serverData.ouserlong)) * Number("111320");


  const distance = (Math.pow(Math.pow(clat-olat,2) + Math.pow(clong-olong,2),0.5)).toString()
    return (
      <div className="distance">
        <p>The distance with the seller is: { distance.split(".")[0] } Km</p>
      </div>
    );
};

export default hot(module)(UsersDistance);
