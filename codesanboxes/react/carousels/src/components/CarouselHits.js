import React from "react";

export default function CarouselHits({hits}) {
    return (
        <div className="flex flex-row">
            {hits.map(hit => (
                <div className="p-6 basis-1/4 rounded-xl shadow-xl" key={hit.objectID}>
                    <img  src={hit.poster} />
                    <p className="text-2xl">{hit.title}</p>
                </div>
            ))}
        </div>
    )
}