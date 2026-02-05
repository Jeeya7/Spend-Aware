import './style/App.css'
import { Link, Outlet } from 'react-router-dom';
import { FiHome, FiDollarSign } from 'react-icons/fi';


function App() {

return (
  <div className="app">
    {/* Sidebar */}
    <aside className="sidebar">
       <img src="/logo3.png" sizes="32x32" alt="Spend Aware logo" className="logo-img" />
      <nav className="nav">
        <Link to="/home" className="nav-item">
          <FiHome className="nav-icon" />
          Home
        </Link>
        <Link to="/spendings" className="nav-item">
          <FiDollarSign className="nav-icon" />
          Spending
        </Link>
      </nav>
    </aside>

    {/* Main Content */}
    <main className="main-content">
      <section>
        <Outlet />
      </section>
    </main>
  </div>
);

}

export default App
