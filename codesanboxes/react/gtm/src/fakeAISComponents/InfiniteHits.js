import Hit from "../components/Hit";

export default function InfiniteHits() {
  return (
    <div className="ais-InfiniteHits">
      <ol className="ais-InfiniteHits-list">
        {[...Array(20)].map((_, i) => (
          <li className="ais-InfiniteHits-item" key={i}>
            <Hit />
          </li>
        ))}
      </ol>
      <button className="ais-InfiniteHits-loadMore">Show more results</button>
    </div>
  );
}
