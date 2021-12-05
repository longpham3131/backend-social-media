import React,{useEffect} from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import AuthRoute from "./guard/auth.guard";
import { useSelector,useDispatch} from "react-redux";
import userAPI from "apis/userAPI";
//SCSS
import "./styles/styles.scss";
import AuthPage from "pages/Auth";

const App = () => {
  const auth = useSelector((state) => state.authReducer.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(userAPI.getMyProfile())
  }, [auth]);

  return (
    <BrowserRouter>
      <>
        {/* <Header /> */}
        <Switch>
          <Route
            path="/login"
            render={(props) => <AuthPage {...props} />}
          />
          {/* <AuthRoute path="/post" Component={PostDetail} />
          <AuthRoute path="/profile/:id" Component={Profile} />
          <AuthRoute path="/search/:keySearch" Component={Search} />
          <AuthRoute path="/" Component={SocialMedia} /> */}
    
          
        </Switch>
      </>
    </BrowserRouter>
  );
};

export default App;
