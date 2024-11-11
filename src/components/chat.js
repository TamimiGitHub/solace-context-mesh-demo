import React, { useState, useEffect, useContext, useRef } from 'react';
import { SessionContext } from '../util/solaceSession';
import { Avatar, List } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import Solly from '../images/solly.png';
import User from '../images/user.png';

const Chat = () => {
  const { allChat } = useContext(SessionContext); // Use context
  const scrollableDivRef = useRef(null);
  useEffect(() => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTop =
        scrollableDivRef.current.scrollHeight;
    }
  }, [allChat]);

  return (
    <div
      id="scrollableDiv"
      ref={scrollableDivRef}
      style={{
        height: 400,
        overflow: 'auto',
        padding: '0 16px',
        border: '1px solid rgba(140, 140, 140, 0.35)',
        borderRadius: '8px', // Added border radius for rounded borders
      }}
    >
      <InfiniteScroll
        dataLength={allChat.length}
        scrollableTarget="scrollableDiv"
      >
        <List
          dataSource={allChat}
          renderItem={(chat) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={chat.query ? User : Solly} />}
                title={chat.query ? 'Query' : 'Response'}
                description={
                  chat.query ? (
                    <div>{chat.query}</div>
                  ) : (
                    <div>{chat.response}</div>
                  )
                }
              />
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  );
};

export default Chat;
