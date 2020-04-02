import React, { Component } from 'react';
import { connect } from 'react-redux';
import CordaNetwork from './screens/CordaNetwork';
import TransactionExplorer from './screens/TransactionExplorer';
import Header from './components/Header';
import Login from './screens/Login';
import SideMenu from './components/SideMenu';
import * as ActionType from './store/Actions';
import VaultExplorer from './screens/VaultExplorer';
import Dashboard from './screens/Dashboard';
import Settings from './screens/Settings';
import Spinner from './spinner.svg';

class Explorer extends Component {

    state = {
      cordappDirSet: false,
      firstNode: null,
      firstNodeSettings: null
    }

    componentWillMount() {
        this.getNodeData();
    }

    componentDidMount(){
        this.props.getApplicationState();
        if (this.state.cordappDirSet) this.updateCordappDir();
    }

    getNodeData = () => {
      const nodeDefaults = document.getElementById('nodeDefaults').innerHTML;
      const nodeList = document.getElementById('nodeList').innerHTML;

      // deployNodes needs to exist and be found in project build.gradle
      if (nodeDefaults != 'undefined' && nodeList != '[]') {
        const defaultSettings = JSON.parse(nodeDefaults);
        const allNodes = JSON.parse(nodeList);

        var connections = {}

        allNodes.forEach(function(node) {
            if(!node.notary){
                connections[node.name] = {
                    host: node.rpcSettings.address,
                    cordappDir: node.cordappDir   
                }
                if(node.rpcUsers){
                    connections[node.name].username = node.rpcUsers.user;
                    connections[node.name].password = node.rpcUsers.password;
                    
                }else{
                    connections[node.name].username = defaultSettings.rpcUsers.user;
                    connections[node.name].password = defaultSettings.rpcUsers.password;
                }
            }
        });
        const node = connections[Object.keys(connections)[0]];
        const settings = {
          cordappDirectory: node.cordappDir,
          dateFormat: "",
          dateTimeFormat: ""
        }
        this.setState({
          firstNode: node,
          firstNodeSettings: settings
        })
      }
    }

    updateCordappDir = () => {
      ActionType.updateSettings(this.state.firstNodeSettings, 'cordappDir');
      this.setState({
        cordappDirSet: true
      })
    }

    render(){
      return (
        <React.Fragment>
            {this.props.isLoggedIn ?
              <div>
                  <Header/>
                  <SideMenu></SideMenu>
                  <div style={{marginLeft: 120}}>
                    <div className="content-pane">
                      {
                        this.props.spinner? 
                        <div className="spinner">
                          <div>
                              <img style={{width: 100}} src={Spinner} alt="Spinner"></img>
                          </div>
                          </div>:null
                      }
                      {
                        this.props.currentPage === 0 ? <Dashboard/>: 
                        this.props.currentPage === 1 ? <CordaNetwork/>: 
                        this.props.currentPage === 2 ? <TransactionExplorer/>:
                        this.props.currentPage === 3 ? <VaultExplorer/>: 
                        this.props.currentPage === 4 ? <Settings/>: 
                        <Dashboard/>
                      }
                    </div> 
                  </div> 
              </div> 
              : 
                <Login firstNode={this.state.firstNode}></Login>
            }
        </React.Fragment>
      );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.common.isLoggedIn,
        currentPage: state.common.currentPage,
        spinner: state.common.spinner
    }
}

const mapDispatchToProps = dispatch => {
    return {
      onLoginSuccess: () => dispatch({type: ActionType.LOGIN_SUCCESS}),
      getApplicationState: () => dispatch({type: ActionType.LOAD_APP_STATE}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Explorer);