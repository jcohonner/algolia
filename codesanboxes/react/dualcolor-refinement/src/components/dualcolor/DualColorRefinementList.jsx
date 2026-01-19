import React from "react";
import { useDualColorRefinementList } from "./useDualColorRefinementList";

export function DualColorRefinementList(props) {
  const { items, refine, canRefine } = useDualColorRefinementList(props);



  return (
    <div
      className={cx(
        "ais-DualColorRefinementList",
        !canRefine && "ais-DualColorRefinementList--noRefinement",
      )}
    >
      <ul className="ais-DualColorRefinementList-list">
        {items.map((item) => (
          <li
            key={item.name}
            className={cx(
              "ais-DualColorRefinementList-item",
              item.isExcluded && "ais-DualColorRefinementList-item--selected",
            )}
          >
            <label className="ais-DualColorRefinementList-label">
              <input
                checked={item.isExcluded}
                type="checkbox"
                className="ais-DualColorRefinementList-checkbox"
                value={item.name}
                onChange={() => refine(item.code)}
              />
              <span className="ais-DualColorRefinementList-labelText">
                {item.name}
              </span>
              <span className="ais-DualColorRefinementList-count">
                {item.count}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

function cx(...classNames) {
  return classNames.filter(Boolean).join(" ");
}