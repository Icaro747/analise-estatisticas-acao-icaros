import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div>
      <h1>Oops! Você parece estar perdido 😵</h1>
      <p>Aqui estão alguns links úteis:</p>
      <ul>
        <li>
          <Link to="/home">Home</Link>
        </li>
      </ul>
    </div>
  );
}

export default NotFound;
