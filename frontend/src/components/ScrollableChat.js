import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { isDiffDate, isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../Config/ChatLogics';
import { ChatState } from '../Context/ChatProvider';
import { Avatar, Tooltip } from '@chakra-ui/react';
import dateFormat, { masks } from "dateformat";
import { Badge } from '@chakra-ui/react'

const ScrollableChat = ({messages}) => {
    const {user} = ChatState();
  return (
    <ScrollableFeed>
        {messages && messages.map((m,i) => (
            <div key={m._id}>
                {isDiffDate(messages,m,i) ? 
                    <span style={{margin:"10px",
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"center"}}>
                        <Badge >{dateFormat(m.createdAt, "DDDD") === 'Today' ? 'TODAY' : dateFormat(m.createdAt, "mmmm dd, yyyy")}</Badge>
                    </span>    
                        :  <></>
                }
                <div style={{display: "flex"}}>
                    {(isSameSender(messages,m,i,user._id) || isLastMessage(messages,i,user._id)) && (
                        <Tooltip
                            label={m.sender.name}
                            placement='bottom-start'
                            hasArrow
                        >
                            <Avatar
                                marginTop="7px"
                                marginRight={1}
                                size="sm"
                                cursor="pointer"
                                name={m.sender.name}
                                src={m.sender.pic}
                                />
                        </Tooltip>
                    )}   
                    <span
                        style={{
                            background: `${m.sender._id === user._id ? "#a1dcfd" : "#80f5ad"}`,
                            borderRadius: `${m.sender._id === user._id ? "15px 0px 15px 15px" : "0px 15px 15px 15px"}`, 
                            padding: "5px 15px", maxWidth: "75%",
                            marginLeft: isSameSenderMargin(messages,m,i,user._id),
                            marginTop: isSameUser(messages, m, i) ? 3 : 10,
                        }}
                        >
                        {m.content} 
                        <span
                            style={{color: '#030303',
                                    paddingLeft: '5px',
                                    paddingBottom: '0px',
                                    fontSize: '11px',
                                    margin: '5px 0px 0px 5px',
                            }}
                        >
                            {dateFormat(m.createdAt, "h:MM TT")}
                        </span>

                    </span>
                </div>
            </div>
        ))}
    </ScrollableFeed>
  )
}

export default ScrollableChat
