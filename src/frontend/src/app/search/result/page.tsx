import { ImageResult } from "@/components/search/ImageResult";
import React from "react";

const QueryResultPage = () => {
  // const queryUrl = `http://localhost:8000/uploads/query/${name}`;
  // if (queryUrl.endsWith(".png") || queryUrl.endsWith(".jpg") || queryUrl.endsWith(".jpeg")) {
  //   return(
  //       <div className="w-full p-10 flex flex-col space-y-8">
  //           <ImageResult />
  //       </div>
  //   )
  // }
  return (
    <div className="w-full p-10 flex flex-col space-y-8">
        <ImageResult />
    </div>
  )
};

export default QueryResultPage;
