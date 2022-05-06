import logo from './logo.svg';
import './App.css';
import { Routes ,Route} from 'react-router-dom';
import Login from './componenet/Login';
import VideoCall from './componenet/VideoCall';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/login' element={ <Login/>} />
        <Route path='/video-call' element={<VideoCall/> } />
      </Routes>
    </div>
  );
}

export default App;