import { useParams, Outlet } from 'react-router-dom';
import { Layout } from './Layout';
import Teams from './Teams';  // Assuming Teams is your component
import Chat from './Chat';    // Assuming Chat is your component

function TeamsLayout() {
  const { teamId } = useParams();  // Get the teamId from the URL

  return (
    <Layout 
      selectedNavBarButton="teams" 
      leftRailContent={<Teams />} 
      mainContent={<Outlet />}  // This allows nested routes to render here: Calendar or Tasks
      rightRailContent={teamId ? <Chat teamId={teamId} /> : <JoinTeamMessage />}  // Show Chat if a team is selected, else show a "Join Team" message
    />
  );
}

function JoinTeamMessage() {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">No team selected</h2>
      <p>Join a team to start chatting and collaborating!</p>
    </div>
  );
}

export default TeamsLayout;
