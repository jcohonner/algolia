import Hit from "./Hit";
import { Link } from "react-router-dom";
import fakeHit from "../services/fakeHit";

export default function Carousel({ title, category, hits }) {
  const hitsToRender = hits || [fakeHit, fakeHit, fakeHit, fakeHit];

  return (
    <section className="mb-8">
      <Link to={`/category/${category}`}>
        <h2 className="text-xl font-semibold mb-4">{title} &gt;</h2>
      </Link>
      <ul className="grid grid-cols-2  lg:grid-cols-4 gap-4">
        {hitsToRender.map((hit, index) => (
          <li key={index}>
            <Hit hit={hit} />
          </li>
        ))}
      </ul>
    </section>
  );
}
