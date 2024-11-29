import React, { useState, useEffect, useContext } from 'react';
import { Input, Button } from 'antd';
import solace, { SolclientFactory } from 'solclientjs';
import { SessionContext } from '../util/solaceSession';

const { Search } = Input;
const QUERY_TOPIC = 'demo/rag/query';
const MAX_TIMEOUT = 60000;

const Query = () => {
  const [pendingResponse, setPendingResponse] = useState(false);
  const { setallChat, session, response } = useContext(SessionContext); // Use context
  const [buttonText, setButtonText] = useState('Send');
  const [curQuery, setCurQuery] = useState('');
  const [timoutID, setTimeoutID] = useState(null);
  const placeholder = 'Ask the Solace AI connector anything';

  useEffect(() => {
    if (response) {
      clearTimeout(timoutID);
      setallChat((prevAllChat) => [...prevAllChat, { response: response }]);
      setPendingResponse(false);
      setButtonText('Send');
    }
  }, [response]);

  const message = SolclientFactory.createMessage();
  message.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);

  const publishQuery = (query) => {
    const encoder = new TextEncoder();
    const payload = encoder.encode(`{"query": "${query}"}`);
    message.setBinaryAttachment(payload);
    message.setDestination(
      SolclientFactory.createTopicDestination(QUERY_TOPIC)
    );
    try {
      session.send(message);
      setTimeoutID(
        setTimeout(() => {
          setButtonText('Timeout!');
          setallChat((prevAllChat) => [
            ...prevAllChat,
            {
              response:
                'Operation Timeout. Please make sure the Solace AI Connector is running',
            },
          ]);
          setPendingResponse(false);
        }, MAX_TIMEOUT)
      );
    } catch (error) {
      console.error('Failed to send message:', error);
      setButtonText('Error');
      setPendingResponse(false);
    }
  };

  const sendQuery = (query) => {
    setallChat((prevAllChat) => [...prevAllChat, { query: query }]);
    console.log('Publishing query:', query);
    setButtonText('Waiting for response');
    setPendingResponse(true);
    publishQuery(query);
    setCurQuery(' ');
  };

  return (
    <div>
      <Search
        placeholder={placeholder}
        value={curQuery}
        enterButton={buttonText}
        size="large"
        loading={pendingResponse}
        onSearch={(value) => sendQuery(value)}
        disabled={!session}
        onChange={(e) => setCurQuery(e.target.value)} // Update the input value on change
      />
      <div style={{ padding: '20px 0px 0px 0px' }}>
        <Button
          color="primary"
          variant="outlined"
          onClick={() => setallChat([])}
        >
          Clear All Chat
        </Button>
      </div>
    </div>
  );
};

export default Query;
