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

    componentWillMount() {
        this.props.saveGradleNodesList();
    }

    componentDidMount(){
        this.props.getApplicationState();
        // if (this.state.cordappDirSet) this.updateCordappDir();
    }

    render(){
      return (
        <React.Fragment>
            {this.props.isLoggedIn ?
              <div>
                  {/* {console.log(this.props.gradleNodes) /* test print for structure */} */}
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
                <Login/>
            }
        </React.Fragment>
      );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.common.isLoggedIn,
        currentPage: state.common.currentPage,
        spinner: state.common.spinner,
    }
}

const mapDispatchToProps = dispatch => {
    return {
      saveGradleNodesList: () => dispatch({type: ActionType.UPDATE_GRADLE_NODES_LIST}),
      getApplicationState: () => dispatch({type: ActionType.LOAD_APP_STATE}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Explorer);