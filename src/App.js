import "./App.css";
import { Route, Routes } from "react-router";

import ResponsiveAppBar from "./Navigation/ResponsiveAppBar";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Help from "./Pages/Help";
import Projects from "./Pages/Projects";
import Profile from "./Pages/Profile";
import Logout from "./Pages/Logout";
import Vote from "./Pages/Vote";

import SubmitVoteSimple from "./Pages/SubmitVoteSimple";
import SubmitVoteAllIn from "./Pages/SubmitVoteAllIn";
import SubmitVote from "./Pages/SubmitVote";
import Results from "./Pages/Results";
import SubmitVoteQuadratic from "./Pages/SubmitVoteQuadratic";

import ProjectProposals1 from "./Pages/ProjectProposals1";
import ProjectResults from "./Pages/ProjectResults";
import ProjectProposalSubmission from "./Components/ProjectProposalSubmission";
import ProjectSimpleVote from "./Pages/ProjectSimpleVote";
import ProjectQuadraticVote from "./Pages/ProjectQuadraticVote";

function App() {
  return (
    <div className="App">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      <script src="https://unpkg.com/embeddable-nfts/dist/nft-card.min.js"></script>
      <script src="bower_components/abi-decoder/dist/abi-decoder.js"></script>
      <ResponsiveAppBar />
      <Routes>
        {/* <Link to="/users">Users</Link> */}
        <Route path="/" element={<Home />} />
        <Route path="About" element={<About />} />
        <Route path="Projects" element={<Projects />} />
        <Route path="Help" element={<Help />} />
        <Route path="Profile" element={<Profile />} />
        <Route path="Vote" element={<Vote />} />
        <Route path="Proposals" element={<Vote />} />
        <Route path="Logout" element={<Logout />} />
        <Route path="ProjectProposals1" element={<ProjectProposals1 />} />
        <Route path="SubmitVote/:proposalId" element={<SubmitVote />} />
        <Route
          path="ProjectQuadraticVote/:proposalId"
          element={<ProjectQuadraticVote />}
        />
        <Route
          path="SubmitVoteQuadratic/:proposalId"
          element={<SubmitVoteQuadratic />}
        />
        <Route
          path="SubmitVoteSimple/:proposalId"
          element={<SubmitVoteSimple />}
        />
        <Route
          path="ProjectSimpleVote/:proposalId"
          element={<ProjectSimpleVote />}
        />
        <Route
          path="SubmitVoteAllIn/:proposalId"
          element={<SubmitVoteAllIn />}
        />
        <Route path="ProjectResults/:proposalId" element={<ProjectResults />} />
        <Route path="Results/:proposalId" element={<Results />} />
        <Route
          path="ProjectProposalSubmission"
          element={<ProjectProposalSubmission />}
        />
      </Routes>
    </div>
  );
  //   }
}

export default App;
