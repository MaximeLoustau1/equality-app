import './App.css';
import Select from 'react-select';

function App() {
  return (
    <div className="app">
      {/* Full-width Header */}
      <header className="topbar">
        <img
          src="https://equileap.com/wp-content/uploads/2023/09/logo-equileap-wh@2x.png"
          alt="Logo"
          className="logo"
        />
        <div className="title">
          DATA HUB
        </div>
      </header>

      {/* Centered Page Content */}
      <div className="main-content">
        <div className="dropdowns">
          <div className="dropdown">
            <Select
              options={categoryOptions}
              placeholder="CATEGORY"
              isSearchable
              className="dropdown"
              classNamePrefix="rs"
            />
          </div>

          <div className="dropdown">
            <Select
              options={sectorOptions}
              placeholder="SECTOR"
              isSearchable
              className="dropdown"
              classNamePrefix="rs"
            />
          </div>

          <div className="dropdown">
            <Select
              options={groupOptions}
              placeholder="GROUP"
              isSearchable
              className="dropdown"
              classNamePrefix="rs"
            />
          </div>
        </div>
      </div> {/* ← This was the missing closing div */}

      {/* Footer */}
      <footer className="footer">
        © 2025 Equileap
      </footer>
    </div>
  );
}

const categoryOptions = [
  { value: 'finance', label: 'Finance' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'retail', label: 'Retail' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'technology', label: 'Technology' },
  { value: 'media', label: 'Media' },
  { value: 'energy', label: 'Energy' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'tourism', label: 'Tourism' },
];

const sectorOptions = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
  { value: 'nonprofit', label: 'Nonprofit' },
  { value: 'government', label: 'Government' },
  { value: 'startup', label: 'Startup' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'open', label: 'Open Source' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'education', label: 'Education' },
];

const groupOptions = [
  { value: 'group-a', label: 'Group A' },
  { value: 'group-b', label: 'Group B' },
  { value: 'group-c', label: 'Group C' },
  { value: 'group-d', label: 'Group D' },
  { value: 'group-e', label: 'Group E' },
  { value: 'group-f', label: 'Group F' },
  { value: 'group-g', label: 'Group G' },
  { value: 'group-h', label: 'Group H' },
  { value: 'group-i', label: 'Group I' },
  { value: 'group-j', label: 'Group J' },
];

export default App;