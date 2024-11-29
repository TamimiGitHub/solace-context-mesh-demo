import React, { useState, useEffect, useContext } from 'react';
import '../css/collapsable.css';
import { Row, Col, Form, Input, Button, Tooltip, Collapse } from 'antd';
import { CaretRightOutlined, LinkOutlined } from '@ant-design/icons';
import solace, { SolclientFactory } from 'solclientjs';
import { SessionContext } from '../util/solaceSession';

const factoryProps = new solace.SolclientFactoryProperties();
factoryProps.profile = solace.SolclientFactoryProfiles.version10_5;
SolclientFactory.init(factoryProps);
SolclientFactory.setLogLevel(solace.LogLevel.FATAL);
const RESPONSE_TOPIC = 'demo/rag/query/response';

const BrokerConfig = () => {
  const { session, setSession, setSessionProperties, setResponse } =
    useContext(SessionContext); // Use context
  const [isConnected, setIsConnected] = useState(session ? true : false);
  const [connecting, setConnecting] = useState(false);
  const [errorConnection, setErrorString] = useState(undefined);
  const [disableForm, setdisableForm] = useState(false);
  const [form] = Form.useForm();
  const [record, setRecord] = useState({
    url: 'ws://localhost:8008',
    vpn: 'default',
    username: 'default',
    password: 'default',
    qos: 'direct',
    msgformat: 'text',
    compression: false,
  });

  useEffect(() => {}, [session, record]);

  const onRecordChange = (value) => {
    setRecord((prevRecord) => ({ ...prevRecord, ...value }));
  };

  const handleConnect = (e) => {
    console.log('Connecting to the solace broker...');
    const { url, vpn, username, password, compression } = record;

    let sessionProperties;
    try {
      new URL(url); // Validate URL
      sessionProperties = {
        url: url,
        vpnName: vpn,
        userName: username,
        password: password,
        connectRetries: 0,
        reconnectRetries: 3,
        payloadCompressionLevel: compression ? 9 : 0,
      };
    } catch (error) {
      setErrorString('Invalid URL: ' + url);
      setConnecting(false);
      return;
    }

    setConnecting(true);
    const newSession = solace.SolclientFactory.createSession(sessionProperties);

    newSession.on(solace.SessionEventCode.UP_NOTICE, () => {
      console.log('Connected to Solace message router.');
      setErrorString(undefined);
      setIsConnected(true);
      setConnecting(false);
      setdisableForm(true);
      setSession(newSession);
      setSessionProperties({
        qos: record.qos,
        msgformat: record.msgformat,
        compression: record.compression,
      });
      try {
        newSession.subscribe(
          solace.SolclientFactory.createTopicDestination(RESPONSE_TOPIC),
          true, // generate confirmation when subscription is added successfully
          10000 // 10 seconds timeout for this operation
        );
      } catch (error) {
        console.log(error.toString());
      }
    });

    newSession.on(
      solace.SessionEventCode.CONNECT_FAILED_ERROR,
      (sessionEvent) => {
        console.log(
          'Connection failed to the message router: ' + sessionEvent.infoStr
        );
        setErrorString(sessionEvent.infoStr);
        setIsConnected(false);
        setConnecting(false);
        setdisableForm(false);
      }
    );

    newSession.on(solace.SessionEventCode.SUBSCRIPTION_OK, (sessionEvent) => {
      console.log('Subscription successs!');
    });

    newSession.on(solace.SessionEventCode.MESSAGE, (message) => {
      const decoder = new TextDecoder('utf-8');
      const response = decoder.decode(message.getBinaryAttachment());
      try {
        let json_response = JSON.parse(response);
        console.log(
          `Received response from AI Connector on ${RESPONSE_TOPIC}:`
        );
        console.log(json_response);
        setResponse(json_response.response);
      } catch (error) {
        console.log('error parsing JSON response:', error);
      }
    });

    newSession.on(solace.SessionEventCode.DISCONNECTED, () => {
      console.log('Disconnected From broker.');
      setIsConnected(false);
      setConnecting(false);
      setdisableForm(false);
      setSession(null);
    });

    try {
      newSession.connect();
    } catch (error) {
      setErrorString(
        'Error connecting to Solace message router: ',
        error.toString()
      );
    }
  };

  const handleDisconnect = () => {
    if (session) {
      try {
        console.log('Disconnecting Solace session.');
        session.removeAllListeners();
        session.disconnect();
        setIsConnected(false);
        setConnecting(false);
      } catch (error) {
        setErrorString(
          'Error disconnecting from Solace message router: ',
          error.toString()
        );
      }
    }
  };

  const ConnectionForm = (
    <>
      <Form
        layout="vertical"
        form={form}
        name="basic"
        disabled={disableForm}
        initialValues={record}
        onValuesChange={onRecordChange}
      >
        <Row gutter={20}>
          <Col span={6}>
            <Form.Item
              label="URL"
              name="url"
              rules={[
                {
                  required: true,
                  message: 'Please input the URL',
                },
                {
                  type: 'url',
                  message: 'Please enter a valid URL',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="VPN" name="vpn">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Username" name="username">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Password" name="password">
              <Input.Password />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              <Button
                type="primary"
                shape="round"
                onClick={handleConnect}
                disabled={isConnected}
              >
                {connecting
                  ? 'Connecting...'
                  : isConnected
                    ? 'Connected'
                    : 'Connect'}
              </Button>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              <Button
                color="danger"
                variant="solid"
                shape="round"
                onClick={handleDisconnect}
                disabled={!isConnected}
              >
                Disconnect
              </Button>
            </Form.Item>
          </Col>
          {errorConnection && (
            <Col span={24}>
              <Form.Item>
                <div style={{ color: 'red' }}>{errorConnection}</div>
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form>
      <Row>
        <Col span={24}>
          <Form.Item>
            <div>
              To get started with creating a solace PubSub+ event broker follow
              the instructions on{' '}
              <a
                href="https://docs.solace.com/Get-Started/Getting-Started-Try-Broker.htm"
                target="_blank"
                rel="noreferrer"
              >
                Try PubSub+ Event Brokers
              </a>{' '}
              page.
            </div>
          </Form.Item>
        </Col>
      </Row>
    </>
  );

  const Label = (
    <>
      <Tooltip
        title={isConnected ? 'Connected to Broker' : 'Disconnected to Broker'}
      >
        <LinkOutlined
          style={{
            padding: '10px',
            color: isConnected ? 'green' : 'red',
          }}
        />
      </Tooltip>
      Connect to Context Mesh
    </>
  );

  return (
    <div>
      <Collapse
        items={[
          {
            key: 'config',
            label: Label,
            children: ConnectionForm,
          },
        ]}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined
            style={{ fontSize: '20px', padding: '15px 0 0 0' }}
            rotate={isActive ? 90 : 0}
          />
        )}
        size="medium"
        defaultActiveKey={['config']}
      />
    </div>
  );
};

export default BrokerConfig;
