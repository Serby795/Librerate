import React from "react";
import { Link, useParams } from "react-router-dom";


const Reader = ({ props }) => {
    console.log(props);
    const { bookId } = useParams();
    return (
      <iframe  
        width="100%" 
        height="875" 
        allow='fullscreen' 
        src={`https://online.flippingbook.com/view/${ bookId }`} 
      />
    );
}
export default Reader;