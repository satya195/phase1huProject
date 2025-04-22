import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Dashboard.scss';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const userEmail = sessionStorage.getItem('userEmail') || '';
  const userId = sessionStorage.getItem('userId') || '';
  const userName = sessionStorage.getItem('userName') || '';
  const [inputText, setInputText] = useState('');
  const [history, setHistory] = useState<{ promptId: string; prompt: string; response: string }[]>([]);

  const getTokenFromCookie = () => {
    const name = "token=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  };
  const token = getTokenFromCookie();

  useEffect(()=>{
    fetchAllPrompts();
    console.log("Cookies available in Dashboard:",getTokenFromCookie());
  },[])

  const successToast = (message: string) =>
    toast.success(message, {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
      transition: Bounce,
    });

  const errorToast = (message: string) =>
    toast.error(message, {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
      transition: Bounce,
    });

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const handleDeleteAccount = () => {
    axios
      .post(`/api/delUserAcc`, { userId: userId },{
        headers: {
            Authorization: `Bearer ${token}`
          }
      })
      .then((response) => {
        if (response.status === 200) {
          successToast(response.data.message);
          sessionStorage.clear();
          navigate('/');
        }
      })
      .catch((error) => {
        errorToast(error.response.data.message);
        console.log(error);
      });
  };

  const analyzeSentiment = () => {
    if (inputText.trim() === '') {
      errorToast('Please enter some text');
      return;
    }
    axios.post(`/api/analyzePromptSentiment`, {
        userId : userId,
        prompt : inputText,
        promptId :uuidv4()
      },{
        headers: {
            Authorization: `Bearer ${token}`
          }
      })
      .then((response) => {
        if (response.status === 200) {
            console.log("analyzePromptSentiment Executed !!",response);
            fetchAllPrompts();
            successToast("New Prompt successfully added !!!");
        }
      }).catch((error) => {
        errorToast(error.response.data.message);
        console.log(error);
      });
  };

  const fetchAllPrompts = () =>{
    axios.post(`/api/getAllPrompts`, {
        userId : userId
      },{
            headers: {
              Authorization: `Bearer ${token}`
            }
      })
      .then((response) => {
        if (response.status === 200) {
           console.log("fetch all Prompts Executed !!");
           console.log("fetch all response",response.data);
           const mapped = response.data.data.map((item: any) => ({
            promptId: item.promptId,
            prompt: item.prompt,
            response: item.promptResponse
          }));
          setHistory(mapped);
        }
      }).catch((error) => {
        errorToast(error.response.data.message);
        console.log(error);
      });
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Welcome, {userName}</h2>
          <p><strong>Email:</strong> {userEmail}</p>
        </div>
        <div className="sidebar-buttons">
          <button onClick={handleLogout}>Logout</button>
          <button className="delete" onClick={handleDeleteAccount}>Delete Account</button>
        </div>
      </aside>

      <main className="main-content">
        <h1>Sentiment Analysis</h1>
        <textarea
          placeholder="Enter text for sentiment analysis..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button className="analyze" onClick={analyzeSentiment}>Analyze</button>

        {history.length > 0 && (
          <div className="analysis-history">
          {history.map((item) => (
              <div key={item.promptId} className="analysis-table">
                <div className="row">
                  <div className="column label">Prompt</div>
                  <div className="column content">{item.prompt}</div>
                </div>
                <div className="row">
                  <div className="column label">Response</div>
                  <div className="column content">{item.response}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <ToastContainer />
    </div>
  );
};

export default Dashboard;
