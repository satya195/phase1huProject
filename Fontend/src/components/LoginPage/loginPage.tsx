import React, { useState } from 'react';
import "./loginPage.scss";
interface LandingPageProps {
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  }
const LoginPagePhase1: React.FC<LandingPageProps> = ({ setIsLoggedIn }) => {
    const [isSignup, setIsSignup] = useState(false);
    return (
        <div className="japanese-login-container">
        <div className="sakura-background" />
        <div className="login-card">
          <h1 className="kanji-title">ようこそ (Welcome)</h1>
          <p className="subtitle">{isSignup ? "新しいアカウントを作成してください" : "ログインしてください"}</p>
  
          <div className="form-group">
            {isSignup && (
              <input type="text" className="japanese-input" placeholder="名前 (Name)" />
            )}
            <input type="email" className="japanese-input" placeholder="メール (Email)" />
            <input type="password" className="japanese-input" placeholder="パスワード (Password)" />
            {isSignup && (
              <input type="password" className="japanese-input" placeholder="パスワード確認 (Confirm Password)" />
            )}
          </div>
  
          <button className="japanese-btn red-btn">{isSignup ? "登録する" : "ログイン"}</button>
          <button className="japanese-btn white-btn" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "戻る" : "新規登録"}
          </button>
        </div>
      </div>
      );
};

export default LoginPagePhase1;
