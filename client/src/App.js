import React,{useEffect} from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import AuthRoute from "./guard/auth.guard";
import LoginAndRegister from "./pages/LoginAndRegister";
import Profile from "./pages/Profile";
import SocialMedia from "./pages/SocialMedia";
import Header from "./compoents/Header";
import { useSelector,useDispatch} from "react-redux";
import {getUserCurrentProfile} from "store/user/user.action"
//SCSS
import "./scss/index.scss";
import PostDetail from "pages/PostDetail";

const App = () => {
  const auth = useSelector((state) => state.authReducer.auth);
  const profile = useSelector((state) => state.userReducer.profileCurentUser);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserCurrentProfile())
  }, [auth]);

  useEffect(()=>{
  },[profile])
  return (
    <BrowserRouter>
      <>
        <Header />
        <Switch>
          <Route
            path="/login"
            render={(props) => <LoginAndRegister {...props} />}
          />
          <AuthRoute path="/post" Component={PostDetail} />
          <AuthRoute path="/profile/:id" Component={Profile} />
          <AuthRoute path="/" Component={SocialMedia} />
        </Switch>
      </>
    </BrowserRouter>
  );
};

export default App;
