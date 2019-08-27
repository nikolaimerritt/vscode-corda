package client.boundary;

import client.NodeRPCClient;
import client.entities.Message;
import client.entities.MessageDecoder;
import client.entities.MessageEncoder;
import client.entities.adapters.ClassTypeAdapter;
import client.entities.adapters.NodeInfoTypeAdapter;
import client.entities.adapters.PartyTypeAdapter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import net.corda.core.identity.Party;
import net.corda.core.node.NodeInfo;
import org.springframework.web.bind.annotation.CrossOrigin;

import javax.json.Json;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.*;

/**
 * This class handles websocket connections form the Corda VSCODE extension.
 * Commands are passed via Message Object which consists of: cmd, content
 * cmd - the request to forward to the NodeRPCClient
 * content - args etc.
 */
@CrossOrigin(origins = "*")
@ServerEndpoint(value = "/session", decoders = MessageDecoder.class,
        encoders = { MessageEncoder.class })
public class ClientWebSocket {

    private Session session;
    private static List<String> nodes = new ArrayList<>();
    private NodeRPCClient client;

    @OnOpen
    public void onOpen(Session session) throws IOException, EncodeException {
        this.session = session;
        System.out.println(this.session.getId() + " connected!");
        Message response = new Message("socket open", "connected!");
        sendResponse(response);
    }

    @OnMessage
    public void onMessage(Session session, Message message) throws Exception {
        // debug
        System.out.println(session.getId() + " sent cmd: " + message.getCmd() + ", sent content: " + message.getContent());

        String msgCmd = message.getCmd();
        Object retObj = null; // store a returned content object
        HashMap<String, Object> content = null;

        try {
            // parse message content if it exists
            if (message.getContent().length() > 0) {
                content = new ObjectMapper().readValue(message.getContent(), HashMap.class);
            }

            // initial connection will have node details in the content to set client connection
            if (msgCmd.equals("connect")) {

                HashMap<String, String> node = new ObjectMapper().readValue(message.getContent(), HashMap.class);
                client = new NodeRPCClient(node.get("host"), node.get("username"), node.get("password"));

            } else if (message.getCmd().equals("startFlow")) {
                String flow = (String) content.get("flow");
                HashMap<String, String> argMap = (HashMap<String, String>) content.get("args");
                Object[] argsArray = argMap.values().toArray();
                String[] strArgsArray = Arrays.copyOf(argsArray, argsArray.length, String[].class);

                client.run(flow, strArgsArray);

            } else {
                retObj = client.run(msgCmd);
            }

            message.setResult("OK");
        } catch (Exception e) {
            message.setResult(e.toString());
            sendResponse(message);
        }

        if (retObj != null) sendResponse(message, retObj);
        else sendResponse(message);

    }

    // TODO: Add notifyServerAndClose send to client and have RPCClient close the connection
    @OnClose
    public void onClose(Session session) {
        if(client != null) client.closeConnection();
        System.out.println(session.getId() + " disconnected onClose");
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        // error handling
    }

    // overloaded sendResponse sends messages back to the client web-view
    private void sendResponse(Message message) throws IOException, EncodeException {
        session.getBasicRemote().sendObject(message);
    }
    private void sendResponse(Message message, Object obj) throws IOException, EncodeException {
        String content = ObjEncoder.encode(obj);
        message.setContent(content);

        session.getBasicRemote().sendObject(message);
    }

    public static class ObjEncoder {

        // set type adapter, and other options on Gson
        private static GsonBuilder gsonBuilder = new GsonBuilder().disableHtmlEscaping().setPrettyPrinting();
        private static Gson gson;

        public static String encode(Object obj) {
            gson = gsonBuilder.registerTypeAdapter(Party.class, new PartyTypeAdapter())
                    .registerTypeAdapter(NodeInfo.class, new NodeInfoTypeAdapter())
                    .registerTypeAdapter(Class.class, new ClassTypeAdapter()).create();
            String json = gson.toJson(obj);
            return json;
        }

    }

}
