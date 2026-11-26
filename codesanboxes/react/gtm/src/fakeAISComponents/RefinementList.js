export default function RefinementList() {
  return (
    <div className="ais-RefinementList">
      <ul className="ais-RefinementList-list">
        {[...Array(10)].map((_, i) => (
          <li className="ais-RefinementList-item" key={i}>
            <div>
              <label className="ais-RefinementList-label">
                <input
                  type="checkbox"
                  className="ais-RefinementList-checkbox"
                />
                <span className="ais-RefinementList-labelText">
                  Value&nbsp;
                </span>
                <span className="ais-RefinementList-count">1</span>
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
