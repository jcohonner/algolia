import { useLoaderData } from "react-router-dom";

export default function Actor() {
  const actor = useLoaderData();
  return <div>actor</div>;
}
