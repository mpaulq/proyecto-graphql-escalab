import React, { useContext } from 'react';
import ApolloClient from 'apollo-boost';
import { Switch, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { ToastContainer } from 'react-toastify';
// import components
import Nav from './components/Nav';
import Home from './pages/Home';
import Users from './pages/Users';
import Register from './pages/auth/Register';
import PasswordUpdate from './pages/auth/PasswordUpdate';
import PasswordForgot from './pages/auth/PasswordForgot';
import Profile from './pages/auth/Profile';
import Login from './pages/auth/Login';
import CompleteRegistration from './pages/auth/CompleteRegistration';
import { AuthContext } from './context/authContext';
import { NavProvider } from './context/navContext';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Post from './pages/post/Post';
import SinglePost from './pages/post/SinglePost';
import SingleUser from './pages/SingleUser';
import SearchPost from './pages/post/searchPost';


const App = () => {
  const { state } = useContext(AuthContext);
  const { user } = state;
  
  const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
    request: (operation) => {
      operation.setContext({
        headers: {
          authToken: user ? user.token : '',
        }
      });
    }
  });

  return (
    <ApolloProvider client={client}>
      <NavProvider>
        <Nav />
        <ToastContainer />
        <Switch>
          <Route  exact path="/" component={Home} />
          <Route exact path="/users" component={Users} />
          <PublicRoute exact path="/register" component={Register} />
          <PublicRoute exact path="/login" component={Login} />
          <Route exact path="/post/search" component={SearchPost} />
          <Route exact path="/complete-registration" component={CompleteRegistration} />
          <Route exact path="/password/forgot" component={PasswordForgot} />
          <PrivateRoute exact path="/password/update" component={PasswordUpdate} />
          <PrivateRoute exact path="/profile" component={Profile} />
          <PrivateRoute exact path="/post/create" component={Post} />
          <PrivateRoute exact path="/post/:id" component={SinglePost} />
          <Route exact path="/user/:username" component={SingleUser}/>
        </Switch>
      </NavProvider>
    </ApolloProvider>
  );
}

export default App;
