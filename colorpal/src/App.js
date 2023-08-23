import './App.css';
import { Typography } from '@mui/material';
import ColorPicker from './ColorPicker';

function App() {
  return (
    <div className="App">
      <Typography variant="h3">ColorPal Basic App</Typography>
      <ColorPicker />
    </div>
  );
}

export default App;
