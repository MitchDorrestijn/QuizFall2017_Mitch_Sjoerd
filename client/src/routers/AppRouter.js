import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import TeamApp from '../components/teamApp/TeamApp';
import MasterApp from '../components/masterApp/MasterApp';
import BoardApp from '../components/boardApp/BoardApp';
import Index from '../components/index/Index';
import NotFoundPage from '../components/index/NotFoundPage';

const AppRouter = () => (
  <BrowserRouter>
    <div>
      <Switch>
        <Route exact path="/" component={Index} />
        <Route exact path="/quiz/:roomNumber" component={TeamApp} />
        <Route exact path="/master" component={MasterApp} />
        <Route exact path="/bord/:roomNumber" component={BoardApp} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default AppRouter;
