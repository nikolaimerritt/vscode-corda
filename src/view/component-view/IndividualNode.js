import React from 'react';

import Konva from "konva";
import { Stage, Layer, Circle, Text, Group, Label, Tag, Tween } from "react-konva";

export default class IndividualNode extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            x : props.x,
            y : props.y,
            name : '\uf141',
            connection:{
              host: props.node.rpcSettings.address,
              username: props.node.rpcUsers.user, 
              password: props.node.rpcUsers.password,
              cordappDir: props.node.cordappDir
            }

        }
        this.showToolTip = this.showToolTip.bind(this);
        this.hideToolTip = this.hideToolTip.bind(this);
        this.expandNode = this.expandNode.bind(this);
        
        console.log("HERE + " + this.state.connection.cordappDir)

        this.client = new WebSocket("ws://localhost:8080/session");
       
        this.messageHandler = this.messageHandler.bind(this);
        // set event handler for websocket
        this.client.onmessage = (event) => {
            this.messageHandler(event);
        }

        
        
    }

    messageHandler(event) {
    
        var evt = JSON.parse(event.data);
        var content = JSON.parse(evt.content);

        console.log("command received: " + evt.cmd);
        console.log("returned content: " + evt.content);

        if (evt.cmd == "getNodeInfo") {
            this.setState({
                name: content.legalIdentities,
                hostport: content.addresses,
                serial: content.serial,
                platform: content.platformVersion
            });
        }
    }


    componentDidMount() {
        // propagate initial node info
    
        this.client.onopen = () => {
            this.client.send(JSON.stringify({"cmd":"connect","content":JSON.stringify(
                
                this.state.connection
                
            )}));
            this.client.send(JSON.stringify({"cmd":"getNodeInfo"}));
        }    
    }

  

    handleDragStart(e){
        var circles = e.target.getChildren(function(node){
          return node.getClassName() === 'Circle';
        });
        e.target.moveToTop();
        circles[0].setAttrs({
          shadowOffset: {
            x: 15,
            y: 15
          },
          scaleX: 1.1,
          scaleY: 1.1
        });
      };
      handleDragEnd (e){
        var circles = e.target.getChildren(function(node){
          return node.getClassName() === 'Circle';
        });
    
        circles[0].to({
          duration: 0.5,
          easing: Konva.Easings.ElasticEaseOut,
          scaleX: 1,
          scaleY: 1,
          shadowOffsetX: 5,
          shadowOffsetY: 5
        });
      };

      showToolTip(e){
        const { showToolTip } = this.props;
        showToolTip({
            name: this.state.name,
            legalIdentities: this.state.legalIdentities,
            hostport: this.state.hostport,
            serial:this.state.serial,
            platform:this.state.platform,
        })
      }

      hideToolTip(){
          const { hideToolTip } = this.props;
          hideToolTip();
      }

      expandNode(e){
        const { switchNodeView } = this.props;
        switchNodeView(this.client);
      }

    render() {
        return (
            <Group
                      draggable
                      onDragStart={this.handleDragStart}
                      onDragEnd={this.handleDragEnd}
                      onMouseEnter={this.showToolTip}
                      onMouseLeave={this.hideToolTip}
                  >
                      <Circle 
                        class="nodeCircle" 
                        id="innerCi" 
                        x={this.state.x} 
                        y={this.state.y}
                        radius={50} 
                        fill='#ec1d24'
                        shadowColor="black"
                        shadowBlur={10}
                        shadowOpacity={0.6}
                        onClick={this.expandNode}
                      
                        />
                        <Label
                           x={this.state.x} 
                           y={this.state.y}
                        >
                            <Tag 
                            fill= 'black'
                            pointerDirection= 'left'
                            pointerWidth= {20}
                            pointerHeight= {28}
                            lineJoin='round'
                            />
                            <Text text={this.state.name} x={this.state.x} fontFamily="FontAwesome" y={this.state.y} fill="white" padding ={5}  />
                        </Label>
                        
                      
                      
                      
                  </Group>
        )
    }
}