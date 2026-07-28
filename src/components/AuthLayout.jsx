const AuthLayout = ({ children }) => {
  return (
    <div className="split-layout">
      {/* Left Pane - Hero Section */}
      <div className="hero-pane">
        <div className="hero-content">
          <div className="hero-logo-text">
            <span className="logo-icon">🏏</span> TEAMNOTFOUND
          </div>
          <h1 className="hero-title">PURE PERFORMANCE.</h1>
          <p className="hero-subtitle">
            Welcome to TeamNotFound. Your premium destination for professional cricket gear.
          </p>
        </div>
      </div>
      
      {/* Right Pane - Form Section */}
      <div className="form-pane">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
