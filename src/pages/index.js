import React, { useState } from 'react';
import Layout from '../components/layout';
import SEO from '../components/seo';
import BrokerConfig from '../components/brokerConfig';
import Chat from '../components/chat';
import Query from '../components/query';
import { SolaceSession } from '../util/solaceSession';
import { Col, Row, Image, Button, Drawer } from 'antd';
import RealTimeRAG from '../images/realtimeRAG.png';

const IndexPage = () => {
  const [openLogs, setOpenLogs] = useState(false);

  const showDrawer = () => {
    setOpenLogs(true);
  };
  const onClose = () => {
    setOpenLogs(false);
  };

  return (
    <Layout>
      <SEO title="Solace Context Mesh" />
      <section id="broker-config">
        <Row justify="center" align="middle">
          <SolaceSession>
            <Col xs={20} sm={16} md={12} lg={12} xl={12}>
              <h1 style={{ textAlign: 'center' }}>Real-time RAG Chatbot</h1>
              <p style={{ textAlign: 'center' }}>
                An example of a Real-time RAG Chatbot using Solace Context Mesh
              </p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Image width={600} src={RealTimeRAG} />{' '}
                {/* Increase the width and center the image */}
              </div>
              <BrokerConfig />
              <div style={{ padding: '20px 0px 0px 0px' }}>
                <Chat />
              </div>
              <div style={{ padding: '20px 0px 0px 0px' }}>
                <Query />
              </div>
              <div style={{ padding: '20px 0px 0px 0px' }}>
                <Button color="default" variant="solid" onClick={showDrawer}>
                  Show Logs
                </Button>
                <Drawer
                  title="Solace Broker Logs"
                  onClose={onClose}
                  open={openLogs}
                >
                  <p>Logs will go here...</p>
                  <p>Subscribe to "demo/rag/query/response"</p>
                  <p>Subscribe to "demo/rag/query"</p>
                  <p>Subscribe to "demo/rag/data"</p>
                </Drawer>
              </div>
            </Col>
          </SolaceSession>
        </Row>
      </section>
    </Layout>
  );
};

export default IndexPage;
