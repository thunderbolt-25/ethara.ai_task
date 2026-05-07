import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <section className="landing-page">
      <div className="landing-content">
        <div className="landing-text">
          <h1>Team Task Manager</h1>
          <p>
            Plan projects, assign tasks, and track team progress with role-based access for Admins and Members.
            Keep deadlines organized and never miss what is due next.
          </p>
          <ul className="landing-points">
            <li>Secure login and signup</li>
            <li>Project and member management</li>
            <li>Task assignment with status tracking</li>
            <li>Dashboard insights and overdue visibility</li>
          </ul>
          <Link className="landing-cta" to="/login">Log In Now</Link>
        </div>

        <div className="landing-visual" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"
            alt="Team collaborating on project planning"
          />
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
